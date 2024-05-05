import fs from "fs";
import path from "path";

export const errorHandler = (err, req, res, next) => {
  const filePath = path.join(__appdir, "logs", "error.log");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal Server Error";

  const message = `Method: ${req.method} URL: ${req.originalUrl}
Date: ${new Date().toLocaleDateString("sv-SE")} 
Time: ${new Date().toLocaleTimeString("sv-SE")} 
Success: ${err.success} - Message: ${err.message}\n`;

  fs.appendFileSync(filePath, message);
  res
    .status(err.statusCode)
    .json({ success: err.success, message: err.message });
};
