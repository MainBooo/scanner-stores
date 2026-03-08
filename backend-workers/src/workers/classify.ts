export type PageType = "home" | "pricing" | "product" | "category" | "blog" | "docs" | "other"

export function classifyPath(path: string): PageType {
  const p = (path || "/").toLowerCase()
  if (p === "/" || p === "") return "home"
  if (p.includes("pricing") || p.includes("price") || p.includes("plans")) return "pricing"
  if (p.includes("product") || p.includes("features")) return "product"
  if (p.includes("catalog") || p.includes("category") || p.includes("shop") || p.includes("store")) return "category"
  if (p.includes("blog") || p.includes("news")) return "blog"
  if (p.includes("docs") || p.includes("documentation")) return "docs"
  return "other"
}
