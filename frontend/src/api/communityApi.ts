import { Sentence } from "@/types/project";
import { postReq } from "./utils";

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
