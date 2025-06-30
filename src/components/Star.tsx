type StarProps = {
  // value from 0 to 1
  filling?: number;
};

export const Star = ({ filling }: StarProps) => {
  // Étoile pleine (filling = 1 ou undefined)
  if (typeof filling === "undefined" || filling === 1) {
    return <span style={{ color: "#000", fontSize: "18px" }}>★</span>;
  }

  // Étoile vide (filling = 0)
  if (filling === 0) {
    return <span style={{ color: "#000", fontSize: "18px" }}>☆</span>;
  }

  // Étoile partiellement remplie
  const width = filling * 100 + "%";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        fontSize: "18px",
      }}
    >
      {/* Étoile remplie avec largeur contrôlée */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          overflow: "hidden",
          color: "#000",
        }}
      >
        ★
      </div>
      {/* Étoile vide en arrière-plan */}
      <div style={{ color: "#000" }}>☆</div>
    </div>
  );
};
