/**
 * Static celebratory confetti behind the success hero.
 *
 * Deliberately not animated and not randomised: the positions are fixed so
 * the server and client render identically, and a settled financial
 * transaction does not need motion to feel resolved.
 */
const PIECES = [
  { x: 8, y: 22, rotate: -18, color: "#12b76a", w: 7, h: 3 },
  { x: 17, y: 58, rotate: 34, color: "#f79009", w: 6, h: 3 },
  { x: 26, y: 14, rotate: 62, color: "#1652f0", w: 3, h: 7 },
  { x: 33, y: 74, rotate: -42, color: "#f04438", w: 6, h: 3 },
  { x: 41, y: 30, rotate: 12, color: "#7a5af8", w: 3, h: 6 },
  { x: 58, y: 20, rotate: -55, color: "#f79009", w: 7, h: 3 },
  { x: 66, y: 66, rotate: 28, color: "#12b76a", w: 3, h: 6 },
  { x: 74, y: 34, rotate: -22, color: "#f04438", w: 6, h: 3 },
  { x: 83, y: 62, rotate: 48, color: "#1652f0", w: 3, h: 7 },
  { x: 90, y: 26, rotate: -36, color: "#12b76a", w: 6, h: 3 },
  { x: 12, y: 80, rotate: 18, color: "#1652f0", w: 3, h: 6 },
  { x: 95, y: 76, rotate: -12, color: "#7a5af8", w: 6, h: 3 },
];

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PIECES.map((piece, index) => (
        <span
          key={index}
          className="absolute rounded-[1px]"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.w,
            height: piece.h,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotate}deg)`,
            opacity: 0.75,
          }}
        />
      ))}
    </div>
  );
}
