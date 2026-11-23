import { API_BASE_URL } from "../api/axiosInstance";
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
export const DOCUMENT_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp";
export function validateFiles(files, image = false) {
  if (!files.length) return "Choose a file first.";
  if (files.length > (image ? 1 : 5))
    return image ? "Choose one image." : "Choose up to 5 files per upload.";
  for (const file of files) {
    if (!(image ? imageTypes : documentTypes).includes(file.type))
      return image
        ? "Use JPG, PNG or WEBP for your photo."
        : "Use PDF, DOC, DOCX, JPG or PNG documents.";
    if (file.size > MAX_FILE_BYTES) return `${file.name} is larger than 5 MB.`;
    if (file.size === 0) return `${file.name} is empty.`;
  }
  return "";
}
export function canParse(document) {
  return (
    document.file_type !== "application/msword" &&
    [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ].includes(document.file_type)
  );
}


export function fileUrl(path) {
  if (!path) return "";

  try {
    const apiOrigin = new URL(API_BASE_URL);

    const url = new URL(
      String(path).replaceAll("\\", "/"),
      `${apiOrigin.origin}/`,
    );

    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    const hostname = url.hostname
      .toLowerCase()
      .replace(/^\[|\]$/g, "")
      .replace(/\.$/, "");

    const isLocalUrl =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      /^127(?:\.\d{1,3}){3}$/.test(hostname);

    if (isLocalUrl) {
      url.protocol = apiOrigin.protocol;
      url.host = apiOrigin.host;
      url.port = apiOrigin.port;
    }

    return url.href;
  } catch {
    return "";
  }
}


export function fileSize(bytes) {
  const value = Number(bytes) || 0;
  return value >= 1024 * 1024
    ? `${(value / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.ceil(value / 1024)} KB`;
}
export function dateInput(value) {
  return value ? String(value).slice(0, 10) : "";
}
export function asBoolean(value) {
  return value === true || value === 1 || value === "1";
}
