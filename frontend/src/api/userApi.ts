import { fetchData } from "./utils";

export const register = async (username: string, password: string) => {
  const response = await fetchData("api/user/auth/?action=register", "POST", { username, password });
  return response;
};

export const login = async (username: string, password: string) => {
  const response = await fetchData("api/user/auth/?action=login", "POST", { username, password });
  return response;
};
