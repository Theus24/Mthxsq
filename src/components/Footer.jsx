import "remixicon/fonts/remixicon.css";
import Dock from "./Dock/Dock";
import { VscHome, VscArchive, VscAccount } from "react-icons/vsc";

const Footer = () => {
  // Função de scroll suave igual ao Navbar/App
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

  const items = [
  { icon: <VscHome size={18} />, label: "Inicio", onClick: () => smoothScrollTo("home") },
  { icon: <VscAccount size={18} />, label: "Sobre", onClick: () => smoothScrollTo("about") },
  { icon: <VscArchive size={18} />, label: "Projetos", onClick: () => smoothScrollTo("project") },
  { icon: <VscArchive size={18} />, label: "Contato", onClick: () => smoothScrollTo("contact") },
  ];

  return (
    <div className="mt-32 pb-8 flex flex-col items-center relative z-10">
      {/* Flex container adaptif */}
      <div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6">
        
        {/* Judul - paling atas di mobile */}
        <h1 className="text-base font-semibold order-1 md:order-none">
          Todos os direitos reservados © 2025 404 (Matheus)
        </h1>

        {/* Ikon Sosmed - di tengah di mobile */}
        <div className="flex gap-3 order-2 md:order-none">
          <a href="https://github.com/Theus24"><i className="ri-github-fill ri-2x"></i></a>
          <a href="https://www.instagram.com/mthxsq/"><i className="ri-instagram-fill ri-2x"></i></a>
          <a href="https://www.youtube.com/@M4tzito"><i className="ri-youtube-fill ri-2x"></i></a>
        </div>

        {/* Dock - paling bawah di mobile */}
        <div className="order-3 md:order-none mt-15 md:mt-0  md:mb-0">
          <Dock 
            items={items}
            panelHeight={30}
            baseItemSize={60}
            magnification={100}
          />
        </div>

      </div>
    </div>
  );
};

export default Footer;
