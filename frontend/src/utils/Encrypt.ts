import CryptoJS from "crypto-js";

export const encryptPassword = (password: string) => {
  let hash = CryptoJS.SHA256(password);
  let hex = hash.toString(CryptoJS.enc.Hex);
  return hex;
};
