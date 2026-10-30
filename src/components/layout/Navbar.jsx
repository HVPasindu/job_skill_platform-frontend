// MUI Drawer/IconButton provide the accessible mobile menu; React Router provides links.
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Drawer, IconButton } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { navLinks } from "../../data/navLinks";
import Button from "../ui/Button";

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="SkillJob home">
      <span className="brand-mark">↗</span>skilljob
      <span className="brand-dot">.</span>
    </Link>
  );
}
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="page-container nav-row" aria-label="Main navigation">
        <Brand />
        <div className="desktop-navigation">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              end={item.path === "/"}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="desktop-navigation nav-actions">
          <Link to="/contact" className="contact-link">
            Let’s talk
          </Link>
          <Button to="/login" endIcon={<NorthEastRoundedIcon />}>
            Sign in
          </Button>
        </div>
        <IconButton
          className="mobile-menu-button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <div className="mobile-menu">
            <div className="flex justify-between items-center">
              <Brand />
              <IconButton
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <CloseRoundedIcon />
              </IconButton>
            </div>
            <div className="mobile-menu-links">
              {[...navLinks, { label: "Contact", path: "/contact" }].map(
                (item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
              <Button to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Button>
            </div>
          </div>
        </Drawer>
      </nav>
    </header>
  );
}
