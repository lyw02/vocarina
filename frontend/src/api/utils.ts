const baseUrl = "http://127.0.0.1:8000/";

export const postReq = async (path: string, body: object) => {
  return await fetch(baseUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const getReq = async (path: string) => {
  return await fetch(baseUrl + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
