# import os
# import whisper
# from Utils.publisher import publish_message
# model = whisper.load_model("medium")


# def transcribe_audio(audio_path):
#     """
#     Transcribe audio using the Whisper model in a background thread.
#     The transcription result is printed to the console.
#     """
#     try:
#         pid = os.getpid()  # Get the process ID
#         print(
#             f"\n--Process {pid} is starting to process file: {audio_path}")

#         # Perform transcription
#         print(f"\n[*]Transcribing audio: {audio_path}\n")
#         result = model.transcribe(audio_path)
#         print(f'\nTranscribed text:: {result['text']}\n')
#         publish_message("transcribed-text", result['text'])
#         # calculate_cosine_similarity()

#     except Exception as e:
#         # In case of error, print the error message
#         print(f"Error during transcription of {audio_path}: {str(e)}")
#     finally:
#         # Clean up the processed audio files after processing
#         if os.path.exists(audio_path):
#             os.remove(audio_path)  # Remove the converted WAV file


# if __name__ == "__main__":
#     audio_filename = ""
#     transcribe_audio(f"uploads/{audio_filename}")


import os
import whisper
from Utils.publisher import publish_message
import torch
from Services.answer_match_engine import answer_match
import json
# if torch.cuda.is_available():  # Should return True if GPU is available
#     print(torch.cuda.current_device())  # Should return the GPU index (e.g., 0)
#     print(torch.cuda.get_device_name(0))  # Should return your GPU model name

# Check if CUDA is available and use GPU; otherwise, use CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Load the model on the selected device
model = whisper.load_model("medium", device=device)


def transcribe_audio(audio_path, metadata):
    """
    Transcribe audio using the Whisper model on the specified device (GPU or CPU).
    The transcription result is printed to the console.
    """
    try:
        pid = os.getpid()  # Get the process ID
        print(f"\n--Process {pid} is starting to process file: {audio_path}")

        # Perform transcription
        print(f"\n[*]Transcribing audio: {audio_path}\n")
        result = model.transcribe(audio_path)
        print(f'\nTranscribed text: {result["text"]}\n')
        print(f'\n\n--- metadata:: {metadata}\n\n')
        if result['text']:
            try:
                report = answer_match(
                    metadata['question_id'], result['text'])
            except Exception as e:
                print(f"Error in answer matching: {str(e)}")

            data_to_send = {"id": metadata["question_id"], "question": metadata["question"], "transcribed_text": result["text"],
                            "token": metadata["token"], "loggedInEmail": metadata["loggedInEmail"], "session_id": metadata["session_id"], "report": report}
            print(f'\n------ data_to_send:: {data_to_send} ----\n')
            try:
                publish_message("transcribed-text", json.dumps(data_to_send))
            except Exception as e:
                print(f"Error publishing message: {str(e)}")
        else:
            print("f\nTranscribed text is empty")
    except Exception as e:
        print(f"Error during transcription of {audio_path}: {str(e)}")
    finally:
        if os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                print(f"File {audio_path} removed successfully.")
            except Exception as e:
                print(f"Error removing file {audio_path}: {str(e)}")
