import { Router } from "express";
import { upload } from "./multer";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import { uploadToR2 } from "../../utils/r2-upload";

export const uploadRouter = Router();

uploadRouter.post(
    "/",
    requireAuth,
    requireRole("MESTRE"),
    upload.single("file"),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        const tipo = (req.body?.tipo || "misc").toString();

        const url = await uploadToR2(req.file, `uploads/${tipo}`);

        res.status(201).json({ url });
    }
);
