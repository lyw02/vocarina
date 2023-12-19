import { parsePostData } from "../utils/parseNote";

const baseUrl = "http://127.0.0.1:8000/";

export const processAudio = async (workDir, fileName, notes) => {
  console.log(JSON.stringify(parsePostData(notes)));
  await fetch(baseUrl + "project/audio/process/", {
    method: "POST",
    body: JSON.stringify(parsePostData(notes)),
  })
    // .then((response) => response.arrayBuffer())
    .then(() => {
      // let data = workDir + fileName;
      // const audioContext = new (window.AudioContext ||
      //   window.webkitAudioContext)();
      // const audioElement = new Audio(data);
      // const audioSource = audioContext.createMediaElementSource(audioElement);
      // audioSource.connect(audioContext.destination);
      // audioElement.play();
      console.log("Generate ok.");
    })
    .catch((error) => console.error("Error fetching audio:", error));
};
