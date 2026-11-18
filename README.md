# Lumina Dental — Static Booking Site (Portfolio Demo)

> موقع حجز مواعيد لعيادة أسنان **وهمية** بالعربي، بدون أي إطار عمل أو بناء: HTML و CSS و JavaScript فقط. ارفع الملفات على GitHub وفعّل Pages، أو افتح `index.html` مباشرة.

## Run
- **GitHub Pages:** repo → Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
- **Locally:** double-click `index.html`. No npm, no build, no server.

## Files
| File | Purpose |
|---|---|
| `index.html` | Home: services, doctors, why us, sample reviews, FAQ, contact |
| `book.html` | 4-step booking wizard; state is kept in the URL, so refresh and back work |
| `confirmed.html` | Booking reference, WhatsApp confirmation, add to calendar (.ics) |
| `404.html` | Not-found page (served automatically by GitHub Pages) |
| `assets/js/config.js` | **All clinic data**: name, phone, services, doctors, hours, FAQ. Edit only this file to re-brand |
| `assets/js/core.js` | Dates (Asia/Amman), slot logic, validation, icons, helpers |
| `assets/js/home.js`, `book.js`, `confirmed.js` | Page scripts |
| `assets/css/styles.css` | All styles (RTL, mobile-first) |

## Security
- **CSP** `<meta>` on every page: no inline scripts, only fonts from Google, no `object-src`.
- **Safe rendering:** user input is only ever rendered as text (`textContent`), never as HTML.
- **Validation:** the name is letters only, Jordanian mobiles are normalised, notes are capped at 300 characters with control characters stripped, and consent is required. The slot rules are re-checked at submit time: within 14 days, not Friday, inside working hours, and still free.
- **Honeypot** field against bots.
- **Webhook warning:** `config.js → webhookUrl` (n8n) is optional. On a static site that URL is public, so re-validate everything in n8n, rate-limit it, and never put a secret there.

## Demo limitations
- "Booked" slots are simulated, and nothing is stored. Real availability needs a backend, such as n8n + Google Sheets or the Vercel/API version.
- Clinic, doctors, phone number and reviews are fictional and labelled as such.

Design & development: **Abd Alrhman Hourani**.
