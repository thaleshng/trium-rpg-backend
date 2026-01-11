import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2";

function sanitize(name: string) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadToR2(
    file: Express.Multer.File,
    folder: string,
    suffix?: string
) {
    const safeName = sanitize(file.originalname);

    const key = suffix
        ? `${folder}/${safeName.replace(/\.(\w+)$/, `-${suffix}.$1`)}`
        : `${folder}/${safeName}`;

    await r2.send(
        new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: "public, max-age=31536000, immutable",
        })
    );

    return `${process.env.R2_PUBLIC_BASE_URL}/${key}`;
}

