# Technical Architecture

Project: QNK Noire Bags — Bags and Accessories Store
Version: 0.2 — M0-aligned target architecture, not a statement of verified repository internals.
Reference: https://github.com/bhavinvagh/online_clothes_store

## 1. Architectural approach
Use a modular monolith: one Express API and a MongoDB database, serving a React storefront and a separate React admin application. Keep catalogue, inventory, checkout, payments, fulfilment and identity as modules with explicit service boundaries. This supports a small shop without introducing microservice operations.
The reference repository exposes frontend/backend/admin directories and describes a MERN application. Keep working code where the milestone-0 audit supports it; do not preserve weak security, broken payment handling or unsuitable data models merely to minimise changes.

## 2. Proposed stack
| Layer | Selection | Purpose |
|---|---|---|
| Storefront | React, TypeScript, Vite, React Router | Responsive customer UI and routes |
| Styling | Tailwind CSS + CSS custom properties | Reusable components and configurable brand tokens |
| Remote data | TanStack Query | API caching, request state and invalidation |
| Local UI/cart | React context/reducer | Lightweight guest cart and interface state |
| Admin | Separate React/TypeScript application | Product, stock, order and content workflows |
| API | Supported Node.js LTS + Express + TypeScript | Business logic and authorised API endpoints |
| Validation | Zod or equivalent shared request schemas | Validate types, ranges and allowed fields at boundaries |
| Database | Managed MongoDB replica set + Mongoose | Records, indexes and multi-document transactions |
| Identity | Opaque server sessions; Argon2id password hashes | Revocable login sessions without browser-accessible bearer tokens |
| Media | Managed object/image storage and CDN | Product uploads, transformations and delivery |
| Payments | M-Pesa provider adapter for the confirmed merchant Till/Poči/Daraja capability | Isolate payment initiation, verification, callbacks and reconciliation; do not assume STK Push is available |
| Email | Transactional email provider | Order and recovery messages with retries |
| Hosting | Static web hosting; managed Node web service + worker | Separate UI delivery from API/background processing |
| Testing | Vitest, React Testing Library, Supertest, Playwright | Unit, component, integration and end-to-end coverage |
| Operations | Error monitoring, structured logs, CI pipeline | Release confidence and incident diagnosis |

Pin exact supported versions and run a dependency audit during M0. Kenya/KES and M-Pesa are the launch direction, but the merchant's Till/Poči/Daraja permissions and supported payment initiation must be verified before implementation. Do not assume Stripe, PayPal, STK Push or any M-Pesa callback already works in the reference code.
For product SEO, pre-render public product/category pages or adopt server rendering before launch if organic acquisition is a core requirement. A Vite client-rendered SPA alone is not a full SEO strategy; agree this requirement in M0 rather than adding a rendering migration late.

## 3. System layout
Customer browser -> storefront CDN -> /api reverse proxy -> Express API
Staff browser -> admin hosting -> protected API endpoints
Express API -> MongoDB replica set
Express API -> image storage/CDN, payment provider, email provider
Payment provider -> callback/webhook endpoint -> payment service
Background worker -> outbox tasks, reservation expiry, payment reconciliation, email retries

Prefer routing the storefront and API through the same site to simplify cookies and CSRF boundaries. If hosting uses different origins, define credentialed CORS, cookie scope and browser compatibility explicitly. Admin hosting is not itself an authorisation boundary: every admin API checks the user's role.
Use durable MongoDB-backed jobs/outbox records initially; do not rely on in-process timers for payment or inventory correctness. Introduce a queue/Redis only if operational needs justify it.

## 4. Code organisation
frontend/src: app, routes, components, features, styles, api
admin/src: app, products, inventory, orders, settings, users
backend/src: config, middleware, modules, jobs, db, integrations
backend/src/modules: auth, catalogue, inventory, checkout, payments, orders, fulfilment, settings
shared: API contracts and validation schemas where practical
Tests: unit tests beside services; integration and end-to-end suites in dedicated directories.

Controllers validate requests and authorisation; services own business rules; repositories own database operations; provider adapters handle external APIs. Do not put payment or inventory decisions in React components.

## 5. Data models
All persistent business records include id, createdAt and updatedAt. Use integer minor units for amounts and an explicit currency. Store dates in UTC and format for display at the edge.

### User
emailNormalized (unique where applicable), passwordHash, name, phone, role (customer/admin/fulfilment), status, optional savedAddresses. Do not silently use phone numbers as authentication without a verified flow.

### Session / RecoveryToken
Session: hashedToken (unique), userId, expiresAt, revokedAt.
RecoveryToken: hashedToken, userId, expiresAt, usedAt. Tokens are random, time-limited and single-use for password recovery. Expiry must be checked in application code; database TTL cleanup is not an exact scheduler.

### Product
slug (unique), title, description, categoryId, collections[], images[{assetId,url,alt,sortOrder}], sizeGuide, careInstructions, status (draft/active/archived), seoTitle, seoDescription.
Use a typed price policy: each variant has its authoritative price; any parent display price is derived.

### ProductVariant
productId, sku (unique), size, colour, priceMinor, currency, stockOnHand, reservedQuantity, active, version.
Unique compound index on productId + size + colour, if those attributes fully identify a variation.
Available quantity = stockOnHand - reservedQuantity. Update with conditional atomic operations; never read stock and later decrement without concurrency protection.

### Category / Collection
Category: name, slug (unique), description, image, active.
Collection: name, slug (unique), description, image, productIds or rule definition, active.
Prefer manual collections initially; avoid unrestricted executable rules.

### Cart
Optional server cart for signed-in users: userId, items[{variantId,quantity}], expiresAt.
Guest cart remains in browser storage and contains no authoritative prices, payment details or contact information. Account cart synchronisation is optional, not a launch prerequisite.

### Order
orderNumber (unique human-readable reference), userId (nullable), guestTrackingTokenHash, contact snapshot, deliveryAddress snapshot, items[{productId,variantId,sku,title,size,colour,unitPriceMinor,quantity,lineTotalMinor}], subtotalMinor, discountMinor, shippingMinor, taxMinor, totalMinor, currency, paymentStatus, fulfilmentStatus, deliveryZoneId, trackingReference, paidAt.
Store tax breakdown only under a reviewed tax policy; do not assume a particular jurisdiction's rates.
Payment status: unpaid/pending/paid/failed/expired/refund_pending/partially_refunded/refunded.
Fulfilment status: unfulfilled/processing/shipped/delivered/cancelled.
Validate allowed combinations and transitions in services.

### Reservation
orderId, items[{variantId,quantity}], status (active/consumed/released), expiresAt. Background expiry releases counters transactionally; deleting a reservation with a TTL index would not release stock correctly.

### PaymentAttempt / PaymentEvent
PaymentAttempt: orderId, provider, providerRequestId, providerTransactionId (unique sparse where present), amountMinor, currency, status, idempotencyKey (unique scoped to operation/customer), requestFingerprint, verifiedAt, failureCode.
PaymentEvent: provider, providerEventId (unique per provider when available), receivedAt, processingStatus, sanitisedPayload, payloadHash.
When providers lack stable event IDs, define a documented deterministic deduplication key. Never store raw card credentials, secrets or unnecessary full callback payloads.

### InventoryMovement
variantId, orderId (optional), type (receipt/sale/return/adjustment), quantityDelta, reason, actorId. Reservation changes are tracked separately from on-hand stock movements. Every manual adjustment is audited.

### DeliveryZone / StorefrontSettings
DeliveryZone: name, matchingRules, feeMinor, currency, active, optional deliveryEstimate.
StorefrontSettings: brandName, logoAssetId, validated themeTokens, navigation, homepageSections, featuredCollectionIds, contactDetails, socialLinks, policyContent.

### AuditLog / OutboxJob
AuditLog: actorId, action, entityType, entityId, redacted change summary, requestId, timestamp.
OutboxJob: type, aggregateId, unique deduplicationKey, payload, state, attempts, availableAt, lockedUntil, lastError. Store the job in the same transaction as the business change that requires it.

## 6. API surface
Public: GET /api/v1/products; GET /products/:slug; GET /categories; GET /collections; GET /storefront.
Identity: POST /auth/register, /auth/login, /auth/logout, /auth/forgot-password, /auth/reset-password; GET /auth/me.
Checkout: POST /checkout/quote; POST /orders with Idempotency-Key; POST /orders/:id/payment-attempts with Idempotency-Key.
Customers: GET /orders; GET /orders/:id; guest access uses an expiring unguessable token rather than just an order number.
Payments: POST /payments/:provider/callback; GET /orders/:id/payment-status (authorised).
Admin: product/variant/category CRUD, controlled stock adjustments, order lists/details, allowed fulfilment transitions and storefront settings.

Paginate list endpoints; bound query sizes and quantities; whitelist sort/filter fields; reject unknown privileged fields. Use consistent error envelopes containing code, safe message, fieldErrors and requestId. Quote responses are advisory until revalidated during order creation.

## 7. Checkout and payment consistency
1. Browser sends only variant IDs, quantities, address data and an idempotency key.
2. Server validates availability, calculates prices/delivery/tax and compares any quoted totals. Explain changed totals before charging.
3. In a MongoDB transaction, reserve all variants with conditional availability checks and create the order, reservation and required outbox records. A partial failure rolls back every line.
4. Create a payment attempt and initiate the provider request outside the database transaction. Persist provider identifiers; reconcile uncertain network outcomes before retrying to avoid duplicate charges.
5. Provider callback is authenticated/validated using the provider's supported mechanisms. Do not assume all providers sign callbacks identically. Compare transaction reference, order, amount, currency and final status; independently query the provider where needed.
6. In a transaction, mark verified payment paid, consume the reservation, decrement on-hand and reserved quantities and enqueue one confirmation. Conditional state changes and unique keys make retries harmless.
7. A failed/expired attempt releases an active reservation only once. A worker handles expiry and stale pending payments using durable state.
8. A verified late payment after release enters an exception flow: reacquire stock atomically if policy permits, otherwise trigger a reviewed refund/support workflow. Do not mark an unavailable order fulfilment-ready.
9. If a second successful payment reaches an already paid order, record it as an overpayment exception and reconcile/refund; do not fulfil twice.
10. Refunds have separate provider verification and status tracking. Restock returned physical items only after staff confirms receipt and resale eligibility, not automatically on every refund.

Payment provider sandbox tests are not a substitute for approved production onboarding and a controlled live verification.

## 8. Security and privacy
HTTPS throughout; secrets in environment/secret management; no secret keys in frontend builds. Use HttpOnly, Secure cookies with suitable SameSite settings, CSRF protections for cookie-authenticated writes, restrictive CORS and session revocation. Enforce server-side role and object-level authorisation; require stronger authentication for admins, preferably MFA.
Hash passwords with Argon2id; rate-limit login/recovery/checkout and limit body/upload sizes. Validate media types, restrict uploads and never trust user-supplied file paths. Sanitize any allowed rich content; use security headers and a tested content-security policy.
Exclude credentials, full addresses and unnecessary payment/contact data from logs. Limit staff access, approve retention periods, define deletion/export procedures and verify applicable local privacy, tax and consumer obligations before launch. These are engineering requirements, not legal advice.

## 9. Deployment and operations
Maintain isolated development, staging and production databases, storage and payment credentials. CI runs lint/type checking, unit/integration tests, build and dependency checks. Staging runs end-to-end checkout tests with sandbox providers.
Use controlled, backwards-compatible schema/data changes and retain the prior application release for rollback. Restoring a database after accepting real payments is not a routine code rollback: reconcile transactions and inventory before resuming service.
Enable database backups and test restore into an isolated environment. Propose recovery point <=24 hours and recovery time <=4 hours initially, subject to the purchased backup tier and measured drills; tighten as order volume grows.
Monitor API errors/latency, worker health, pending payment age, callback failures, inventory exceptions and confirmation failures. Use request IDs across logs and provider references for reconciliation. Alert staff on paid-but-unfulfillable orders immediately.

## 10. Test strategy and release gates
Unit: pricing, delivery matching, state transitions, quantity rules and permission policies.
Integration: real transaction-capable test MongoDB; session handling, stock contention, order ownership, idempotency and webhook/callback processing.
End-to-end: guest and account checkout, unsupported address, stock changes, failed payment, mobile navigation, admin publication and fulfilment.
Adversarial cases: tampered prices, negative quantities, role escalation, other-user order IDs, replayed callbacks, duplicate payment initiation, delayed notifications, two buyers competing for one item and worker crash after commit.
Operational: backup restore, provider timeout/reconciliation, expired reservations, retry exhaustion, production configuration and rollback rehearsal.
Release only when the PRD's milestone gates and definition of done are evidenced, not merely when the UI appears complete.

## 11. Decisions to record during M0
Confirm reuse versus rewrite, rendering/SEO requirement, country/currency, provider eligibility and verification mechanisms, inventory source of truth, delivery rules, media provider, hosting costs, staff permissions, retention policy and recovery targets. Record decisions and rationale in short architecture decision records; update this document when approved scope changes.
