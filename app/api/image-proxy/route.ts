const ALLOWED_PREFIX = "https://pub-8c1ce0172c6d4135bf5db8344f0bbb65.r2.dev/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";

  if (!url.startsWith(ALLOWED_PREFIX)) {
    return new Response("Forbidden", { status: 403 });
  }

  const res = await fetch(url, { next: { revalidate: 2592000 } });
  if (!res.ok) {
    return new Response("Bad gateway", { status: 502 });
  }

  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/webp",
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
}
