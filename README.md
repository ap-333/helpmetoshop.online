# HelpMeToShop (helpmetoshop.online)

Clean rebuild, rebranded from `vrogo.online` to **HelpMeToShop** (`https://helpmetoshop.online/`).

## Theme

- **AMOLED black:** `#000000` base, `#08080A` alt sections, `#101014` / `#17171C` surfaces, `#1E1E23` borders
- **Cloudflare Orange:** `#F6821F` primary, `#E46F0E` hover, `#B85A0B` deep, tints `rgba(246,130,31,.12/.32)`
- **3rd complementary accent, Sky Blue `#38BDF8`:** direct complement of orange on the color wheel. Used sparingly for trust and security cues (lock icon, alternating issue cards, step 2, alternating trust icons, secondary CTA hover, footer domain plus badge) so orange stays dominant. Dark mode safe, readable on black.

## Structure

```text
index.html              # homepage: announcement, nav, hero plus call card, stats, issues, coverage, free tools, how-it-works, trust, CTA, FAQ, footer, mobile sticky bar
refund-calculator/      # Refund Calculator page (targets refund timing keywords)
claim-letter/           # Claim Letter Builder page (targets dispute letter keywords)
privacy/                # Privacy Policy (independent-status disclosure, browser-only tools, no data sale)
terms/                  # Terms of Use (independent-status disclosure, guidance limits, liability)
cookies/                # Cookie Settings (no first-party tracking cookies, CDN disclosure)
refund-policy/          # Refund Policy (free tools, no surprise charges, store timelines)
sitemap.xml + robots.txt # crawl plumbing for all seven pages
assets/
  css/
    style.css           # all custom styles (variables, layout, legal pages, responsive breakpoints)
  js/
    main.js             # mobile nav toggle, FAQ accordion, dynamic year, free tools (refund calc, claim builder)
  images/
    logo.svg            # brand mark: midnight badge, gradient insignia, sky wheels, orange keyline (nav, footer, favicon)
```

## Run

No build step. Open `index.html` directly, or serve locally:

```powershell
# Python
python -m http.server 8000
# then visit http://localhost:8000/
```

```powershell
# Node
npx serve .
```

## Positioning

Brand agnostic by design: no marketplace or retailer is named anywhere in the copy. The voice is neutral and independent ("sorted", "real person", "private by default"), with no marketplace insider claims. Coverage is expressed as generic categories so future stores slot in with zero rewording.

## Config points

- Phone number: `(888) 882-5152` / `tel:+18888825152` (search and replace to change)
- Coverage cards: `#coverage` in `index.html` (4 cards: Marketplaces, Independent stores, Grocery and essentials, Subscriptions and digital)
- Brand colors: `:root` vars `--or`, `--or-d`, `--ink`, etc. in `assets/css/style.css` (lines 2 to 18)
- Fonts: Inter via Google Fonts plus Font Awesome 6.5.2 via CDN (see `<head>` in `index.html`)
- Logo: `assets/images/logo.svg` (single source: nav, footer, favicon)
- Removed from original: WordPress and Elementor boilerplate, Tawk.to embed, chrome extension scripts, emoji and lazyload scripts, `.download` bundles
