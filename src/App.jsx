import { useRef, useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import ScrambledText from "./components/ScrambledText/ScrambledText";
import SplitText from "./components/SplitText/SplitText";
import Lanyard from "./components/Lanyard/Lanyard";
import GlassIcons from "./components/GlassIcons/GlassIcons";
import { listTools, listProyek } from "./data";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import ProjectModal from "./components/ProjectModal/ProjectModal"; // <-- IMPORT MODAL
import Aurora from "./components/Aurora/Aurora";
import AOS from 'aos';
import ChatRoom from "./components/ChatRoom";
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

function App() {
  // Detecta modo do site (PC ou Celular) via localStorage
  const [isPC, setIsPC] = useState(true);
  useEffect(() => {
    const updateMode = () => {
      const mode = window.localStorage.getItem('siteDeviceMode');
      if (mode === 'pc') {
        setIsPC(true);
      } else {
        setIsPC(false);
      }
    };
    updateMode();
    window.addEventListener('siteDeviceModeChange', updateMode);
    return () => {
      window.removeEventListener('siteDeviceModeChange', updateMode);
    };
  }, []);
  // Função de scroll suave igual ao Navbar
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
  const aboutRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null); // null = modal tertutup

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };
  // -------------------------

  useEffect(() => {
    // Bloquear menu do botão direito (exceto em inputs/textareas)
    const handleContextMenu = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Bloquear seleção de texto (exceto em inputs/textareas)
    const handleSelectStart = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
      }
    };
    document.addEventListener('selectstart', handleSelectStart);

    // Bloquear Ctrl+C (exceto em inputs/textareas)
    const handleCopy = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
      }
    };
    document.addEventListener('copy', handleCopy);

    // Bloquear arrastar para selecionar (exceto em inputs/textareas)
    const handleMouseDown = (e) => {
      if (e.button === 0) {
        const tag = e.target.tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
        }
      }
    };
    document.addEventListener('mousedown', handleMouseDown);

    // Limpar listeners ao desmontar
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('mousedown', handleMouseDown);
    };

    // ...existing code...
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (isReload) {
      const baseUrl = window.location.origin + "/portofolio/";
      window.location.replace(baseUrl);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full -z-10 ">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home">

        <div className="hero grid md:grid-cols-2 items-center pt-10 xl:gap-0 gap-6 grid-cols-1">
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <div className="flex items-center gap-3 mb-6 bg bg-zinc-800 w-fit p-4 rounded-2xl">
              <img src="./assets/faris1.jpg" className="w-10 rounded-md" />
              <q>Acredite em milagres, mas não dependa deles.</q>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              <ShinyText text="Opa, eai? Me chamo Matheus" disabled={false} speed={3} className='custom-class' />
            </h1>
            <BlurText
              text="Mais conhecido como Mist, sou um desenvolvedor fullstack em construção, sempre buscando transformar ideias em aplicações que funcionam e crescem."
              delay={150}
              animateBy="words"
              direction="top"
              className=" mb-6"
            />
            <div className="flex items-center sm:gap-4 gap-2">
              <a
                href="#project"
                className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors"
                onClick={e => { e.preventDefault(); smoothScrollTo('project'); }}
              >
                <ShinyText text="Explore meus projetos" disabled={false} speed={3} className="custom-class" />
              </a>
            </div>

          </div>
          <div className="md:ml-auto animate__animated animate__fadeInUp animate__delay-4s">
            <ProfileCard
              name="Mist ❄️"
              title="Web Developer"
              handle="mtheus._"
              status="Online"
              contactText=""
              avatarUrl="./assets/faris.png"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => console.log('Contact clicked')}
            />
          </div>
        </div>
        {/* tentang */}
  <div className="mt-15 mx-auto w-full max-w-[1600px] rounded-3xl border-[5px] border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6" id="about">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-0 px-8" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
            <div className="basis-full md:basis-7/12 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-violet-500/30">
              
              <div className="flex-1 text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                  Sobre mim
                </h2>

                <BlurText
                  text="Sou Matheus, desenvolvedor fullstack em ascensão, apaixonado por transformar ideias em aplicações modernas, funcionais e escaláveis. Meu objetivo é criar projetos que não fiquem apenas no repositório, mas que sejam usados e gerem impacto real."
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-base md:text-lg leading-relaxed mb-10 text-gray-300"
                />

                <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-y-8 sm:gap-y-0 mb-4 w-full">
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                        20<span className="text-blue-500">+</span>
                    </h1>
                    <p>Projetos Finalizados.</p>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                        1<span className="text-blue-500">+</span>
                    </h1>
                    <p>Anos de Experiencia.</p>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" data-aos-once="true">
                    <h1 className="text-3xl md:text-4xl mb-1">
                        <span className="text-blue-500">N/A</span>
                    </h1>
                    <p>GPA</p>
                  </div>
                </div>


                <ShinyText
                  text="Trabalhando com o coração, criando com a mente."
                  disabled={false}
                  speed={3}
                  className="text-sm md:text-base text-violet-400"
                />
              </div>
            </div>

            <div className="basis-full md:basis-5/12 pl-0 md:pl-8 overflow-hidden max-w-full flex justify-center ">
              <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </div>
          </div>

        </div>
        <div className="tools mt-32">
          <h1 className="text-4xl/snug font-bold mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" >Tecnologias & Tools</h1>
          <p className="w-2/5 text-base/loose opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">trabalho e uso:</p>
          <div className="tools-box mt-14 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">

            {listTools.map((tool) => (
              <div
                key={tool.id} data-aos="fade-up" data-aos-duration="1000" data-aos-delay={tool.dad} data-aos-once="true"
                className="flex items-center gap-4 p-4 border border-zinc-700 rounded-xl bg-zinc-900/60 backdrop-blur-md hover:bg-zinc-800/80 transition-all duration-300 group shadow-lg"
              >
                <img
                  src={tool.gambar}
                  alt="Tools Image"
                  className="w-16 h-16 object-contain bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-900 transition-all duration-300"
                />
                <div className="flex flex-col overflow-hidden">
                  <div className="truncate">
                    <ShinyText
                      text={tool.nama}
                      disabled={false}
                      speed={3}
                      className="text-lg font-semibold block"
                    />
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{tool.ket}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* tentang */}

        {/* Proyek */}
  <div className="proyek mt-32 py-10" id="project" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true"></div>
        <h1 className="text-center text-4xl font-bold mb-2" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Projetos</h1>
        <p className="text-base/loose text-center opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">Apresentação de diversos projetos / contribuições, mostrando minhas habilidades e experiência digital.</p>
        <div className="proyek-box mt-14" >

          {isPC ? (
            <div style={{ height: 'auto', position: 'relative' }} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true" >
              <ChromaGrid
                items={listProyek}
                onItemClick={handleProjectClick}
                radius={500}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                enableGray={isPC}
                isPC={isPC}
              />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[1600px] rounded-3xl border-[5px] border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6" style={{marginTop: '2rem'}}>
              <div style={{ height: 'auto', position: 'relative' }} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true" >
                <ChromaGrid
                  items={listProyek}
                  onItemClick={handleProjectClick}
                  radius={500}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  enableGray={isPC}
                  isPC={isPC}
                />
              </div>
            </div>
          )}
        </div>
        {/* Proyek */}


        {/* Kontak */}
  <div className="kontak mt-32 sm:p-10 p-0" id="contact">
          <h1
            className="text-4xl mb-2 font-bold text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            Contato & Chat
          </h1>
          <div
            className="text-base text-center mb-6 opacity-80"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            data-aos-once="true"
          >
            fale comigo em tempo real ou contate-me via email
          </div>
          <p
            className="text-base/loose text-center mb-10 opacity-50"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
            data-aos-once="true"
          >
          </p>

          {/* Container dua kolom */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Chat Room di kiri */}
            <div className="flex-1 bg-zinc-800 p-6 rounded-md" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true">
              <ChatRoom />
            </div>

            {/* Contact Form di kanan */}
            <div className="flex-1">
              <form
                action="https://formsubmit.co/businessmtheus@gmail.com"
                method="POST"
                className="bg-zinc-800 p-10 w-full rounded-md"
                autoComplete="off"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="500"
                data-aos-once="true"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Nome Completo</label>
                    <input
                      type="text"
                      name="Name"
                      placeholder="Seu nome..."
                      className="border border-zinc-500 p-2 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Email</label>
                    <input
                      type="email"
                      name="Email"
                      placeholder="Insira seu Email..."
                      className="border border-zinc-500 p-2 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-semibold">Menssagem</label>
                    <textarea
                      name="message"
                      id="message"
                      cols="45"
                      rows="7"
                      placeholder="Sua menssagem..."
                      className="border border-zinc-500 p-2 rounded-md"
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full w-full cursor-pointer border border-gray-700 hover:bg-[#222] transition-colors"
                    >
                      <ShinyText text="Send" disabled={false} speed={3} className="custom-class" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Kontak */}
      </main>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  )
}

export default App
