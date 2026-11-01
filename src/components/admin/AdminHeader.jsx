import AssistantOrb from "../experience/AssistantOrb";
export default function AdminHeader({
  title,
  description,
  eyebrow = "SKILLJOB / A CLEARER PERSPECTIVE",
}) {
  return (
    <header className="admin-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <AssistantOrb large />
    </header>
  );
}
