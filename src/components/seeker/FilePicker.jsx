import ImageWithFallback from "../ui/ImageWithFallback";
import { useEffect, useRef, useState } from "react";
import {
  validateFiles,
  DOCUMENT_ACCEPT,
  IMAGE_ACCEPT,
  fileSize,
} from "../../utils/seekerFiles";
export default function FilePicker({
  image = false,
  multiple = false,
  onChange,
  disabled = false,
  label = "Choose documents",
  existingImage,
}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const objectUrl = useRef("");
  // Release the temporary browser image when this picker unmounts.
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );
  function choose(event) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected.length) return;
    const message = validateFiles(selected, image);
    setError(message);
    if (message) {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = "";
      setFiles([]);
      setPreview("");
      onChange([]);
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = image ? URL.createObjectURL(selected[0]) : "";
    setPreview(objectUrl.current);
    setFiles(selected);
    onChange(selected);
  }
  function clear() {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = "";
    setPreview("");
    setFiles([]);
    setError("");
    onChange([]);
  }
  return (
    <div className={`seeker-file-picker ${image ? "image-picker" : ""}`}>
      {image && (
        <div className="profile-photo">
          <ImageWithFallback
            src={preview || existingImage}
            alt="Profile preview"
            fallback={<span aria-hidden="true">↗</span>}
          />
        </div>
      )}
      <label className={`file-pick-label ${disabled ? "disabled" : ""}`}>
        <span>{label} ↗</span>
        <input
          aria-label={label}
          type="file"
          accept={image ? IMAGE_ACCEPT : DOCUMENT_ACCEPT}
          multiple={multiple}
          disabled={disabled}
          onChange={choose}
        />
      </label>
      <p>
        {image
          ? "JPG, PNG or WEBP"
          : "PDF, DOC, DOCX, JPG or PNG · up to 5 files"}{" "}
        · 5 MB each
      </p>
      {files.length > 0 && (
        <>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} <span>{fileSize(file.size)}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="text-action"
            disabled={disabled}
            onClick={clear}
          >
            Clear selection
          </button>
        </>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
