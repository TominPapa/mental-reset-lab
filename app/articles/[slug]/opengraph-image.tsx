import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/data";
import { SITE } from "@/lib/constants";

export const alt = "Mental Reset Lab article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.title ?? SITE.name;
  const category = article?.category ?? SITE.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafaf9",
          color: "#1c1917",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#78716c", letterSpacing: -0.5 }}>
          {category}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600 }}>{SITE.name}</div>
      </div>
    ),
    { ...size },
  );
}
