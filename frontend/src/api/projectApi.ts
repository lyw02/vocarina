const baseUrl = "http://127.0.0.1:8000/";

export const processAudio = async (data: any) => {
  const response = await fetch(baseUrl + "api/project/audio/process/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:5173", // 与Django中配置的CORS_ALLOWED_ORIGINS相匹配
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
