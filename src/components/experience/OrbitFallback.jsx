// CSS-only illustration: instant first paint while the optional WebGL chunk loads.
export default function OrbitFallback({ quiet = false }) {
  return (
    <div className={`orbit-fallback ${quiet ? "quiet" : ""}`}>
      <div className="fallback-ring ring-a" />
      <div className="fallback-ring ring-b" />
      <div className="fallback-ring ring-c" />
      <div className="fallback-core" />
      <div className="fallback-moon" />
    </div>
  );
}
