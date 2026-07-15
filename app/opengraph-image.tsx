import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090B",
          color: "#F5F5F3",
          padding: 72,
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ color: "#C89B5B", fontSize: 28, fontWeight: 700, letterSpacing: 6 }}>SAVOR</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ maxWidth: 920, fontSize: 88, lineHeight: 0.95, fontWeight: 700 }}>
            Receitas que valem o seu tempo
          </div>
          <div style={{ marginTop: 28, maxWidth: 760, color: "#B8B8BE", fontSize: 32, lineHeight: 1.3 }}>
            Descubra, salve e cozinhe pratos com uma experiência calma e completa.
          </div>
        </div>
        <div style={{ color: "#7BAE7F", fontSize: 24, fontWeight: 700 }}>savor.app</div>
      </div>
    ),
    size
  );
}
