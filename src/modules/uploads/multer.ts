import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const upload = multer({
    storage: multer.diskStorage({
        destination: (_req, file, cb) => {
            const tipo = (_req.body?.tipo || "misc").toString();
            const dir = path.join(process.cwd(), "uploads", tipo);
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
