import KnowledgeSculpture from "../experience/KnowledgeSculpture";
export default function TrainerHeader({
  title,
  description,
  eyebrow = "GOOD KNOWLEDGE DESERVES TO GO FURTHER",
}) {
  return (
    <header className="trainer-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <KnowledgeSculpture />
    </header>
  );
}
