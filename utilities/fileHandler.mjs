import fs from "fs";
import path from "path";

export const writeFile = (folderName, fileName, data) => {
  try {
    const filePath = path.join(__appdir, folderName, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
