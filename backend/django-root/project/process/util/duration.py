import librosa
import soundfile as sf


def get_duration(file_path):
    y, sr = librosa.load(file_path)

    return librosa.get_duration(y=y, sr=sr)


def change_duration(file_path, save_path, target_duration_s):
    y, sr = librosa.load(file_path)

    original_duration = librosa.get_duration(y=y, sr=sr)

    y_slow = librosa.effects.time_stretch(y, rate=original_duration / target_duration_s)

    sf.write(save_path, y_slow, sr)
