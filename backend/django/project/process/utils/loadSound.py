import base64
import io
import tempfile

import parselmouth
from pydub import AudioSegment


def load_sound_parselmouth(audio_content):
    audio_bytes = base64.b64decode(audio_content)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
        temp_file.write(audio_bytes)
        temp_file_path = temp_file.name

    return parselmouth.Sound(temp_file_path), temp_file_path


def load_sound_pydub(audio_content):
    audio_data = base64.b64decode(audio_content)

    audio_file = io.BytesIO(audio_data)

    return AudioSegment.from_file(audio_file, format="wav")
