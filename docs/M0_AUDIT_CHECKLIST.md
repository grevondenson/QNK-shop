# M0 Audit Checklist — QNK Noire Bags

> **Milestone 0 goal:** Inspect the reference repository, verify what actually works, identify risks, and get owner approval on launch scope before any feature build begins.

## 1. Licence & Assets

- [ ] Verify actual MIT licence file is present and applicable
- [ ] Audit all image assets in `frontend/src/assets/` — list source/ownership of each
- [ ] Confirm no font assets are embedded without a licence
- [ ] Confirm no third-party logo assets (Stripe, Razorpay logos in assets) create IP issues
- [ ] List all npm packages and their licences

## 2. Dependency audit

- [ ] Run `npm audit` in `backend/`, `frontend/`, `admin/`
- [ ] Pin exact versions of all dependencies (remove `^` / `~` ranges)
- [ ] Flag packages with critical/high vulnerabilities for replacement
- [ ] Confirm Node.js LTS compatibility across all packages
- [ ] Evaluate: replace `bcrypt` with `argon2` per architecture spec

## 3. Backend verification

- [ ] Map all routes in `backend/routes/` — verify each controller implements what the README claims
- [ ] Inspect `userController.js` — check password hashing, JWT creation, token storage
- [ ] Inspect `orderController.js` — check if stock reservation exists; currently likely missing
- [ ] Inspect `productController.js` — check variant/SKU handling
- [ ] Inspect `cartController.js` — confirm no price authority in cart
- [ ] Inspect `middleware/auth.js` and `adminAuth.js` — confirm role checks
- [ ] Check for SQL/NoSQL injection surface in query parameters
- [ ] Verify MongoDB connection uses replica set (required for transactions)
- [ ] Verify `.env` values are never logged

## 4. Payment integration

- [ ] Inspect Stripe integration — is it actually implemented or just a dependency?
- [ ] Inspect Razorpay integration — same question
- [ ] Verify no payment secrets end up in frontend build
- [ ] Note: M-Pesa is the primary candidate; evaluate merchant eligibility first

## 5. Authentication & session security

- [ ] JWT stored in: `[ ] localStorage [ ] cookie [ ] httpOnly cookie` — document finding
- [ ] Token expiry — is it enforced?
- [ ] Password recovery — is it implemented? Is reset token single-use and time-limited?
- [ ] Admin vs. customer role — verify every admin endpoint checks role server-side
- [ ] CORS — currently `app.use(cors())` with no origin restriction — must be fixed

## 6. Data model verification

- [ ] `productModel.js` — does it have variants/SKUs? colour/size fields?
- [ ] `orderModel.js` — does it store price/address snapshots at order time?
- [ ] Are prices stored as integer minor units or floating-point?
- [ ] Is there a stock reservation mechanism? (likely absent — must be built)
- [ ] Is there an audit log?

## 7. Feature verification matrix

| Feature | Claimed | Verified works | Notes |
|---|---|---|---|
| User registration | ✅ | ❓ | |
| User login | ✅ | ❓ | |
| Product catalogue | ✅ | ❓ | |
| Search/filter | ✅ | ❓ | |
| Cart (persist) | ✅ | ❓ | |
| Guest checkout | ✅ | ❓ | |
| Stripe payment | ✅ | ❓ | |
| Razorpay payment | ✅ | ❓ | |
| Order tracking | ✅ | ❓ | |
| Admin dashboard | ✅ | ❓ | |
| Stock management | ✅ | ❓ | |
| Cloudinary upload | ✅ | ❓ | |
| Email confirmation | ❓ | ❓ | |
| Stock reservation | ❓ | ❓ | |

## 8. Business discovery — owner answers required

- [ ] Shop name confirmed: **QNK Noire Bags**
- [ ] Target market / launch country: ___________
- [ ] Launch currency: ___________
- [ ] Primary payment provider (confirm eligibility): ___________
- [ ] Delivery zones and fee rules: ___________
- [ ] Returns & cancellation policy: ___________
- [ ] Owner-supplied: logo, brand colours, product photography? ___________
- [ ] Does owner have an existing inventory system to sync? ___________
- [ ] Fulfilment workflow (self-fulfilled vs. 3PL): ___________
- [ ] Budget and launch deadline: ___________

## 9. Reuse vs. rewrite decisions

Document each decision in an Architecture Decision Record (ADR) in `docs/adr/`.

| Component | Decision | Rationale |
|---|---|---|
| React frontend structure | Reuse (migrate to TypeScript + TanStack Query) | Good structure, needs type safety |
| Backend routing | Reuse (refactor to modular structure) | Routes work, security fixes needed |
| Auth (JWT in state) | Rewrite to HttpOnly cookie sessions | Security requirement |
| Password hashing (bcrypt) | Replace with Argon2id | Architecture spec |
| Payment (Stripe/Razorpay) | Evaluate / likely rebuild | Provider eligibility unclear |
| Cart (no reservation) | Rebuild with server-side reservation | Business rule requirement |
| Data models | Migrate to match architecture spec | Missing snapshots, variant model |

## Exit gate

- [ ] Engineer has run all three apps locally with test data
- [ ] Feature verification matrix is complete
- [ ] Risk log created in `docs/RISK_LOG.md`
- [ ] Owner has answered all business discovery questions
- [ ] Owner approves MVP scope
- [ ] No production credentials exist in the repository
- [ ] Reuse/rewrite decisions recorded as ADRs
