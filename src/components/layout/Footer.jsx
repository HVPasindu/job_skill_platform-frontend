// React Router built-in Link: normal page navigation, not animation logic.
import { Link } from "react-router-dom";
import { navLinks } from "../../data/navLinks";
import Reveal from "../experience/Reveal";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <Reveal className="footer-invitation">
          <span className="eyebrow">YOUR POTENTIAL DOESN’T STAND STILL.</span>
          <Link to="/jobs">
            Neither should
            <br />
            <span>your future.</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </Reveal>
        <div className="footer-top">
          <div>
            <Link to="/" className="brand">
              <span className="brand-mark">↗</span>skilljob.
            </Link>
            <p>
              Work. Learn. Connect.
              <br />
              Make your next move.
            </p>
          </div>
          <div className="footer-links">
            {navLinks
              .filter((link) => link.path !== "/")
              .map((link) => (
                <Link key={link.path} to={link.path}>
                  {link.label}
                </Link>
              ))}
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SkillJob. All rights reserved.
          </span>
          <span>Opportunity, in every direction.</span>
        </div>
      </div>
    </footer>
  );
}
