import crypto from "node:crypto";

export const createAHash = (stringToHash) => {
  const hash = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return hash;
};
