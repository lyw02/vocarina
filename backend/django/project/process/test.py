import base64


def get_audio(base64_audio_list: list[str]):
    for i, base64_audio in enumerate(base64_audio_list):
        # 解码base64字符串
        audio_data = base64.b64decode(base64_audio)

        # 将解码的音频数据写入一个文件
        with open(rf'C:\Users\Jerry\Desktop\audio-{i}.wav', 'wb') as f:
            f.write(audio_data)


if __name__ == '__main__':
    get_audio()
