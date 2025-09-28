import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

// Terima `onItemClick` di props
export const ChromaGrid = ({
  items,
  onItemClick, // Fungsi handler dari App.jsx
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  enableGray = true,
  isPC = true,
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  // Gunakan `items` yang di-pass dari App.jsx, bukan data demo
  const data = items?.length ? items : [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--r": `${radius}px`,
        "--cols": columns,
        "--rows": rows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => onItemClick(c)}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: "pointer",
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <div style={{position: 'relative', minHeight: '70px'}}>
              <h3 className="name font-bold underline neon-title" style={{position: 'absolute', top: '0', left: '0', right: '0', margin: '0 auto', textAlign: 'center'}}>{c.title}</h3>
              <p className="role font-bold text-white-500" style={{position: 'absolute', top: '38px', left: '0', right: '0', margin: '0 auto', textAlign: 'center'}}>{c.subtitle}</p>
            </div>
            {c.handle && <span className="handle">{c.handle}</span>}
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      {enableGray && <div className="chroma-overlay" />}
      {enableGray && <div ref={fadeRef} className="chroma-fade" />}
    </div>
  );
};

export default ChromaGrid;
