import { ImageResponse } from "next/og";

export const alt = "AlgoFlow — trace data structures and algorithms step by step";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "76px",
        color: "#173126",
        background: "linear-gradient(135deg, #f4faf5 0%, #dcfce7 58%, #dbeafe 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "#16a34a" }} />
        AlgoFlow
      </div>
      <div
        style={{ marginTop: 52, maxWidth: 950, fontSize: 72, lineHeight: 1.05, fontWeight: 800 }}
      >
        See the logic. Then make it stick.
      </div>
      <div
        style={{ marginTop: 32, maxWidth: 900, fontSize: 31, lineHeight: 1.35, color: "#3f5e50" }}
      >
        Step-by-step data-structure and algorithm traces with synchronized explanations and code.
      </div>
    </div>,
    size
  );
}
