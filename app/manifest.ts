import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WTF? Display Home Platform",
    short_name: "WTF?",
    description: "Connect display homes with the right buyers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee8",
    theme_color: "#242019",
  };
}
