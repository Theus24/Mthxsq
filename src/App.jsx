import { useEffect, useRef, useState } from "react";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import Lanyard from "./components/Lanyard/Lanyard";
import { listTools, listProyek } from "./data";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import Aurora from "./components/Aurora/Aurora";
import AOS from "aos";
import ChatRoom from "./components/ChatRoom";
import "aos/dist/aos.css";

AOS.init();

function App() {
  const [isPC, setIsPC] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const updateMode = () => {
      const mode = window.localStorage.getItem("siteDeviceMode");
      setIsPC(mode === "pc");
    };

    updateMode();
    window.addEventListener("siteDeviceModeChange", updateMode);

    return () => {
      window.removeEventListener("siteDeviceModeChange", updateMode);
    };
  }, []);

  useEffect(() => {
    let timerId;

    const startHeroIntro = () => {
      window.clearTimeout(timerId);
      setHeroReady(false);
      timerId = window.setTimeout(() => {
        setHeroReady(true);
      }, 120);
    };

    startHeroIntro();
    window.addEventListener("siteIntroStart", startHeroIntro);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("siteIntroStart", startHeroIntro);
    };
  }, []);

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
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startY + (endY - startY) * ease);

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== "input" && tag !== "textarea") {
        e.preventDefault();
      }
    };

    const handleSelectStart = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== "input" && tag !== "textarea") {
        e.preventDefault();
      }
    };

    const handleCopy = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== "input" && tag !== "textarea") {
        e.preventDefault();
      }
    };

    const handleMouseDown = (e) => {
      if (e.button === 0) {
        const tag = e.target.tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("mousedown", handleMouseDown);
    };
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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const mobileTools = listTools.slice(0, 8);
  const mobileNavItems = [
    { id: "about", label: "Sobre" },
    { id: "tools", label: "Stack" },
    { id: "project", label: "Projetos" },
    { id: "contact", label: "Contato" },
  ];

  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full -z-10">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main
        className={`${isPC ? "max-w-7xl px-4 sm:px-6 lg:px-8" : "max-w-xl px-3 sm:px-4"} mx-auto`}
        id="home"
      >
        {isPC ? (
          <>
            <div className="hero grid grid-cols-1 items-center gap-6 pt-10 md:grid-cols-2 xl:gap-0">
              <div
                className={`transition-all duration-1000 ease-out ${
                  heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <div className="mb-6 flex w-fit items-center gap-3 rounded-2xl bg-zinc-800 p-4">
                  <img src="./assets/faris1.jpg" className="w-10 rounded-md" />
                  <q>Acredite em milagres, mas não dependa deles.</q>
                </div>
                <h1 className="mb-6 text-5xl font-bold">
                  <ShinyText
                    text="Opa, eai? Me chamo Matheus"
                    disabled={false}
                    speed={3}
                    className="custom-class"
                  />
                </h1>
                <BlurText
                  text={'Mais conhecido como "404", sou um desenvolvedor fullstack em construção, sempre buscando transformar ideias em aplicações que funcionam e crescem.'}
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="mb-6"
                />
                <div className="flex items-center gap-2 sm:gap-4">
                  <a
                    href="#project"
                    className="rounded-full border border-gray-700 bg-[#1a1a1a] p-4 px-6 font-semibold transition-colors hover:bg-[#222]"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("project");
                    }}
                  >
                    <ShinyText
                      text="Explore meus projetos"
                      disabled={false}
                      speed={3}
                      className="custom-class"
                    />
                  </a>
                </div>
              </div>

              <div
                className={`md:ml-auto transition-all duration-1000 delay-150 ease-out ${
                  heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <ProfileCard
                  name="mthxsq ❄️"
                  title="Web Developer"
                  handle="mthxsq"
                  status="Online"
                  contactText=""
                  avatarUrl="./assets/faris.png"
                  showUserInfo={true}
                  enableTilt={true}
                  enableMobileTilt={false}
                  onContactClick={() => console.log("Contact clicked")}
                />
              </div>
            </div>

            <div
              className="mx-auto mt-15 w-full max-w-[1600px] rounded-3xl border-[5px] border-blue-500/40 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              id="about"
            >
              <div
                className="flex flex-col items-center justify-between gap-10 px-8 pt-0 md:flex-row"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                <div className="basis-full border-b border-violet-500/30 pr-0 md:basis-7/12 md:border-b-0 md:border-r md:pr-8">
                  <div className="flex-1 text-left">
                    <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl">
                      Sobre mim
                    </h2>

                    <BlurText
                      text="Sou Matheus, desenvolvedor fullstack em ascensão, apaixonado por transformar ideias em aplicações modernas, funcionais e escaláveis. Meu objetivo é criar projetos que não fiquem apenas no repositório, mas que sejam usados e gerem impacto real."
                      delay={150}
                      animateBy="words"
                      direction="top"
                      className="mb-10 text-base leading-relaxed text-gray-300 md:text-lg"
                    />

                    <div className="mb-4 flex w-full flex-col items-center gap-y-8 text-center sm:flex-row sm:justify-between sm:text-left sm:gap-y-0">
                      <div>
                        <h1 className="mb-1 text-3xl md:text-4xl">
                          20<span className="text-blue-500">+</span>
                        </h1>
                        <p>Projetos Finalizados.</p>
                      </div>
                      <div>
                        <h1 className="mb-1 text-3xl md:text-4xl">
                          2<span className="text-blue-500">+</span>
                        </h1>
                        <p>Anos de Experiencia.</p>
                      </div>
                      <div
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="600"
                        data-aos-once="true"
                      >
                        <h1 className="mb-1 text-3xl md:text-4xl">
                          <span className="text-blue-500">N/A</span>
                        </h1>
                        <p>GPA</p>
                      </div>
                    </div>

                    <ShinyText
                      text="Trabalhando com o coração, criando com a mente."
                      disabled={false}
                      speed={3}
                      className="text-sm text-violet-400 md:text-base"
                    />
                  </div>
                </div>

                <div className="flex max-w-full basis-full justify-center overflow-hidden pl-0 md:basis-5/12 md:pl-8">
                  <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
                </div>
              </div>
            </div>

            <div className="tools mt-32" id="tools">
              <h1
                className="mb-4 text-4xl/snug font-bold"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                Tecnologias & Tools
              </h1>
              <p
                className="w-2/5 text-base/loose opacity-50"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
                data-aos-once="true"
              >
                trabalho e uso:
              </p>
              <div className="tools-box mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {listTools.map((tool) => (
                  <div
                    key={tool.id}
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    data-aos-delay={tool.dad}
                    data-aos-once="true"
                    className="group flex items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-zinc-800/80"
                  >
                    <img
                      src={tool.gambar}
                      alt="Tools Image"
                      className="h-16 w-16 rounded-lg bg-zinc-800 p-2 object-contain transition-all duration-300 group-hover:bg-zinc-900"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <div className="truncate">
                        <ShinyText
                          text={tool.nama}
                          disabled={false}
                          speed={3}
                          className="block text-lg font-semibold"
                        />
                      </div>
                      <p className="truncate text-sm text-zinc-400">{tool.ket}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="proyek mt-32 py-10"
              id="project"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-once="true"
            />
            <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center">
              <span
                className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                Portfolio Selected Work
              </span>
              <h1
                className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-5xl"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                Projetos em destaque
              </h1>
              <p
                className="max-w-2xl text-base leading-8 text-zinc-300/80"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
                data-aos-once="true"
              >
                Uma seleção de projetos e experiências que traduzem meu jeito de construir interfaces,
                sistemas e soluções com mais cuidado visual, estrutura e resultado.
              </p>
            </div>
            <div className="proyek-box mt-14">
              <div
                style={{ height: "auto", position: "relative" }}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="400"
                data-aos-once="true"
              >
                <ChromaGrid
                  items={listProyek}
                  onItemClick={handleProjectClick}
                  radius={500}
                  cardClickEnabled={true}
                />
              </div>
            </div>

            <div className="kontak mt-32 p-0 sm:p-10" id="contact">
              <h1
                className="mb-2 text-center text-4xl font-bold"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                Contato & Chat
              </h1>
              <div
                className="mb-6 text-center text-base opacity-80"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
                data-aos-once="true"
              >
                fale comigo em tempo real ou contate-me via email
              </div>

              <div className="flex flex-col gap-8 md:flex-row">
                <div
                  className="flex-1 rounded-md bg-zinc-800 p-6"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="400"
                  data-aos-once="true"
                >
                  <ChatRoom />
                </div>

                <div className="flex-1">
                  <form
                    action="https://formsubmit.co/businessmtheus@gmail.com"
                    method="POST"
                    className="w-full rounded-md bg-zinc-800 p-10"
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
                          className="rounded-md border border-zinc-500 p-2"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">Email</label>
                        <input
                          type="email"
                          name="Email"
                          placeholder="Insira seu Email..."
                          className="rounded-md border border-zinc-500 p-2"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="font-semibold">
                          Menssagem
                        </label>
                        <textarea
                          name="message"
                          id="message"
                          cols="45"
                          rows="7"
                          placeholder="Sua menssagem..."
                          className="rounded-md border border-zinc-500 p-2"
                          required
                        ></textarea>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="w-full cursor-pointer rounded-full border border-gray-700 bg-[#1a1a1a] p-4 px-6 font-semibold transition-colors hover:bg-[#222]"
                        >
                          <ShinyText
                            text="Send"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                          />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pb-10 pt-5">
            <section
              className={`overflow-hidden rounded-[30px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_32%),linear-gradient(160deg,_rgba(8,15,28,0.96),_rgba(7,11,22,0.88))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-1000 ${
                heroReady ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Versão Mobile
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  Fullstack em progresso
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur">
                  <img src="./assets/faris1.jpg" className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">mthxsq / 404</p>
                    <p className="text-sm text-zinc-200">Criando produtos digitais com identidade e intenção.</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.35em] text-cyan-300/80">Portfolio mobile</p>
                  <h1 className="text-4xl font-bold leading-tight text-white">
                    <ShinyText
                      text="Matheus"
                      disabled={false}
                      speed={3}
                      className="custom-class"
                    />
                  </h1>
                </div>

                <p className="text-sm leading-7 text-zinc-300">
                  Uma leitura mais direta, mais tátil e mais fluida para quem escolhe navegar pelo celular.
                  Aqui a experiência foi reorganizada para toque, foco e velocidade.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xl font-bold text-white">20+</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Projetos</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xl font-bold text-white">2+</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Anos</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xl font-bold text-white">Now</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Building</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => smoothScrollTo("project")}
                    className="flex-1 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(34,211,238,0.25)]"
                  >
                    Ver projetos
                  </button>
                  <button
                    type="button"
                    onClick={() => smoothScrollTo("contact")}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur"
                  >
                    Falar comigo
                  </button>
                </div>
              </div>
            </section>

            <div className="sticky top-20 z-20 mt-4 overflow-hidden rounded-full border border-white/10 bg-black/35 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {mobileNavItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => smoothScrollTo(item.id)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <section className="mt-5 rounded-[30px] border border-cyan-400/15 bg-black/30 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <ProfileCard
                name="mthxsq ❄️"
                title="Web Developer"
                handle="mthxsq"
                status="Online"
                contactText=""
                avatarUrl="./assets/faris.png"
                showUserInfo={true}
                enableTilt={false}
                enableMobileTilt={false}
                onContactClick={() => console.log("Contact clicked")}
              />
            </section>

            <section
              id="about"
              ref={aboutRef}
              className="mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,_rgba(9,13,24,0.94),_rgba(17,24,39,0.86))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/75">Sobre mim</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Eai</h2>
                </div>
                <div
                  className={`h-3 w-3 rounded-full bg-cyan-300 transition-opacity duration-500 ${
                    isVisible ? "opacity-100" : "opacity-40"
                  }`}
                />
              </div>

              <p className="text-sm leading-7 text-zinc-300">
                me chamo Matheus, desenvolvedor fullstack em aprendizado, apaixonado por transformar ideias em produtos modernos,
                escaláveis e usáveis de verdade. Meu foco é criar projetos que resolvam/ automatizem problemas reais e seja usado por pessoas.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Direção</div>
                  <div className="mt-2 text-base font-semibold text-white">Interfaces & sistemas com presença, toque e clareza.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Mentalidade</div>
                  <div className="mt-2 text-base font-semibold text-white">Construir algo bonito, funcional e que realmente rode.</div>
                </div>
              </div>
            </section>

            <section
              id="tools"
              className="mt-5 rounded-[30px] border border-white/10 bg-black/30 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/75">Stack mobile</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Ferramentas que movem meus projetos.</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {mobileTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-3"
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/70">
                      <img src={tool.gambar} alt={tool.nama} className="h-9 w-9 object-contain" />
                    </div>
                    <div className="text-sm font-semibold text-white">{tool.nama}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-400">{tool.ket}</div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="project"
              className="mt-5 rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(160deg,_rgba(5,10,20,0.96),_rgba(11,20,39,0.88))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.32)]"
            >
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/75">Selected work</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Projetos com visual mais direto e toque mais prático.</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  No celular, a navegação foi pensada para dedo e ritmo. Os cards ficam mais limpos e a abertura dos detalhes acontece pela seta.
                </p>
              </div>

              <div className="-mx-3">
                <ChromaGrid
                  items={listProyek}
                  onItemClick={handleProjectClick}
                  radius={500}
                  cardClickEnabled={false}
                />
              </div>
            </section>

            <section
              id="contact"
              className="mt-5 space-y-4 rounded-[30px] border border-white/10 bg-black/30 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/75">Contato</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Chat e formulário no mesmo fluxo.</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Se quiser falar rápido, entra no chat. Se preferir deixar algo mais organizado, manda uma mensagem pelo formulário.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-4">
                <ChatRoom />
              </div>

              <form
                action="https://formsubmit.co/businessmtheus@gmail.com"
                method="POST"
                className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-5"
                autoComplete="off"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white">Nome Completo</label>
                    <input
                      type="text"
                      name="Name"
                      placeholder="Seu nome..."
                      className="rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white">Email</label>
                    <input
                      type="email"
                      name="Email"
                      placeholder="Insira seu Email..."
                      className="rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-semibold text-white">
                      Menssagem
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="6"
                      placeholder="Sua menssagem..."
                      className="rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(34,211,238,0.25)]"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
}

export default App;
