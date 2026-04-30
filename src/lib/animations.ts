const CONFETTI_COLORS = ["#ee6c3d", "#2563d9", "#c89c3a", "#2c9c6a", "#fdfcf8"];

export function fireConfetti(count = 80): void {
  if (typeof document === "undefined") return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const startLeft = 50 + (Math.random() - 0.5) * 30;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.left = `${startLeft}vw`;
    piece.style.top = "20vh";
    piece.style.background = color;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.transition =
      "transform 2s cubic-bezier(.2,.7,.2,1), top 2s cubic-bezier(.2,.7,.2,1), opacity 2s";
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      const dropTop = 60 + Math.random() * 30;
      const targetLeft = Math.random() * 100;
      piece.style.top = `${dropTop}vh`;
      piece.style.left = `${targetLeft}vw`;
      piece.style.transform = `rotate(${Math.random() * 360 + 720}deg)`;
      piece.style.opacity = "0";
    });
    setTimeout(() => piece.remove(), 2200);
  }
}
