import { NextResponse } from "next/server";

const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN || "https://rabbit-app-aoau.vercel.app";

async function proxy(request, { params }) {
  const { path } = await params;
  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(`/api/${path.join("/")}`, BACKEND_ORIGIN);
  backendUrl.search = incomingUrl.search;

  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (authorization) headers.set("authorization", authorization);
  if (contentType) headers.set("content-type", contentType);

  const method = request.method.toUpperCase();
  const init = {
    method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(method)) {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(backendUrl, init);
    const body = await response.arrayBuffer();

    const responseHeaders = new Headers();
    const responseContentType = response.headers.get("content-type");
    if (responseContentType) {
      responseHeaders.set("content-type", responseContentType);
    }

    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Rabbit API proxy failed:", error);
    return NextResponse.json(
      { message: "Backend service unavailable" },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
