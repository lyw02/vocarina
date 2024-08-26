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

export const putReq = async (path: string, body: object) => {
  return await fetch(baseUrl + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
