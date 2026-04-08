import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://appointment-booking-frontend-two.vercel.app'; // replace with your actual domain
const API_URL = 'https://appointment-booking-server-kappa.vercel.app/api/doctor/all'; // your backend endpoint that returns all doctors

async function generateSitemap() {
  try {
    // Fetch all doctors from your backend
    const { data } = await axios.get(API_URL);
    const doctors = data.doctors || [];

    // Start building the sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static pages
    const staticPages = [
      { url: '/', priority: '1.0' },
      { url: '/doctors', priority: '0.8' },
      { url: '/about', priority: '0.6' },
      { url: '/contact', priority: '0.6' },
    ];
    staticPages.forEach(page => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add doctor profile pages
    doctors.forEach(doctor => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${BASE_URL}/appointment/${doctor._id}</loc>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    // Write the file to the public folder
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ sitemap.xml generated successfully!');
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();