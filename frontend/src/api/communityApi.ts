import { Sentence } from "@/types/project";
import { getReq, postReq } from "./utils";

export const publishProject = async (
  username: string,
  userId: number,
  name: string,
  data: string[],
  lyrics: { [id: number]: Sentence[] }
) => {
  const response = await postReq(`api/music/?action=publish`, {
    username: username,
    user_id: userId,
    project_name: name,
    data: data,
    lyrics: lyrics,
  });
  return response;
};

export const getAllMusic = async (page: number) => {
  const response = await getReq(`api/music/?page=${page}`);
  return response;
};

export const getAllMusicOfUser = async (id: number, page: number) => {
  const response = await getReq(`api/music/?user_id=${id}&page=${page}`);
  return response;
};

export const getAllPlaylists = async (page: number) => {
  const response = await getReq(`api/playlist/?page=${page}`);
  return response;
};

export const createPlaylist = async (
  userId: number,
  title: string,
  description: string | undefined
) => {
  console.log(userId, title, description);
  const response = await postReq(`api/playlist/`, {
    user_id: userId,
    title: title,
    description: description,
  });
  return response;
};

export const savePlaylist = async (userId: number, playlistId: number) => {
  const response = await postReq(`api/user/${userId}/playlist/`, {
    playlist_id: playlistId,
  });
  return response;
};

export const getCreatedPlaylist = async (userId: number) => {
  const response = await getReq(`api/user/${userId}/created_playlist/`);
  return response;
};

export const getSavedPlaylist = async (userId: number) => {
  const response = await getReq(`api/user/${userId}/saved_playlist/`);
  return response;
};
