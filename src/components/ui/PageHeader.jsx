import Reveal from "../experience/Reveal";
import OrbitAccent from "../experience/OrbitAccent";
export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="page-header-wrap">
      <Reveal className="page-header">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </Reveal>
      <OrbitAccent />
    </div>
  );
}
