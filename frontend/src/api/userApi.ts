import { postReq } from "./utils";

export const register = async (username: string, password: string) => {
  const response = await postReq("api/user/auth/?action=register", { username, password });
  return response;
};

export const login = async (username: string, password: string) => {
  const response = await postReq("api/user/auth/?action=login", { username, password });
  return response;
};
