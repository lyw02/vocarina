const baseUrl = "http://127.0.0.1:8000/";

export const register = async (username, password) => {
  const response = await fetch(baseUrl + "api/user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(baseUrl + "api/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}