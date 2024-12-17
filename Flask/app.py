from flask import Flask, jsonify, request
import pika
import base64
import json
from threading import Thread
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import wave
import whisper

from cosine_similarity import calculate_cosine_similarity

# executor = ThreadPoolExecutor(1)
executor = ProcessPoolExecutor()
app = Flask(__name__)

# Global variables for RabbitMQ connection and channel
rabbitmq_connection = None
rabbitmq_channel = None

# Dictionary to hold chunks for each audio stream
audio_streams = {}


def process_audio_chunk(ch, method, properties, body):
    try:
        # Decode the received body from JSON
        message = json.loads(body)

        # Extract metadata
        audio_id = message.get('audioId')
        chunk_number = message.get('chunkNumber')
        base64_audio_data = message.get('audioData')
        is_last_chunk = message.get('isLastChunk', False)

        if not audio_id or base64_audio_data is None:
            print("Missing audioId or audioData")
            return

        # Decode base64 audio data to binary
        audio_data = base64.b64decode(base64_audio_data)

        # Initialize stream for audioId if not present
        if audio_id not in audio_streams:
            audio_streams[audio_id] = []

        # Append chunk to the stream (stored as a tuple with chunk_number)
        audio_streams[audio_id].append((chunk_number, audio_data))

        print(f"Received chunk {chunk_number} for audioId {audio_id}")

        # If this is the last chunk, assemble the full audio
        if is_last_chunk:
            # Sort chunks by chunk number to ensure correct order
            sorted_chunks = sorted(audio_streams[audio_id], key=lambda x: x[0])

            # Assemble the audio using the wave module
            output_file = assemble_audio(audio_id, sorted_chunks)

            if output_file:
                # Signal to transcribe the audio after the last chunk is received
                executor.submit(transcribe_audio, output_file, audio_id)

            # Remove the stream from memory
            del audio_streams[audio_id]

        # Acknowledge the message
        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print(f"Error processing audio chunk: {e}")
        # Always acknowledge the message to avoid message reprocessing
        ch.basic_ack(delivery_tag=method.delivery_tag)


# Function to assemble audio chunks into a proper WAV file
def assemble_audio(audio_id, sorted_chunks):
    output_file = f"assembled_audio_{audio_id}.wav"

    # Set parameters for the WAV file (modify based on your actual audio format)
    channels = 1  # Mono audio
    sample_width = 2  # 16-bit audio
    frame_rate = 16000  # 16kHz sample rate (modify based on your audio format)

    try:
        with wave.open(output_file, 'wb') as wav_file:
            # Set the parameters for the WAV file
            wav_file.setnchannels(channels)
            wav_file.setsampwidth(sample_width)
            wav_file.setframerate(frame_rate)

            # Concatenate and write all chunks to the WAV file
            for _, chunk in sorted_chunks:
                wav_file.writeframes(chunk)

        print(f"Audio file {output_file} completed for audioId {audio_id}")
        return output_file

    except Exception as e:
        print(f"Error assembling WAV file for audioId {audio_id}: {e}")
        return None


# Function to transcribe the assembled audio file using Whisper
def transcribe_audio(output_file, audio_id):
    try:
        print(f"\n-- Transcribing audio for audioId {audio_id} --\n")
        model = whisper.load_model("medium")

        # Transcribe the audio file
        transcribe_result = model.transcribe(output_file)

        # Write transcription to a text file
        with open('transcription.txt', 'a') as f:
            f.write(f"Transcription for audioId {audio_id}:\n")
            f.write(transcribe_result['text'] + "\n\n")

        print(f"Transcription for audioId {audio_id} completed.")
        print(transcribe_result['text'])

    except Exception as e:
        print(f"Error during transcription for audioId {audio_id}: {e}")


# Function to establish RabbitMQ connection and channel
def setup_rabbitmq_connection():
    global rabbitmq_connection, rabbitmq_channel
    if not rabbitmq_connection or not rabbitmq_channel:
        try:
            # Define the RabbitMQ connection parameters
            rabbitmq_connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='localhost')
            )
            rabbitmq_channel = rabbitmq_connection.channel()

            # Declare the queue to consume
            rabbitmq_channel.queue_declare(queue='audio-stream', durable=True)
            print("Connected to RabbitMQ")

        except Exception as e:
            print(f"Error establishing RabbitMQ connection: {e}")
            return None

    return rabbitmq_channel


# RabbitMQ consumer setup
def rabbitmq_consume():
    channel = setup_rabbitmq_connection()

    if not channel:
        print("Failed to initialize RabbitMQ channel")
        return

    def callback(ch, method, properties, body):
        # Process the received audio chunk
        process_audio_chunk(ch, method, properties, body)

    # Set up consumption
    channel.basic_consume(queue='audio-stream',
                          on_message_callback=callback, auto_ack=False)

    print('Listening for audio chunks on RabbitMQ queue...')
    try:
        channel.start_consuming()
    except Exception as e:
        print(f"Error consuming messages from RabbitMQ: {e}")
        channel.stop_consuming()


@app.route('/recommend-questions', methods=['POST'])
def recommend_questions():
    # Load questions from JSON file
    with open("questions.json", "r") as f:
        questions_data = json.load(f)

    # Get user expertise and level from the request
    user_data = request.get_json()
    user_expertise = user_data.get("expertise", [])
    user_level = user_data.get("level")

    # Validate input
    if not user_expertise:
        return jsonify({"error": "No expertise provided"}), 400
    if not user_level:
        return jsonify({"error": "No level provided"}), 400

    # Filter questions by level
    filtered_questions = [
        q for q in questions_data if q.get("level") == user_level]

    # Calculate cosine similarity scores for each question
    scored_questions = []
    for question in filtered_questions:
        question_keywords = question["keywords"]
        similarity_score = calculate_cosine_similarity(
            user_expertise, question_keywords)
        scored_questions.append((question["question"], similarity_score))

    # Sort questions by similarity score in descending order and get top 5
    top_questions = sorted(
        scored_questions, key=lambda x: x[1], reverse=True)[:5]
    top_questions_list = [q[0]
                          for q in top_questions]  # Extract only question text

    # Return the top 5 questions
    return jsonify({"recommended_questions": top_questions_list}), 200


@app.route('/')
def index():
    return "Flask is running."


if __name__ == "__main__":
    # Run the RabbitMQ consumer in the background when Flask starts
    rabbitmq_thread = Thread(target=rabbitmq_consume)
    rabbitmq_thread.daemon = True
    rabbitmq_thread.start()

    # Run the Flask app
    app.run(debug=True, host="0.0.0.0", port=5001)
