import base64
import io

import librosa


def get_duration(audio_content):
    y, sr = librosa.load(audio_content)

    return librosa.get_duration(y=y, sr=sr)


def change_duration(audio_content, target_duration_s):

    audio_file = io.BytesIO(base64.b64decode(audio_content))

    y, sr = librosa.load(audio_file)

    original_duration = librosa.get_duration(y=y, sr=sr)

    y_slow = librosa.effects.time_stretch(y, rate=original_duration / target_duration_s)

    return y_slow, sr
