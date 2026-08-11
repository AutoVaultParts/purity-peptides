import type { Metadata } from "next";

const SITE_NAME = "Purity Peptides";
const SITE_URL = "https://www.puritypeptides.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Research-grade peptides and cosmetic peptide formulations backed by documentation and evidence-based education. Ships to the United States, Canada, Mexico, and select countries worldwide.";

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Research-Grade Peptides & Education`;
  const fullUrl = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: fullUrl },
    formatDetection: { telephone: false },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}