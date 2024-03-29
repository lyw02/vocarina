from parselmouth.praat import call

from .loadSound import load_sound_parselmouth
from .pitchDetect import get_average_pitch


def change_pitch_to_average(audio_content):
    sound, temp_file_path = load_sound_parselmouth(audio_content)

    manipulation = call(sound, "To Manipulation", 0.01, 75, 600)

    pitch_tier = call(manipulation, "Extract pitch tier")

    mean_pitch = get_average_pitch(temp_file_path)
    duration = sound.get_total_duration()

    call(pitch_tier, "Remove points between...", 0, duration)
    call(pitch_tier, "Add point...", duration / 2, mean_pitch)

    call([pitch_tier, manipulation], "Replace pitch tier")

    return call(manipulation, "Get resynthesis (overlap-add)")


def change_pitch(audio_content, factor):
    sound, _ = load_sound_parselmouth(audio_content)

    manipulation = call(sound, "To Manipulation", 0.01, 75, 600)

    pitch_tier = call(manipulation, "Extract pitch tier")

    call(pitch_tier, "Multiply frequencies", sound.xmin, sound.xmax, factor)

    call([pitch_tier, manipulation], "Replace pitch tier")
    return call(manipulation, "Get resynthesis (overlap-add)")
