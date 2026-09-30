import { defineConfig } from "vite";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve("data/platforms.json");
const siteUrl = String(process.env.SITE_URL || "https://launches.nukkadly.com").trim().replace(/\/$/, "");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function faviconUrl(url) {
  try {
    return new URL("/favicon.ico", url).href;
  } catch {
    return "";
  }
}

function directoryMarkup(data) {
  const groups = new Map(data.categories.map((category) => [category, []]));
  for (const platform of data.platforms) groups.get(platform.category)?.push(platform);

  return data.categories
    .map((category) => {
      const platforms = groups.get(category).sort((a, b) => a.name.localeCompare(b.name));
      const rows = platforms
        .map((platform) => {
          const icon = faviconUrl(platform.url);
          const initial = escapeHtml(platform.name.trim().slice(0, 1).toUpperCase() || "?");
          const rating = Number.isFinite(platform.domainRating) ? platform.domainRating : "n/a";
          return `
            <li class="dir-row">
              <div class="dir-name-cell">
                <span class="dir-favicon-wrap" aria-hidden="true">${initial}<img class="dir-favicon" src="${escapeHtml(icon)}" alt="" width="32" height="32" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.hidden=true" /></span>
                <a class="dir-name" href="${escapeHtml(platform.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(platform.name)}</a>
              </div>
              <p>${escapeHtml(platform.description)}</p>
              <span class="dir-meta dir-stat">${escapeHtml(platform.access || "n/a")}</span>
              <span class="dir-meta dir-stat">${escapeHtml(platform.linkType || "Unknown")}</span>
              <span class="dir-meta dir-numeric dir-stat">${escapeHtml(rating)}</span>
            </li>`;
        })
        .join("");

      const id = `section-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      return `
        <section class="dir-section" id="${id}">
          <div class="dir-section-head">
            <h2 class="dir-heading-20">${escapeHtml(category)}</h2>
          </div>
          <ul class="dir-list">
            <li class="dir-cols" aria-hidden="true"><span class="dir-meta">Name</span><span class="dir-meta">Description</span><span class="dir-meta">Access</span><span class="dir-meta">Link</span><span class="dir-meta dir-numeric">DR</span></li>
            ${rows}
          </ul>
        </section>`;
    })
    .join("");
}

function structuredData(data) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Product Hunt Alternatives Directory",
    description: "An open directory of launch platforms, founder communities, and software directories.",
    inLanguage: "en",
    isAccessibleForFree: true,
    dateModified: data.updatedAt,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.platforms.length,
      itemListElement: data.platforms.map((platform, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: platform.name,
        url: platform.url
      }))
    }
  };
  if (siteUrl) payload.url = `${siteUrl}/`;
  return JSON.stringify(payload).replaceAll("<", "\\u003c");
}

function staticDirectory() {
  let data;

  return {
    name: "static-directory",
    async buildStart() {
      data = JSON.parse(await readFile(source, "utf8"));
      const publicData = resolve("public/data");
      await mkdir(publicData, { recursive: true });
      await copyFile(source, resolve(publicData, "platforms.json"));
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0] || "";
        if (path === "/data/platforms.json" || path.endsWith("/data/platforms.json")) {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(await readFile(source));
          return;
        }
        next();
      });
    },
    transformIndexHtml(html, context) {
      if (!context.filename.endsWith("index.html")) return html;
      const canonical = siteUrl
        ? `<link rel="canonical" href="${siteUrl}/" /><meta property="og:url" content="${siteUrl}/" />`
        : "";
      return html
        .replace("<!-- seo-directory -->", directoryMarkup(data))
        .replace(
          "</head>",
          `${canonical}<script type="application/ld+json">${structuredData(data)}</script></head>`
        );
    },
    async closeBundle() {
      const outputDirectory = resolve("dist/data");
      await mkdir(outputDirectory, { recursive: true });
      await copyFile(source, resolve(outputDirectory, "platforms.json"));
      await rm(resolve("dist/hero-renaissance-bg-v2.webp"), { force: true });

      if (siteUrl) {
        const lastmod = data.updatedAt || new Date().toISOString().slice(0, 10);
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${lastmod}</lastmod></url>\n  <url><loc>${siteUrl}/contribute.html</loc><lastmod>${lastmod}</lastmod></url>\n</urlset>\n`;
        await writeFile(resolve("dist/sitemap.xml"), sitemap);
        await writeFile(resolve("dist/robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
      }
    }
  };
}

export default defineConfig({
  base: "./",
  plugins: [staticDirectory()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        contribute: resolve("contribute.html")
      }
    }
  }
});
