// React useEffect resets scroll on navigation; React Router useLocation supplies the URL.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "../experience/PageTransition";

export default function MainLayout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
