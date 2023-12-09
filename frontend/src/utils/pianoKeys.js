export const pianoKeys = () => {
  const blackKeyList = [1, 3, 6, 8, 10];
  const keyNameList = [
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
  let pianoKeys = [];
  let KeyId = 1;
  for (let groupIndex = 0; groupIndex <= 8; groupIndex++) {
    for (let keyIndex = 0; keyIndex < 12; keyIndex++) {
      blackKeyList.includes(keyIndex)
        ? pianoKeys.push({
            id: KeyId,
            group: groupIndex,
            color: "black",
            name: keyNameList[keyIndex],
          })
        : pianoKeys.push({
            id: KeyId,
            group: groupIndex,
            color: "white",
            name:
              keyNameList[keyIndex] === "C"
                ? keyNameList[keyIndex] + groupIndex
                : keyNameList[keyIndex],
          });
      KeyId++;
    }
  }
  // console.log(pianoKeys);
  return pianoKeys;
};
