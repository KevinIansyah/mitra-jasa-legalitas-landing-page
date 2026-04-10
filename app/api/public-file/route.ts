import { NextRequest, NextResponse } from "next/server";

function allowedHostSuffix(): string {
  return (
    process.env.FILE_PROXY_ALLOWED_HOST_SUFFIX?.trim() ||
    process.env.NEXT_PUBLIC_PUBLIC_FILE_HOST_SUFFIX?.trim() ||
    ".r2.dev"
  );
}

function isAllowedHostname(hostname: string): boolean {
  const suffix = allowedHostSuffix();
  return hostname.endsWith(suffix);
}

function sanitizeFilename(name: string): string {
  const t = name.trim().replace(/[/\\?%*:|"<>]/g, "-");
  return t.slice(0, 180) || "unduhan";
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  const suggestedName = request.nextUrl.searchParams.get("name");

  if (!rawUrl?.trim()) {
    return NextResponse.json({ message: "Parameter url wajib ada." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ message: "URL tidak valid." }, { status: 400 });
  }

  if (target.protocol !== "https:") {
    return NextResponse.json({ message: "Hanya HTTPS yang diizinkan." }, { status: 400 });
  }

  if (!isAllowedHostname(target.hostname)) {
    return NextResponse.json({ message: "Host tidak diizinkan." }, { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Gagal mengambil berkas." }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ message: "Sumber berkas mengembalikan error." }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  let contentDisposition = upstream.headers.get("content-disposition");

  if (!contentDisposition?.toLowerCase().includes("attachment")) {
    const fromPath = target.pathname.split("/").pop()?.trim();
    const fromParam = suggestedName?.trim();
    const filename = sanitizeFilename(fromParam || fromPath || "berkas");
    contentDisposition = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
