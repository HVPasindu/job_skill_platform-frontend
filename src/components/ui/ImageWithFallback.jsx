import { useState } from "react";
// Native image loading/decoding keeps covers light; a failed URL returns the existing artwork.
export default function ImageWithFallback(props) {
  return <Image key={props.src || "empty"} {...props} />;
}
function Image({ src, fallback, alt = "", ...props }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback;
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
