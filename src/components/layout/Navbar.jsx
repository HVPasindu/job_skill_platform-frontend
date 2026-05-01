import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Jobs", path: "/jobs" },
    { label: "Courses", path: "/courses" },
    { label: "Sessions", path: "/sessions" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700">
          SkillJob
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700 hover:text-blue-700"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Login */}
        <div className="hidden md:block">
          <Link to="/login">
            <Button variant="contained">Login</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div className="w-72 h-full bg-white">
          <div className="px-5 py-4 flex items-center justify-between border-b">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-blue-700"
            >
              SkillJob
            </Link>

            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="mx-3 my-1 rounded-xl"
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <div className="px-5 mt-4">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="contained" fullWidth>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </nav>
  );
}

export default Navbar;