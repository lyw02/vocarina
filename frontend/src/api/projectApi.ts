import { getReq, postReq, supabase } from "./utils";

const baseUrl = "http://127.0.0.1:8000/";

export const processAudio = async (data: any) => {
  console.log("data:", data);
  const response = await fetch(baseUrl + "api/project/audio/process/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:5173", // Align with CORS_ALLOWED_ORIGINS in Django settings
    },
    body: JSON.stringify(data),
  });
  console.log("response:", response);
  return response.json();
};

export const saveProject = async (data: any) => {
  const response = await fetch(baseUrl + "api/project/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const listProject = async (userId: number) => {
  const response = await getReq(`api/project/?user_id=${userId}`);
  return response;
};

export const loadProject = async (projectId: number) => {
  const response = await getReq(`api/project/${projectId}/?action=load`);
  return response;
};

// ========= NEW =========

export const saveProjectSupabase = async (payload: {
  id?: number,
  name: string;
  user_id: string;
  tracks: object;
}) => {
  return await supabase.from("project").upsert(payload).select();
};
