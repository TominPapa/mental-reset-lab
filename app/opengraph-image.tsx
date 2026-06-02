import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
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
          justifyContent: "center",
          gap: 24,
          background: "#fafaf9",
          color: "#1c1917",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
          {SITE.name}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
