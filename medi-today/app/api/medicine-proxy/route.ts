import { NextResponse } from "next/server"
import { parse } from "node-html-parser"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MediToday/1.0;)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const html = await response.text()
    const root = parse(html)

    // Remove scripts and other potentially harmful elements
    root.querySelectorAll("script").forEach((el) => el.remove())
    root.querySelectorAll("iframe").forEach((el) => el.remove())
    root.querySelectorAll("link").forEach((el) => el.remove())
    root.querySelectorAll("meta").forEach((el) => el.remove())

    // Extract main content based on common selectors
    const mainContent =
      root.querySelector("main") ||
      root.querySelector("#main-content") ||
      root.querySelector(".main-content") ||
      root.querySelector("article") ||
      root.querySelector(".content")

    if (!mainContent) {
      return NextResponse.json({ error: "Could not find main content" }, { status: 404 })
    }

    // Convert relative URLs to absolute
    mainContent.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src")
      if (src && src.startsWith("/")) {
        img.setAttribute("src", new URL(src, url).toString())
      }
    })

    mainContent.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href")
      if (href && href.startsWith("/")) {
        a.setAttribute("href", new URL(href, url).toString())
      }
      // Open all links in new tab
      a.setAttribute("target", "_blank")
      a.setAttribute("rel", "noopener noreferrer")
    })

    return NextResponse.json({
      content: mainContent.toString(),
      title: root.querySelector("title")?.text || "",
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

