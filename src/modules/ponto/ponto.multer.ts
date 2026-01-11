import multer from "multer";

export const uploadImagemPonto = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
