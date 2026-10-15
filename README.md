# Femegha Content Studio

A static HTML/CSS/JavaScript Progressive Web App for producing Femegha image briefs and simple composed images. Open `index.html` locally or deploy this directory to GitHub Pages.

## Workflow

1. Upload the real product photo. A model image is optional. A transparent PNG/WebP model cutout works best for a layered hero.
2. Enter the real product characteristics that must stay accurate.
3. Select a placement, model outfit, hair styling, and composition.
4. Download a PNG composed from your uploaded photo, or download the structured JSON and use it with the source photos in an AI image platform.
5. Check the result against the actual product before uploading it to the storefront.

The browser composition does not remove backgrounds, change clothing, restyle hair, or synthesize new scenes. If a model photo is supplied, the composite uses it as the visual layer. The product photo remains the truth reference for the JSON brief. Dress and hair styling choices are instructions for an AI image platform or configured generation endpoint. Genuine AI image generation requires an external provider.

The JSON brief uses schema version 2.0 and separates output size, placement, source image roles, immutable product details, model position, wardrobe, hair styling, art direction, generation rules, and review checks. Attach the source photos alongside the JSON when using ChatGPT, Gemini, or another tool.

Dress and hair styling are optional. If you leave both sets of controls at “No preference” and leave their detail fields empty, the JSON omits `wardrobe` and `hairStyling` entirely.

## Optional generation endpoint

Enter the URL of your **own HTTPS proxy** in the app. It receives a JSON request containing the brief plus `referenceImageDataUrls.product` and optional `referenceImageDataUrls.model`. It must return JSON like `{"imageDataUrl":"data:image/png;base64,..."}`. Keep provider credentials on the server; never embed an API key in this static app or its repository. The endpoint URL is stored in this browser's localStorage.

## Deployment to GitHub Pages

This repository uses a GitHub Pages deployment workflow. Enable Pages in the repository settings with **GitHub Actions** as the source. The application uses relative file paths, so it works under the `/femstudio/` project path.

## Install on a device

Visit the GitHub Pages URL over HTTPS. On compatible Android and desktop browsers, use **Install app** or the browser's install menu. On iPhone or iPad, open it in Safari and choose **Share → Add to Home Screen**. After the first online visit, the app shell can reopen offline; externally hosted fonts may fall back to local fonts, and the optional generation endpoint requires a connection. Uploaded photos are not retained after the app closes, so download your work before leaving.

## Limitations

Source photos are held only in memory and are not persisted after reload. Form text is saved in localStorage. The generated PNG is a basic browser composite and needs visual review. AI prompts cannot guarantee product fidelity; review all results manually. The hero PNG is flattened; for the storefront's signature layered pop-out hero, generate/export separate backdrop and transparent cutout through an external image tool using the JSON brief.
