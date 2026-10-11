# Thiran Academy Clone — Design

## Purpose
Learning project: recreate the layout, sections and behavior of thiranacademy.com as a static site. Placeholder text, logo, images and contact details; no copied branding or copy.

## Stack
Plain HTML, CSS, JavaScript. No build step, no backend. Open `index.html` in a browser.

## Files
```
index.html              home
upcoming-sessions.html  full session grid
sessions.html           all sessions list
download.html           placeholder downloads list
about-us.html
contact-us.html         validated form, no backend
terms.html privacy.html disclaimer.html
css/style.css           single stylesheet, CSS variables for colors
js/main.js              mobile menu, register modal, scroll-to-top, form validation
js/sessions.js          session data array + card rendering
img/                    placeholder SVGs (logo, hero, about, city thumbnails)
```

## Homepage sections (in order)
1. Top info bar (phone, email, address — placeholders)
2. Header: logo + menu (Home, Upcoming Sessions, Sessions, Download, About Us, Contact Us); hamburger on mobile
3. Hero: eyebrow, title, tagline, "Upcoming Sessions" button
4. About: two columns, text left, illustration right
5. Upcoming Sessions grid: 7 cards (thumbnail, title, description, trainer, venue, date, time, fee, "Register Now")
6. "Explore More Sessions" link to upcoming-sessions.html
7. Footer: 3 columns (Useful Links, Legal Links, Contact) + copyright bar
8. Scroll-to-top button

## Behavior
- Session cards render from one array in `sessions.js`; every page that shows sessions uses it.
- Header/top bar/footer are repeated per HTML file (shortcut: no build step; upgrade to includes/components if edits get painful).
- "Register Now" opens a modal: full name, email, phone, remarks (optional), passport photo upload. Validates required fields, email format, 10-digit phone, image file type. On submit saves to `localStorage` and shows a success message. No real payment.
- Responsive: 3-column grid desktop, 1 column mobile.

## Testing
Manual browser check of each page at desktop and mobile widths. Form validation function gets a few assert-based checks.

## Out of scope
Backend, payments, CMS, real content/branding, colors matched to original (own palette unless a screenshot is supplied).
