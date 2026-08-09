# Bewraped website

A simple React + JavaScript single-page website for Bewraped, ready to upload to GitHub.

## Edit your content

Open `src/data/menu.js`. It contains the announcement, contact details, hero slide text, categories, menu items, and prices. You can safely add or remove items by copying an existing object.

Replace these placeholder values before publishing:

- `email`
- `phone` (your WhatsApp number)
- `instagram`
- `location`
- `orderUrl` (the link where customers should order)

To swap the main image, replace `public/images/hero-waffles.png` with another image using the same filename. The Bewraped logo is at `public/images/bewraped-logo.jpeg`.

## Run locally

1. Install [Node.js](https://nodejs.org/) (LTS).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the address shown in the terminal.

## Build and publish on GitHub Pages

1. Create a new GitHub repository and upload the **contents of this folder** (not the outer folder).
2. In the repository settings, open **Pages** and set Source to **GitHub Actions**.
3. Push to the `main` branch. The included workflow will build and deploy the website.
4. GitHub will show the published URL in the Pages settings.

When you buy a domain, add it in the same GitHub Pages settings and follow GitHub's DNS instructions. The site uses relative asset paths, so it will work both at the GitHub Pages URL and on a custom domain.
