import { useEffect } from "react";

type SeoMetaProps = {
  title: string;
  description: string;
  canonicalPath: string;
};

const SITE_ORIGIN = "https://etenderbd.com";

const upsertMeta = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name=\"${name}\"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export default function SeoMeta({ title, description, canonicalPath }: SeoMetaProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("robots", "index,follow");
    upsertCanonical(`${SITE_ORIGIN}${canonicalPath}`);
  }, [title, description, canonicalPath]);

  return null;
}
