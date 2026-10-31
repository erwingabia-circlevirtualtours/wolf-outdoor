# WOLF Outdoor Batangas City — Architectural Audit & Technical Specification

> **Scope**: Admin CMS Panel, Equipment Catalog, Order FSM, Staff Security, and Mt. Ulanin Camp Fest 2026 Event Systems.  
> **Document Status**: Technical Specification & Audit  
> **Target Release**: WOLF Outdoor Batangas City (Mt. Ulanin 710 MASL Basecamp)  

---

## 1. Data Architecture & Schema Validation

### 1.1 Strict Zod & TypeScript Interface Definitions

To prevent malformed gear specifications or negative inventory in both the Admin CMS and JSON imports/exports, the equipment catalog must be enforced via strict schema validation.

```typescript
import { z } from 'zod';

export const WeatherRatingSchema = z.enum([
  '3-Season (Rain/Wind)',
  '4-Season (Stormproof)',
  'Tropical Ridge Waterproof (3000mm+ PU)',
  'UV50+ Sun Protection',
  'All-Weather Trail'
]);

export const EquipmentSpecsSchema = z.object({
  material: z.string().min(3, 'Material specification is required (e.g., 210T Ripstop Nylon)'),
  weight: z.string().regex(/^\d+(\.\d+)?\s*(g|kg|oz|lbs)$/i, 'Weight must include units (e.g., 420g, 1.8kg)'),
  dimensions: z.string().min(3, 'Dimensions required (e.g., 290 x 140 cm)'),
  capacity: z.string().optional(), // e.g. "200 kg / 440 lbs" or "2 Persons"
  colorway: z.string().optional(),
  weatherRating: WeatherRatingSchema.optional(),
});

export const OutdoorProductSchema = z.object({
  id: z.string().regex(/^wolf-[a-z0-9-]+$/, 'Product ID must be kebab-case prefixed with wolf-'),
  name: z.string().min(5).max(100),
  subtitle: z.string().min(5).max(150),
  category: z.enum(['apparel', 'hammocks', 'tents', 'gear', 'accessories']),
  price: z.number().int().positive('Price must be a positive integer in PHP'),
  originalPrice: z.number().int().positive().optional(),
  rating: z.number().min(1).max(5).default(5),
  reviewCount: z.number().int().nonnegative().default(0),
  badge: z.string().max(30).optional(),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, 'Stock count cannot be negative'),
  description: z.string().min(20),
  features: z.array(z.string().min(3)).min(1, 'At least one feature is required'),
  specs: EquipmentSpecsSchema,
  image: z.string().refine(
    val => val.startsWith('/') || val.startsWith('https://'),
    'Valid image URL or local asset path required'
  ),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex color required')
  })).optional()
}).refine(data => {
  // Enforce stock consistency: if inStock is true, stockCount must be > 0; if stockCount == 0, inStock must be false
  if (data.stockCount === 0 && data.inStock) return false;
  if (data.stockCount > 0 && !data.inStock) return false;
  return true;
}, {
  message: "inStock boolean must stay strictly synchronized with stockCount (>0)",
  path: ["inStock"]
});

export type ValidatedOutdoorProduct = z.infer<typeof OutdoorProductSchema>;
```

### 1.2 Static File Sync (`products.ts` / `aws s3 sync`) vs Headless Backend

#### Current Architecture
The admin updates products through `StoreContext` (persisted to client `localStorage`), then exports `src/data/products.ts` or `products.json`. The administrator builds via Vite (`npm run build`) and uploads to AWS S3:
```bash
aws s3 sync dist s3://wolf-outdoor --delete
```

#### Risk Analysis
1. **Concurrent Overwrites (Race Conditions)**: If Staff A at Brgy. Cumba updates tent inventory while Staff B at Batangas City updates trail tee sizes, the last person running `aws s3 sync` overwrites the other staff member's work.
2. **Client Desynchronization**: End-users browsing the site keep stale catalog bundles unless S3/CloudFront `Cache-Control` headers for `index.html` force immediate re-validation (`max-age=0, must-revalidate`).
3. **Lost Orders & Stock Drifts**: When customers place orders concurrently, client-side stock deductions cannot mutate a central master inventory in real-time.

#### Integrity Protections Recommended
* **Near-Term (Static/S3)**: Implement an S3-hosted `inventory.json` with conditional PUT (`If-Match` using ETag) or S3 Object Locking to reject conflicting writes.
* **Long-Term**: Migrate catalog, orders, and event rosters to a serverless datastore (Firebase Firestore or PostgreSQL / Cloud SQL), keeping the static landing page assets cached on AWS S3/CloudFront while dynamic endpoints handle inventory state.

---

## 2. Deterministic State Machine for Orders & GCash Verification

### 2.1 State Machine Specification (FSM)

Orders must follow a deterministic state machine to prevent illegal lifecycle states (e.g., dispatching unverified orders or cancelling completed deliveries):

```
                     ┌───────────────────────┐
                     │    pending_payment    │
                     └──────────┬────────────┘
                                │ GCash Ref Validated & Confirmed
                                ▼
                     ┌───────────────────────┐
            ┌───────►│       verified        ├──────┐
            │        └──────────┬────────────┘      │
            │                   │ Basecamp Allocation
            │                   ▼                   │
            │        ┌───────────────────────┐      │
            │        │       preparing       │      │ Cancel / Out of Stock
            │        └──────────┬────────────┘      │
            │                   │ Handed to Courier/Pickup
            │                   ▼                   │
            │        ┌───────────────────────┐      │
            │        │      dispatched       │      │
            │        └──────────┬────────────┘      │
            │                   │ Received by Joiner│
            │                   ▼                   │
            │        ┌───────────────────────┐      │
            │        │       completed       │      │
            │        └───────────────────────┘      │
            │                                       │
            └─────────── [Rollback Allowed] ────────┴─► ┌───────────┐
                                                        │ cancelled │
                                                        └───────────┘
```

### 2.2 Transition Guard Matrix

| Initial State | Target State | Permitted? | Required Guards & Validation |
| :--- | :--- | :--- | :--- |
| `pending_payment` | `verified` | Yes | GCash Reference format valid (12 digits); amount matches total. |
| `pending_payment` | `cancelled` | Yes | Customer cancellation or expired payment window (48h). |
| `verified` | `preparing` | Yes | Gear items successfully allocated from Basecamp stock. |
| `preparing` | `dispatched` | Yes | Courier tracking code or basecamp pickup slip assigned. |
| `dispatched` | `completed` | Yes | Delivery confirmation or joiner pickup acknowledgment. |
| *Any except completed* | `cancelled` | Yes | Requires `cancellationReason` string + inventory re-increment. |
| `completed` | `cancelled` | **NO** | Terminal state. Requires dedicated Return/Refund protocol. |

### 2.3 GCash Reference Number Ingestion Rules

* **Format**: Standard GCash e-wallet reference numbers are exactly **12 numeric digits** (e.g., `9021 4820 1948` or `902148201948`).
* **Sanitization & Validation**:
  ```typescript
  export const cleanGCashRef = (raw: string): string => raw.replace(/\D/g, '');

  export const isValidGCashRef = (cleaned: string): boolean => {
    return /^\d{12}$/.test(cleaned);
  };
  ```
* **Deduplication Check**: Before advancing an order to `verified`, check for duplicates:
  ```typescript
  const isDuplicate = existingOrders.some(
    o => o.paymentReference === cleanedRef && o.id !== targetOrderId
  );
  ```
* **Staff Audit Trail**: Whenever staff updates an order note or status, automatically record an immutable audit entry:
  `[2026-10-30 14:22 PST · Staff #043]: Status changed to 'verified'. GCash ref #902148201948 acknowledged.`

---

## 3. Security & Access Control Review

### 3.1 Threat Model of Current PIN Mechanism
* **Current Implementation**: A plain client-side PIN check (`wolf2026` / `wolf` / `710`) evaluated in `StoreContext.tsx` and persisted in browser `sessionStorage`.
* **Identified Vulnerabilities**:
  1. **Bundle Decompilation**: Plaintext PIN strings are present in compiled bundle chunks (`dist/assets/*.js`).
  2. **Session Storage Tampering**: Setting `sessionStorage.setItem('wolf_staff_auth', 'true')` in browser DevTools grants full admin access without authentication.
  3. **Lack of Non-Repudiation**: A shared PIN leaves zero trace of which staff member adjusted stock or cancelled an order.

### 3.2 Security Hardening Roadmap

#### Phase 1: Zero-Backend Client Hardening (Immediate)
* **Cryptographic Hashing**: Hash user input with `crypto.subtle.digest('SHA-256', ...)` against a stored salted digest rather than comparing plaintext strings.
* **Rate-Limiting & Lockout**: Enforce maximum 5 attempts; lock the admin portal for 15 minutes after repeated failures using an encrypted timestamp.

#### Phase 2: Role-Based Access Control (RBAC) Architecture
* **Roles**:
  * `Super Admin`: Product creation/deletion, price overrides, global announcement banners.
  * `Inventory Lead`: Stock stepper increments, basecamp warehouse allocations.
  * `Trail Marshal`: Mt. Ulanin joiner roster verification, medical note inspections, QR check-in.
  * `Order Fulfillment`: Order status progression and courier dispatch logging.
* **Audit Logging Schema**:
  ```typescript
  export interface StaffAuditLog {
    id: string;
    timestamp: string;
    staffId: string;
    staffName: string;
    action: 'PRODUCT_UPDATE' | 'STOCK_ADJUST' | 'ORDER_STATUS_CHANGE' | 'JOINER_VERIFY';
    targetEntityId: string;
    diffSummary: string;
    ipAddress?: string;
  }
  ```

---

## 4. Event & Rental System Specifications (Mt. Ulanin Camp Fest 2026)

### 4.1 Schema Definition & Safety Classifications

```typescript
export interface CampFestJoiner {
  id: string; // e.g. "WOLF-CF26-7101"
  qrCodeId: string; // e.g. "WOLF-ULANIN-710M-DH01"
  joinerName: string;
  contactNumber: string; // Philippine mobile: 09xx xxx xxxx
  emergencyContact: {
    name: string;
    relationship: 'Spouse' | 'Parent' | 'Sibling' | 'Child' | 'Friend';
    phone: string;
  };
  activityCategory: 'Hiker' | 'Mountain Biker' | 'Camper';
  trailExperienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  medicalAndSafety: {
    medicalConditions: string[]; // e.g. ["Asthma", "Hypertension", "None"]
    dietaryRestrictions?: string; // e.g. "No pork", "Trail vegan", "Nut allergy"
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  };
  gearRentals: {
    hammockQuantity: number;
    tentQuantity: number;
    trekkingPolePair: boolean;
  };
  payment: {
    method: 'GCash' | 'Maya' | 'Cash at Basecamp';
    feePhp: number;
    referenceNumber?: string;
    isPaid: boolean;
  };
  checkInStatus: 'Pre-Registered' | 'Verified at Basecamp' | 'Ascended Summit (710 MASL)' | 'Checked Out';
}
```

### 4.2 Export Logic & Marshal Operations
* **Sanitized CSV Generation**: Format all Philippine phone numbers with a preceding single quote (`'09xxxxxxxxx`) to prevent spreadsheet tools from dropping leading zeroes.
* **Trail Safety Highlighting**: Automatically flag joiners with reported medical conditions or severe food allergies with Signal Orange (`#f97316`) badges in the Marshal Check-In view.

---

## 5. Verification Criteria & Automated Testing Suite

Prior to executing `npm run build` or running `aws s3 sync dist s3://wolf-outdoor --delete`, the following automated assertions must be verified:

### 5.1 Static Type & Compiler Checks
* `tsc --noEmit` exits with status `0` under TypeScript strict mode.
* ESLint passes with zero unresolved import or type coercion warnings.

### 5.2 Playwright / Vitest Assertions
1. **Inventory Consistency**:
   * *Assertion*: Decrementing stock when `stockCount = 1` sets `stockCount = 0` and automatically switches `inStock` to `false`.
   * *Assertion*: Out-of-stock items disable the "Add to Cart" button in the storefront catalog.
2. **Order FSM Validation**:
   * *Assertion*: Direct transition from `pending_payment` to `completed` without `verified` is blocked and raises an illegal transition exception.
   * *Assertion*: Submitting an invalid GCash reference (e.g. 8 digits or letters) displays an inline validation message: `"GCash reference must be 12 numeric digits"`.
3. **Staff Security Gate**:
   * *Assertion*: Triggering `Ctrl+Shift+A` without active session renders the PIN modal.
   * *Assertion*: Five consecutive incorrect attempts disables the input field and displays a cooldown timer.
4. **Data Export/Import Roundtrip**:
   * *Assertion*: Exporting `products.json` and importing the resulting payload produces identical deeply-equal state.
