import EmployerSculpture from "../experience/EmployerSculpture";
export default function EmployerHeader({
  eyebrow = "YOUR EMPLOYER WORKSPACE",
  title,
  description,
}) {
  return (
    <header className="employer-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <EmployerSculpture />
    </header>
  );
}
