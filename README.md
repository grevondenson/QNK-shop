# QNK Noire Bags

A mobile-first online bags & accessories store — single brand, single merchant.
Built on the MERN stack (MongoDB · Express · React · Node.js) with Tailwind CSS.

> **Status:** M0 — Repository audit & business discovery in progress.  
> See [PRD](./docs/PRD.md) and [Technical Architecture](./docs/Technical_Architecture.md) for full scope.

---

## Project structure

```
qnk_noire_bags/
├── frontend/        # React (Vite) storefront — customer-facing UI
├── admin/           # React (Vite) admin panel — product/order management
├── backend/         # Node.js + Express API — business logic & database
├── docs/            # PRD, Technical Architecture, ADRs
└── package.json     # Root workspace convenience scripts
```

## Tech stack

| Layer | Technology |
|---|---|
| Storefront | React 18, Vite, React Router v6, Tailwind CSS |
| Admin | React 18, Vite, Tailwind CSS |
| API | Node.js (LTS), Express, ES Modules |
| Database | MongoDB (replica set) via Mongoose |
| Auth | JWT sessions (→ Argon2id + HttpOnly cookies, per architecture) |
| Images | Cloudinary CDN |
| Payments | M-Pesa via confirmed Till/Poči/Daraja capability (launch path pending provider verification) |
| Email | Transactional provider (TBD) |

## Getting started (local dev)

### Prerequisites
- Node.js ≥ 18
- MongoDB connection (local replica set or Atlas free tier)
- Cloudinary account (for image uploads)

### 1. Clone

```bash
git clone <your-remote-url> qnk_noire_bags
cd qnk_noire_bags
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, secrets, and provider keys

# Frontend
cp frontend/.env.example frontend/.env

# Admin
cp admin/.env.example admin/.env
```

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Start development servers

Open three terminals:

```bash
# Terminal 1 — API (port 4000)
npm run dev:backend

# Terminal 2 — Storefront (port 5173)
npm run dev:frontend

# Terminal 3 — Admin panel (port 5174)
npm run dev:admin
```

## Security notes (M0 audit required)

- The reference repository used JWT stored in client-accessible state. This must be replaced with HttpOnly, Secure cookies + CSRF protection per the architecture spec before launch.
- Original `.env` contained exposed credentials — these have been **redacted**. Rotate any secrets that were previously committed.
- `bcrypt` will be replaced with **Argon2id** per the architecture decision.
- Stripe and Razorpay integrations are unverified; payment implementation will be rebuilt per the payment consistency spec (Architecture §7).

## Milestone roadmap

| Milestone | Goal | Est. duration |
|---|---|---|
| M0 | Repo audit, business discovery, risk log | 2–3 days |
| M1 | Brand brief, design tokens, wireframes | 3–5 days |
| M2 | TypeScript migration, schemas, admin foundation | 5–7 days |
| M3 | Storefront, collections, cart | 5–7 days |
| M4 | Checkout, payment, order operations | 5–8 days |
| M5 | Hardening, accessibility, security, owner acceptance | 3–5 days |
| M6 | Launch & stabilisation | 2–3 days + 7-day window |

Full details in [PRD §10](./docs/PRD.md#10-milestone-compass) and the current execution plan in the session workspace.

## Decisions pending (M0 exit gate)

- [x] Target market & launch country: Kenya / KES
- [ ] M-Pesa Till/Poči/Daraja merchant eligibility, payment initiation, callback and reconciliation mechanism
- [ ] Delivery zones and fee rules
- [ ] Hosting provider
- [ ] Brand brief: personality words, palette, typography, photography direction
- [ ] Owner-supplied logo and product imagery
- [x] Website is the sole inventory source at launch
- [x] Public catalogue SEO requires SSR/pre-rendering before launch
- [x] Reuse vs. rewrite boundary: retain scaffolding; rewrite insecure payment/auth and clothing-domain flows

## Licence

MIT — see reference repository. Verify licence of all assets (images, fonts) before reuse.
