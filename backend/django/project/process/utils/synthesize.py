import base64
import io
import os
import tempfile

import azure.cognitiveservices.speech as speechsdk

from dotenv import load_dotenv
from pydub import AudioSegment

from .oss import *

load_dotenv()

SPEECH_KEY = os.environ.get('MS_SPEECH_KEY')
SPEECH_REGION = os.environ.get('MS_SPEECH_REGION')


def tts_legacy(text, save_dir, save_name):
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=False, filename=rf"{save_dir}{save_name}")
    speech_config.speech_synthesis_voice_name = 'en-US-JennyNeural'

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    result = speech_synthesizer.speak_text_async(text).get()

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        # Get the audio data as bytes
        audio_data = result.audio_data
        # Convert audio data to base64
        base64_audio = base64.b64encode(audio_data).decode('utf-8')
        return base64_audio
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(cancellation_details.error_details))
                print("Did you set the speech resource key and region values?")
        return None


def generate_silence(duration: float):
    silence = AudioSegment.silent(duration=duration*1000)

    silence_file = io.BytesIO()
    silence.export(silence_file, format="wav")
    silence_data = silence_file.getvalue()
    silence_base64 = base64.b64encode(silence_data).decode("utf-8")

    print("[INFO] Generate silence.")
    return silence_base64


def tts(text, save_dir, save_name):
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True, filename=None)

    speech_config.speech_synthesis_voice_name = 'en-US-JennyNeural'

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

    if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:

        try:

            # upload_file_directly(f"{save_dir}{save_name}", speech_synthesis_result)
            with tempfile.NamedTemporaryFile(delete=False) as fp:
                fp.write(speech_synthesis_result.audio_data)
                upload_file_directly(f"{save_dir}{save_name}", fp.name)
            print("[INFO] Speech synthesized for text [{}]".format(text))
        except Exception as e:
            print(f"Unable to upload {save_name}: {e}")
    elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_synthesis_result.cancellation_details
        print("[INFO] Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(cancellation_details.error_details))
                print("Did you set the speech resource key and region values?")