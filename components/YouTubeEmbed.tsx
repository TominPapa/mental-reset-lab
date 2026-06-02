import { youtubeId } from "@/lib/utils/youtube";

export function YouTubeEmbed({ url, title }: { url: string; title?: string }) {
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
