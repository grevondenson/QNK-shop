# Product Requirements Document

Project: QNK Noire Bags — Bags and Accessories Store
Version: 0.2 — M0-aligned planning baseline
Status: Kenya/KES launch direction confirmed; provider and policy gates remain explicit.

## 1. Product vision
Build a mobile-first online bags and accessories shop that reflects QNK Noire Bags through original photography, typography, colours, editorial content, product selection and brand voice. Customers can discover products, choose valid variants, pay, and track their orders. The owner can operate the catalogue, stock, orders and storefront content without editing code.

This is a single-brand, single-merchant store, not a marketplace. Reuse suitable engineering from the reference project, not its identity, imagery or unverified integrations.

## 2. Reference project and limits
Reference: https://github.com/bhavinvagh/online_clothes_store
The repository page describes a React/Node.js/Express/MongoDB clothing store and shows separate frontend, backend and admin directories. Its README lists authentication, catalogue, search/filter, cart, payments, orders and administration. It also lists alternative technologies, so those entries are not proof that every option is implemented.
This draft is based on that repository page and README, not a completed source-code, dependency, security or deployment audit. Attempts to retrieve the three package manifests did not succeed. Treat all existing features as unverified until milestone 0.
The README states MIT licensing; verify the actual licence, applicable notices and rights to all images, fonts and other assets before reuse.

## 3. Intended users
- Shoppers: mobile and desktop visitors seeking bags and accessories, product dimensions/capacity, reliable stock and transparent delivery charges.
- Returning customers: customers who want saved details and order history.
- Shop owner/admin: manages products, variants, imagery, stock, orders and brand content.
- Fulfilment staff: sees the order and delivery details needed to pack and dispatch purchases; cannot change permissions or site settings.

## 4. Working assumptions and decisions
Planning assumptions, not confirmed business facts:
- One shop, one inventory location, physical bags/accessories and one launch currency.
- Launch market is Kenya with KES. Delivery zones, fees, estimates, tax presentation and policy wording remain owner-approved configuration.
- M-Pesa is the only planned launch payment method. The merchant's Till/Poči/Daraja capability must be verified before selecting STK Push, customer-initiated Till payment, callback, and reconciliation flows.
- The website is the sole inventory source at launch.
- Public catalogue and category pages require pre-rendering/SSR before launch for SEO; private/admin routes may remain client-rendered.
- Guest checkout is available; creating an account is optional.
- One primary payment integration at launch; additional payment methods are not release blockers unless explicitly approved.
- Owner supplies or licenses product photography, logos and copy.
- Stock is managed per product variant such as colour/finish, material, and capacity/dimensions; products without a meaningful size dimension must not inherit clothing-size assumptions.

Decisions required before implementation: target shoppers, existing logo and product assets, visual references, product categories, M-Pesa merchant/API eligibility and payment initiation, delivery regions/rates, returns/refund policy, fulfilment workflow, privacy/retention rules, hosting, and SEO rendering implementation.

## 5. Brand and design requirements
Before high-fidelity development, approve a brand brief with:
- Three personality words, intended audience, tone of voice and examples of language to use/avoid.
- Colour palette, accessible colour combinations, typography, logo treatment and spacing rules.
- Photography direction: backgrounds, crop ratios, model imagery and product-detail shots.
- Homepage hierarchy: opening campaign, new arrivals, featured collections, brand story and service information.
- Reusable components: navigation, cards, badges, size selector, buttons, forms and order status views.

Use configurable design tokens and editable content rather than scattered hard-coded styles. Owner-controlled navigation, featured collections and homepage copy belong in storefront settings. Never put unrestricted scripts or arbitrary executable markup into content fields.
Acceptance: owner approves a mobile homepage, collection page, product page, cart and checkout prototype before feature build begins.

## 6. Core customer journey
1. Discover a collection from the homepage, search, category navigation or a shared product link.
2. Filter by size, colour, category and price; sort by newest or price.
3. Open a product with images, description, price, size guide, care information and variant availability.
4. Select a valid size/colour combination and quantity; add it to the cart.
5. Check out with contact details and address; receive a server-calculated delivery fee and total before payment.
6. Complete the configured payment flow; view a processing screen until the server verifies the result.
7. Receive an order confirmation after verified payment and follow fulfilment status through a secure link or account.
8. Owner packs, dispatches and records tracking; customer receives status updates.

## 7. Functional scope and enabling technologies
| Function | Launch requirement | Technology and purpose | Acceptance criterion |
|---|---|---|---|
| Branded storefront | Original responsive homepage, collections and story/contact pages | React + TypeScript for UI; Tailwind and CSS variables for brand tokens | Approved design works at 360px, tablet and desktop widths without horizontal overflow |
| Catalogue | Product descriptions, images, categories and size/colour variants | Express API + MongoDB for structured records; managed image storage/CDN for assets | Admin can publish a product; unpublished products stay hidden |
| Search/filter | Keyword search, category/size/colour/price filters, sorting, pagination | Validated Express queries and indexed MongoDB fields | Filters combine correctly and have useful empty states |
| Cart | Variant-aware quantities and persistent guest cart | React state + browser storage for convenience; server validation for authority | Cart survives refresh; changed prices/stock are rechecked before ordering |
| Checkout | Guest purchase, address and delivery quote | Server-side validation, delivery-zone rules and order service | Total is itemised; client cannot alter prices or delivery fees |
| Payments | One approved provider; verified status and failure/retry handling | Provider-specific server adapter, webhook/callback endpoint and reconciliation job | Duplicate notifications cannot create duplicate payment or stock effects |
| Accounts | Optional customer account and order history | Server sessions in secure cookies; password hashing and recovery service | Users cannot access another customer's orders |
| Order tracking | Purchase confirmation and fulfilment states | Order API, expiring guest links and email provider | Guest and signed-in users see only authorised order details |
| Administration | Product/variant CRUD, stock adjustment, orders and homepage content | Protected React admin + role-authorised Express endpoints | Customer role cannot invoke admin APIs; changes are audit logged |
| Delivery | Configurable zones, fees and manual tracking entry | Server delivery rules and fulfilment fields | Unsupported addresses are rejected before payment |
| Measurement | Purchase funnel and error reporting | Privacy-aware analytics and error monitoring | Verified purchases are counted once without exposing contact/payment data |

## 8. Business rules
- All prices, discounts, totals and stock decisions are calculated or verified on the server.
- Money is stored as integer minor units alongside its currency, not floating-point values.
- A purchasable variant must be active, have a unique SKU and have sufficient unreserved stock.
- Checkout creates a time-limited stock reservation, with duration configured to suit the payment provider's flow.
- Successful payment converts the reservation into a sale exactly once. Failures and expiry release it exactly once.
- Late payment after reservation expiry creates an exception for stock revalidation or refund review; it must not silently oversell.
- Store product, SKU, price and address snapshots on each order so later edits do not rewrite purchase history.
- Payment status and fulfilment status are separate. A browser redirect or client message never proves payment.
- Any stock change outside the website must be entered into the system or synchronised before online availability can be trusted.
- Tax presentation, cancellation, returns, retention and privacy rules require owner approval and jurisdiction-specific review before launch.

## 9. Quality requirements and measurement
Proposed acceptance targets, not claims about the reference application:
- Accessibility: WCAG 2.2 AA as the design/testing target; keyboard navigation, visible focus, labelled controls, readable errors and useful image alt text.
- Performance: target mobile LCP <=2.5 seconds, INP <=200ms and CLS <=0.1 at the 75th percentile once enough field data exists. Before launch, record repeatable lab checks on an agreed mobile/network profile.
- API performance: target p95 under 500ms for catalogue reads on an agreed dataset/load, excluding payment and other third-party delays.
- Reliability: no known critical security flaws or unresolved payment/stock corruption defects at launch; monitor API health, payment exceptions and backups.
- Data protection: HTTPS, least privilege, no raw card storage, redacted logs and approved retention policies.
- Measurement: product view -> add to cart -> checkout started -> verified purchase; report conversion, abandonment, payment failure and stock exceptions. Set business targets after establishing a baseline.

## 10. Milestone compass
Estimates are provisional for one experienced full-stack developer with prompt owner feedback; audit results may change scope and duration. Advance by exit criteria, not just dates.

### M0 — Repository audit and business discovery (2–3 working days)
Work: inspect licence/assets, package manifests, routes, schemas, auth, payment code, secrets exposure and dependencies; run each app locally with test data. Confirm market, catalogue, inventory process, delivery and brand inputs.
Deliverables: runnable baseline, feature verification matrix, risk log, reuse/rewrite decisions, approved MVP and environment checklist.
Exit gate: owner approves launch scope; engineer records what actually works and what must be replaced. No production credentials in development.

### M1 — Brand and experience design (3–5 days)
Work: brand brief, design tokens, navigation, mobile-first wireframes, five key screen designs, size guide and content inventory.
Deliverables: approved clickable flow and component specification.
Exit gate: owner approves visual direction and shopper journey; required images/copy have owners and deadlines.
Dependency: M0 business decisions.

### M2 — Platform, catalogue and admin foundation (5–7 days)
Work: repository structure, TypeScript, environments, CI, schemas/indexes, sessions/roles, media upload, product/variant administration, stock and storefront settings.
Deliverables: staging deployment, seeded test catalogue, protected admin and backup setup.
Exit gate: admin creates a product and variants, updates stock and publishes it; authorisation tests pass.
Dependency: M0 audit and M1 component direction.

### M3 — Shopper storefront and cart (5–7 days)
Work: homepage, collections, product detail, filters, responsive styling, guest cart, metadata, loading/error/empty states.
Deliverables: end-to-end browsing prototype with real sample content.
Exit gate: shopper finds a product, selects a variant and edits a persistent cart on mobile; inactive/out-of-stock variants cannot be purchased.
Dependency: M2 catalogue APIs.

### M4 — Checkout, payment and order operations (5–8 days)
Work: delivery quote, server totals, stock reservations, payment adapter, callback verification, idempotency, reconciliation, confirmations and admin fulfilment.
Deliverables: complete staging checkout and staff order workflow.
Exit gate: sandbox success, failure, cancellation, timeout, delayed callback, duplicate callback and competing-last-item tests pass; no unauthorised order access.
Dependency: approved provider credentials, delivery rules and M2/M3.

### M5 — Hardening and owner acceptance (3–5 days)
Work: automated regression, mobile/browser checks, accessibility review, security checks, performance pass, recovery drill and staff walkthrough.
Deliverables: test evidence, operating guide, resolved launch defects and accepted legal/content pages.
Exit gate: owner signs off a complete test order and return/cancellation workflow; restore drill succeeds; no critical open defects.
Dependency: M4.

### M6 — Launch and stabilisation (2–3 days plus a 7-day observation window)
Work: production secrets/domain, restricted live payment verification, final content/stock checks, monitoring, rollback rehearsal and staff training.
Deliverables: live store, incident contacts and launch checklist.
Exit gate: permitted low-value live transaction verifies correctly, notifications arrive, fulfilment is exercised, alerts are active and rollback is documented.
Dependency: M5 approval and production provider approval.

Indicative implementation effort: 25–38 working days, roughly 5–8 working weeks, excluding provider onboarding, missing content, owner delays and stabilisation observation. Re-estimate after M0.

## 11. Not in the initial release
Multi-vendor selling, AI recommendations, native mobile apps, multi-currency, loyalty points, complex promotions, automatic courier integrations and POS/ERP synchronisation. Wishlist and reviews are post-launch unless deliberately substituted for other scope. Online returns automation is deferred; launch still requires an explicit customer support and refund process.

## 12. Definition of done
Approved brand and content; tested shopper and admin flows; verified payment and inventory integrity; secure production configuration; documented privacy/delivery/returns policies; backups tested; monitoring enabled; owner training complete; no critical unresolved defects.
