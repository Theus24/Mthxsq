import { useState, useEffect } from "react";

const Navbar = ({ hidden = false }) => {
  // Função de scroll suave com aceleração
  const smoothScrollTo = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + window.scrollY;
    const distance = Math.abs(endY - startY);
    let duration = Math.min(1700, Math.max(600, distance * 0.7));

    let startTime = null;
    function scrollStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (elapsed > 1700) duration = 400;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, startY + (endY - startY) * ease);
      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }
    requestAnimationFrame(scrollStep);
  };
  // ⛔ Saat hidden, jangan render apa pun
  if (hidden) return null;

  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 150);
    handleScroll(); // init posisi saat mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar relative z-50 py-7 flex items-center justify-between px-6 md:px-12">
      {/* Logo */}
      <div className="logo">
        <h1 className="text-3xl font-bold text-white p-1 md:bg-transparent md:text-white">
          Portfólio
        </h1>
      </div>

      {/* Menu */}
      <ul
        className={`flex items-center sm:gap-10 gap-4 
          md:static fixed left-1/2 -translate-x-1/2 md:translate-x-0 
          md:opacity-100 bg-white/10 backdrop-blur-md 
          md:bg-transparent md:backdrop-blur-none
          p-4 rounded-br-2xl rounded-bl-2xl 
          transition-all md:transition-none
          ${active ? "top-0 opacity-100" : "-top-10 opacity-0"}`}
      >
        <li>
          <a
            href="#home"
            className="sm:text-lg text-base font-medium"
            onClick={e => { e.preventDefault(); smoothScrollTo('home'); }}
          >
            Inicio
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="sm:text-lg text-base font-medium"
            onClick={e => { e.preventDefault(); smoothScrollTo('about'); }}
          >
            Sobre
          </a>
        </li>
        <li>
          <a
            href="#project"
            className="sm:text-lg text-base font-medium"
            onClick={e => { e.preventDefault(); smoothScrollTo('project'); }}
          >
            Projetos
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="sm:text-lg text-base font-medium"
            onClick={e => { e.preventDefault(); smoothScrollTo('contact'); }}
          >
            Contato
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
