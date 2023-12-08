from pydub import AudioSegment


def remove_silence_from_audio(file_path, save_path):
    sound = AudioSegment.from_file(file_path)

    # remove silence in start and end
    start_trim = detect_leading_silence(sound)
    end_trim = detect_leading_silence(sound.reverse())

    trimmed_audio = sound[start_trim:len(sound)-end_trim]

    trimmed_audio.export(save_path, format="wav")


def detect_leading_silence(sound, silence_threshold=-50.0, chunk_size=10):
    """
    sound is a pydub.AudioSegment
    silence_threshold in dB
    chunk_size in ms
    iterate over chunks until you find the first one with sound
    """
    trim_ms = 0  # ms

    assert chunk_size > 0  # to avoid infinite loop
    while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold and trim_ms < len(sound):
        trim_ms += chunk_size

    return trim_ms
