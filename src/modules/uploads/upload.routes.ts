import { Router } from "express";
import { upload } from "./multer";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";

export const uploadRouter = Router();

uploadRouter.post(
    "/",
    requireAuth,
    requireRole("MESTRE"),
    upload.single("file"),
    (req, res) => {
        console.log("Upload recebido:");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        const tipo = req.body?.tipo || "misc";
        const url = `${req.protocol}://${req.get("host")}/uploads/${tipo}/${req.file.filename}`;
        console.log("✅ Upload salvo em:", url);
        res.status(201).json({ url });
    }
);
