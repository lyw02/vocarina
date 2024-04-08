const baseUrl = "http://127.0.0.1:8000/";

export const fetchData = async (path: string, method: string, body: object) => {
  return await fetch(baseUrl + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
