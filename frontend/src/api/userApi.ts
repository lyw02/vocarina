import { userInfo } from "@/pages/AuthPages/ProfilePage/UserInfoPanel";
import { getReq, postReq, putReq } from "./utils";

export const register = async (
  username: string,
  password: string,
  recaptcha: string | null | undefined
) => {
  const response = await postReq("api/user/auth/?action=register", {
    username,
    password,
    recaptcha,
  });
  return response;
};

export const login = async (username: string, password: string) => {
  const response = await postReq("api/user/auth/?action=login", {
    username,
    password,
  });
  return response;
};

export const getUserInfo = async (id: number) => {
  const response = await getReq(`api/user/${id}/`);
  return response;
}

export const updateUserInfo = async (id: number, info: userInfo) => {
  const response = await putReq(`api/user/${id}/`, info);
  return response;
}
