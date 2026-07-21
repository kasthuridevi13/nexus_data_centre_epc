import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const ok = ["application/pdf", "text/plain"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PDF or TXT files are supported"), ok);
  },
});
