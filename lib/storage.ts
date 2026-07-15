import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { slugify } from "@/lib/utils";

const maxImageSize = 5 * 1024 * 1024;

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"]
]);

function validateImage(file: File) {
  const extension = allowedTypes.get(file.type);

  if (!extension) {
    throw new Error("Envie uma imagem JPG, PNG, WEBP ou GIF.");
  }

  if (file.size > maxImageSize) {
    throw new Error("A imagem precisa ter no máximo 5 MB.");
  }

  return extension;
}

function canUploadToCloudinary() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

async function uploadToCloudinary(file: File, fallbackName: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const rawName = file.name.replace(/\.[^.]+$/, "");
  const publicId = `${slugify(rawName).slice(0, 48) || fallbackName}-${randomUUID()}`;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "savor";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha1")
    .update(`folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Não foi possível enviar a imagem para o storage externo.");
  }

  const result = (await response.json()) as { secure_url?: string };

  if (!result.secure_url) {
    throw new Error("O storage externo não retornou uma URL para a imagem.");
  }

  return result.secure_url;
}

async function saveToLocalUploads(file: File, fallbackName: string, extension: string) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const rawName = file.name.replace(/\.[^.]+$/, "");
  const safeName = slugify(rawName).slice(0, 48) || fallbackName;
  const fileName = `${safeName}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `/uploads/${fileName}`;
}

export async function saveUploadedImage(formData: FormData, key = "imageFile", fallbackName = "receita") {
  const file = formData.get(key);

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const extension = validateImage(file);

  if (canUploadToCloudinary()) {
    return uploadToCloudinary(file, fallbackName);
  }

  return saveToLocalUploads(file, fallbackName, extension);
}
