import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadCreditLineAsWord(element: HTMLElement | null, filename = "document.doc") {
  if (!element) return;

  let content = element.innerHTML.replace(
    /<br\s*\/?>(?=)/gi,
    '<br style="mso-special-character:line-break;" />'
  );

  content = content.replace(/<span\b[^>]*\bclass\s*=\s*(['"])>?/gi, (m) => m);
  content = content.replace(
    /<span\b[^>]*\bclass\s*=\s*(['"])\s*[^"']*\bfont-bold\b[^"']*\1[^>]*>([\s\S]*?)<\/span>/gi,
    "<strong>$2</strong>"
  );

  content = content.replace(
    /(<span[^>]*>\s*Date:\s*<span[^>]*>)/i,
    "$1".replace("<span", '<span style="margin-left:320px;display:inline-block;"')
  );

  content = content.replace(/<h2([^>]*)class=(['"][^'"\]]*text-lg[^'"\]]*['"][^>]*)>/gi, (m) =>
    m.replace("<h2", '<h2 style="font-size:20px;"')
  );

  content = content.replace(/<h3\b([^>]*)>/gi, (match, attrs) => {
    try {
      if (/style=(['"]).*?\1/i.test(attrs)) {
        return `<h3${attrs.replace(
          /style=(['"])(.*?)\1/i,
          (s, q, v) => `style=${q}${v}; font-size:20px; color:#6D28D9; text-align:center;${q}`
        )}>`;
      }
      return `<h3${attrs} style="font-size:20px; color:#6D28D9; text-align:center;">`;
    } catch (e) {
      return `<h3${attrs}>`;
    }
  });

  content = content.replace(
    /<div([^>]*class=["'][^"']*text-justify[^"']*["'][^>]*)>/,
    (match, p1) => `<div${p1} style="text-align:justify;">`
  );

  content = content.replace(/<table([^>]*)>/gi, (m, attrs) => {
    if (/style=/.test(attrs)) {
      return `<table${attrs.replace(
        /style=(['"])(.*?)\1/,
        (s, q, v) =>
          `style=${q}${v}; border-collapse:collapse; width:100%; border:1px solid #000;${q}`
      )}>`;
    }
    return `<table${attrs} style="border-collapse:collapse; width:100%; border:1px solid #000;">`;
  });

  content = content.replace(/<(td|th)([^>]*)>/gi, (m, tag, attrs) => {
    if (/style=/.test(attrs)) {
      return `<${tag}${attrs.replace(
        /style=(['"])(.*?)\1/,
        (s, q, v) => `style=${q}${v}; border:1px solid #000;${q}`
      )}>`;
    }
    return `<${tag}${attrs} style="border:1px solid #000;">`;
  });

  content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
    try {
      if (!/class=(['"]).*?\btext-xs\b.*?\1/i.test(attrs)) return full;
      if (/style=(['"])(.*?)\1/i.test(attrs)) {
        return `<${tag}${attrs.replace(
          /style=(['"])(.*?)\1/i,
          (s, q, v) => `style=${q}${v}; font-size:9px;${q}`
        )}>`;
      }
      return `<${tag}${attrs} style="font-size:9px;">`;
    } catch (e) {
      return full;
    }
  });

  content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
    try {
      if (
        !/class=(['"]) .*?\btext-sm\b.*?\1/i.test(attrs) &&
        !/class=(['"])\btext-sm\b.*?\1/i.test(attrs)
      )
        return full;
      if (/style=(['"])(.*?)\1/i.test(attrs)) {
        return `<${tag}${attrs.replace(
          /style=(['"])(.*?)\1/i,
          (s, q, v) => `style=${q}${v}; font-size:10px;${q}`
        )}>`;
      }
      return `<${tag}${attrs} style="font-size:10px;">`;
    } catch (e) {
      return full;
    }
  });

  content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
    try {
      if (!/class=(['"]).*?\bpl-3\b.*?\1/i.test(attrs)) return full;
      if (/style=(['"])(.*?)\1/i.test(attrs)) {
        return `<${tag}${attrs.replace(
          /style=(['"])(.*?)\1/i,
          (s, q, v) => `style=${q}${v}; padding-left:12px;${q}`
        )}>`;
      }
      return `<${tag}${attrs} style="padding-left:12px;">`;
    } catch (e) {
      return full;
    }
  });

  content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
    try {
      if (!/class=(['"]).*?\bitalic\b.*?\1/i.test(attrs)) return full;
      if (/style=(['"])(.*?)\1/i.test(attrs)) {
        return `<${tag}${attrs.replace(
          /style=(['"])(.*?)\1/i,
          (s, q, v) => `style=${q}${v}; font-style:italic;${q}`
        )}>`;
      }
      return `<${tag}${attrs} style="font-style:italic;">`;
    } catch (e) {
      return full;
    }
  });

  const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="ProgId" content="Word.Document" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <style>
            @page Section1 { size: Legal; margin: 0; mso-page-orientation: portrait; }
            div.Section1 { page: Section1; }
            body { font-family: Arial, Helvetica, sans-serif; color: #000; margin: 0; }
            .font-bold, strong, b { font-weight: 700; }
            .underline { text-decoration: underline; }
            .italic, em { font-style: italic; }
            .text-center { text-align: center; }
            .uppercase { text-transform: uppercase; }
            .border-t { border-top: 1px solid #000; }
            .pt-2 { padding-top: 0.5rem; }
            .text-sm { font-size: 10px; }
            .text-xs { font-size: 9px; }
            .text-justify { text-align: justify !important; }
            .text-lg { font-size: 16px; }
            .text-xl { font-size: 18px; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mt-10 { margin-top: 2.5rem; }
            .mt-16 { margin-top: 4rem; }
            .mt-24 { margin-top: 94px; }
            .mt-20 { margin-top: 80px; }
            .mb-24 { margin-bottom: 94px; }
            .ml-80 { margin-bottom: 320px; }
            .ml-3 { padding-left: 12px; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .ml-80 { margin-left: 320px !important; }
          </style>
        </head>
        <body>${content}</body>
      </html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
