<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/adb58f0e-c3ab-408a-b92a-3430b4eb6745

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages

The `main` branch is built and published by `.github/workflows/deploy.yml`. In the repository settings, open **Settings > Pages > Build and deployment** and select **GitHub Actions** as the source. Do not publish the repository files directly from the `main` branch: the root `index.html` is Vite source and references `/src/main.tsx`, which browsers cannot run as a production bundle. The workflow builds `dist` with the repository base path and deploys that artifact.
