import os
import tempfile

import librosa
import soundfile as sf

from .oss import *


def get_duration(file_path):
    # audio_object = get_file_object(file_path)
    # audio_content = audio_object.read()

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        audio_object = get_file_object(file_path)
        audio_object_data = audio_object.read()
        tmp.write(audio_object_data)
        tmp.flush()
        os.fsync(tmp.fileno())
        tmp.close()

        y, sr = librosa.load(tmp.name)

    return librosa.get_duration(y=y, sr=sr)


def change_duration(file_path, save_path, target_duration_s):
    audio_object = get_file_object(file_path)
    audio_content = audio_object.read()

    y, sr = librosa.load(audio_content)

    original_duration = librosa.get_duration(y=y, sr=sr)

    y_slow = librosa.effects.time_stretch(y, rate=original_duration / target_duration_s)

    # sf.write(save_path, y_slow, sr)

    # Create temp file
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        sf.write(tmp.name, y_slow, sr)

        upload_file_from_local(save_path, tmp.name)

    # Remove temp file
    os.remove(tmp.name)
