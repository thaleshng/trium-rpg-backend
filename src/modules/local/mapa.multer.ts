import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const dir = path.join(process.cwd(), "uploads", "mapas", "locais");

fs.mkdirSync(dir, { recursive: true });

export const uploadMapa = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, dir);
        },
        filename: (_req, file, cb) => {
            const safeName = sanitizeFileName(file.originalname);
            cb(null, safeName);
        }
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
});

function sanitizeFileName(name: string) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
}
