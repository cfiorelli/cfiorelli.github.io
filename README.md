<div align="center">
  <img src="assets/img/projects/mini-llm-640.png" alt="Mini-LLM assistant thumbnail" width="320" />

  <h1>C. Fiorelli — Personal Site</h1>
  <p>Static Eleventy site showcasing projects, interests, publications, and long-form notes.</p>
</div>

## ✨ Highlights

- **Data-driven pages** built from JSON datasets (`data/projects.json`, `data/interests.json`, `data/publications.json`).
- **Homepage curation** with merged “latest interests” feed, featured projects, and an accessibility-first hero.
- **Responsive media** with light/dark theme switching, modern typography, and retina-friendly thumbnails.
- **Feeds & automation**: JSON/RSS feeds for interests and publications regenerate via `npm run build`.

## 📁 Project structure

```
.
├── assets/                # Global CSS, JS, and images
├── data/                  # JSON/JS data sources consumed by Eleventy
├── src/                   # Eleventy templates (Nunjucks)
└── eleventy.config.js     # Eleventy configuration
```

## 🧑‍💻 Local development

1. Install dependencies:

	```bash
	npm install
	```

2. Start a live-reload dev server:

	```bash
	npm run start
	```

	The generated site lives in `_site/` and is served at `http://localhost:8080/` by default.

3. Generate a production build:

	```bash
	npm run build
	```

4. Clean the output directory:

	```bash
	npm run clean
	```

## 🖼️ Asset workflow

- Project thumbnails live under `assets/img/projects/` with both `-640` and `-1280` variants.
- When adding artwork, drop the original as `*-source.*` and use `sips` (macOS) or any image tool to resize:

  ```bash
  sips --resampleWidth 1280 path/to/source.png --out assets/img/projects/name-1280.png
  sips --resampleWidth 640  path/to/source.png --out assets/img/projects/name-640.png
  ```

- Update the corresponding entry in `data/projects.json` (`heroImage`, `image`, `image2x`, and `imageAlt`).

## 🚀 Deployment

- Every push to `main` triggers the **CI & Deploy** GitHub Actions workflow.
- The workflow installs dependencies, runs `npm run build`, uploads the `_site/` directory via `actions/upload-pages-artifact`, and publishes it with `actions/deploy-pages`.
- To monitor a run, open the repository’s **Actions** tab (or run `gh run list` / `gh run watch <run-id>` locally).
- If you need to redeploy without new code, re-run the latest workflow from GitHub’s Actions UI or push an empty commit.
- GitHub Pages is configured for the workflow build type; no manual pushes to `gh-pages` are required.

## ✅ Quality checklist

- `npm run build` succeeds without warnings.
- Images include descriptive `imageAlt` text.
- Feeds under `_site/feed/` update correctly after content edits.

## 📄 License & attribution

Content and imagery © Christopher Fiorelli. Code is shared privately unless otherwise noted.

