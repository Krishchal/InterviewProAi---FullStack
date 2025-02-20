from pydub import AudioSegment
import os

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def convert_to_wav(audio_path):
    """
    Convert the audio file to WAV format to ensure compatibility.
    """
    # Load the audio file with pydub
    audio = AudioSegment.from_file(audio_path)

    # Convert to WAV and save it
    wav_path = os.path.splitext(audio_path)[0] + ".wav"
    audio.export(wav_path, format="wav")

    return wav_path
