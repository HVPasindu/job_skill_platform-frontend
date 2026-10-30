// Lightweight CSS transform animation, not another canvas or animation library.
export default function KineticMarquee() {
  return (
    <div
      className="kinetic-strip"
      aria-label="Find your direction. Build your confidence. Move forward."
    >
      <div className="kinetic-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <span key={copy}>
            Find your direction <b>✳</b> Build your confidence <b>✳</b> Move
            forward <b>✳</b>
          </span>
        ))}
      </div>
    </div>
  );
}
