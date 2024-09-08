// import { UserAttributes, createClient } from "@supabase/supabase-js";

import { UserAttributes } from "@supabase/supabase-js";
import { supabase } from "./utils";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

export const register = async (
  displayName: string,
  email: string,
  password: string
) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
};

export const login = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
};

export const getUser = async () => {
  return await supabase.auth.getUser();
};

export const logout = async () => {
  return await supabase.auth.signOut();
};

export const updateUserInfo = async (attributes: UserAttributes) => {
  return await supabase.auth.updateUser(attributes);
};
