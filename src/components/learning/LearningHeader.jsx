import GrowthOrbit from "../experience/GrowthOrbit";
export default function LearningHeader({
  title,
  description,
  eyebrow = "A LITTLE CURIOSITY. A LOT OF POSSIBILITY.",
}) {
  return (
    <header className="learning-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <GrowthOrbit />
    </header>
  );
}
