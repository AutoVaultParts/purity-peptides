import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/cart", "/checkout", "/order"],
    },
    sitemap: "https://www.puritypeptides.com/sitemap.xml",
  };
}
