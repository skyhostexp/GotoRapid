# GoToRapid Digital Products Agency (gotorapid.com)

A high-performance digital products marketplace & agency web application built with React, Vite, Tailwind CSS, and Lucide Icons.

---

## 🚀 Publishing to GitHub Pages

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages in your Repository Settings**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages** (under the "Code and automation" section).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.

3. **Done!**
   - Whenever you push changes to `main` (or `master`), GitHub Actions will automatically build and publish your site at `https://<your-username>.github.io/<your-repo-name>/`.

---

### Method 2: Manual Build & Deploy

If you prefer building locally and deploying manually:

1. **Build the production static files**:
   ```bash
   npm install
   npm run build
   ```
2. The compiled static website files will be generated in the `dist/` directory, ready to be hosted on any static hosting provider or the `gh-pages` branch.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run type check / linting
npm run lint

# Build for production
npm run build
```
