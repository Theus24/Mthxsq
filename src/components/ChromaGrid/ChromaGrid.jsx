import { useMemo } from "react";
import "./ChromaGrid.css";

// Terima `onItemClick` di props
export const ChromaGrid = ({
  items,
  onItemClick, // Fungsi handler dari App.jsx
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  cardClickEnabled = true,
}) => {
  // Gunakan `items` yang di-pass dari App.jsx, bukan data demo
  const data = useMemo(() => (items?.length ? items : []), [items]);

  return (
    <div
      className={`chroma-grid ${className}`}
      style={{
        "--r": `${radius}px`,
        "--cols": columns,
        "--rows": rows,
      }}
      >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onClick={cardClickEnabled ? () => onItemClick(c) : undefined}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: cardClickEnabled ? "pointer" : "default",
          }}
        >
          <div className="chroma-img-wrapper">
            <span className="chroma-badge">Projeto</span>
            <img src={c.image} alt={c.title} loading="lazy" />
            <div className="chroma-image-overlay" />
          </div>
          <footer className="chroma-info">
            <div className="chroma-title-wrap">
              <span className="chroma-kicker">
                {cardClickEnabled ? "Selecione para visualizar" : "Toque na seta para visualizar"}
              </span>
              <h3 className="chroma-title">{c.title}</h3>
            </div>
            <button
              type="button"
              className="chroma-arrow"
              aria-label={`Abrir detalhes do projeto ${c.title}`}
              onClick={(event) => {
                event.stopPropagation();
                onItemClick(c);
              }}
            >
              ↗
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
};

export default ChromaGrid;
