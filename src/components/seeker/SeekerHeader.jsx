import SeekerSculpture from "../experience/SeekerSculpture";
export default function SeekerHeader({ eyebrow, title, description }) {
  return (
    <header className="seeker-page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <SeekerSculpture />
    </header>
  );
}
