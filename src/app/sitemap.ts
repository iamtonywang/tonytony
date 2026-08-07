import type { MetadataRoute } from "next";

const BASE_URL = "https://www.iamtonywang.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/why` },
    { url: `${BASE_URL}/ourwork` },
    { url: `${BASE_URL}/products` },
  ];
}
