import { PianoKey } from "@/types";

export const keyNameList: string[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const pianoKeys = (): PianoKey[] => {
  const blackKeyList: number[] = [1, 3, 6, 8, 10];
  let pianoKeys: PianoKey[] = [];
  let KeyId: number = 1;
  for (let octaveIndex = 0; octaveIndex <= 8; octaveIndex++) {
    for (let keyIndex = 0; keyIndex < 12; keyIndex++) {
      blackKeyList.includes(keyIndex)
        ? pianoKeys.push({
            id: KeyId,
            octave: octaveIndex,
            color: "black",
            name: keyNameList[keyIndex],
          })
        : pianoKeys.push({
            id: KeyId,
            octave: octaveIndex,
            color: "white",
            name:
              keyNameList[keyIndex] === "C"
                ? keyNameList[keyIndex] + octaveIndex
                : keyNameList[keyIndex],
          });
      KeyId++;
    }
  }
//   console.log(pianoKeys);
  return pianoKeys;
};
