import { parsePostData } from "../utils/parseNote";

const baseUrl = "http://127.0.0.1:8000/";

async function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const processAudio = (notes) => {
  console.log(JSON.stringify(parsePostData(notes)));
  fetch(baseUrl + "api/project/audio/process/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',  // 与Django中配置的CORS_ALLOWED_ORIGINS相匹配
    },
    body: JSON.stringify(parsePostData(notes)),
  })
    // .then((response) => response.text())
    .then(async (response) => {
      const audioBlob = await response.blob();
      const audioBase64 = await convertBlobToBase64(audioBlob);

      // console.log("response: " + JSON.stringify(response));
      // const base64Data = atob(response);
      const audio = new Audio();
      audio.src = "data:audio/wav;base64," + audioBase64;
      audio.play();
      return audio;
    })
    .catch((error) => console.error("Error fetching audio:", error));
};
