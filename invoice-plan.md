---
name: Invoice PDF Implementation
overview: Create an identical invoice PDF using React-PDF based on the provided Yasir invoice, with all components inside the pdf folder and a preview at /pdf route.
todos:
  - id: install-deps
    content: Install @react-pdf/renderer package
    status: completed
  - id: create-types
    content: Create invoice data types in pdf/types.ts
    status: completed
  - id: create-sample-data
    content: Create sample invoice data matching Yasir invoice in pdf/data.ts
    status: completed
  - id: create-fonts
    content: Create fonts.ts to register Montserrat (bold) and Inter fonts
    status: pending
  - id: create-styles
    content: Create shared StyleSheet in pdf/components/styles.ts
    status: completed
  - id: create-header
    content: Create Header component with logo and company info
    status: completed
  - id: create-invoice-meta
    content: Create InvoiceMeta component for invoice number, date, etc.
    status: completed
  - id: create-bill-ship
    content: Create BillShipTo component for customer addresses
    status: completed
  - id: create-order-info
    content: Create OrderInfo component for sales person, terms, etc.
    status: completed
  - id: create-items-table
    content: Create ItemsTable component for line items
    status: completed
  - id: create-totals
    content: Create Totals component for subtotal, VAT, grand total
    status: completed
  - id: create-footer
    content: Create Footer component with payment instructions
    status: completed
  - id: create-document
    content: Create main InvoiceDocument component combining all sections
    status: completed
  - id: update-page
    content: Update page.tsx with PDFViewer and sample data
    status: completed
isProject: false
---

# Invoice PDF Implementation Plan

## Overview

Implement a PDF invoice generator using `@react-pdf/renderer` that replicates the provided Yasir invoice. The solution will include type-safe invoice data, reusable React-PDF components, and a preview page at `/pdf`.

## Invoice Structure Analysis

From the provided PDF, the invoice contains:

- **Header**: EUROFIT logo, tagline, company address, phone numbers, email
- **Invoice Meta**: Invoice number (511305442125), date, account number, FAO
- **Bill To / Ship To**: Customer name, contact person, address, phone
- **Order Info**: Sales person, P.O number, requisitioner, payment terms, shipping method
- **Items Table**: Line number, quantity, description, unit price, total
- **Totals Section**: Subtotal, VAT, delivery fee, grand total, paid amount, unpaid balance
- **Footer**: Thank you message, M-Pesa payment instructions, WhatsApp QR code, print timestamp

## Data Structure

Create invoice data types and sample JSON in `[src/app/(frontend)/(plain)/pdf/types.ts](src/app/(frontend)/(plain)/pdf/types.ts)`:

```typescript
interface InvoiceData {
  invoiceNumber: string;
  date: string;
  accountNumber: string;
  fao: string;
  billTo: {
    name: string;
    contact: string;
    address: string[];
    phone: string;
  };
  shipTo: {
    name: string;
    address: string[];
    phone: string;
  };
  orderInfo: {
    salesPerson: string;
    poNumber: string;
    requisitioner: string;
    terms: string;
    shippedVia: string;
  };
  items: Array<{
    no: number;
    qty: number;
    description: string;
    price: number;
  }>;
  subtotal: number;
  vat: number;
  deliveryFee: number;
  grandTotal: number;
  paid: number;
  unpaidBalance: number;
}
```

## File Structure

All files will be created inside `src/app/(frontend)/(plain)/pdf/`:

```
pdf/
├── page.tsx              # Preview page with PDFViewer
├── types.ts              # Invoice data types
├── data.ts               # Sample invoice data (Yasir invoice)
├── fonts.ts              # Font registration (Montserrat, Inter)
├── components/
│   ├── invoice-document.tsx  # Main Document wrapper
│   ├── header.tsx            # Company header section
│   ├── invoice-meta.tsx      # Invoice number, date, etc.
│   ├── bill-ship-to.tsx      # Bill To and Ship To sections
│   ├── order-info.tsx        # Sales person, terms, etc.
│   ├── items-table.tsx       # Line items table
│   ├── totals.tsx            # Subtotal, VAT, grand total
│   ├── footer.tsx            # Thank you, payment instructions
│   └── styles.ts             # Shared StyleSheet
```

## Font Configuration

Register custom fonts in `fonts.ts`:

- **Montserrat Bold**: Used for the EUROFIT logo/brand name
- **Inter**: Used for all body text (regular, medium, bold weights)

```typescript
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aXp-p7K4KLg.woff2",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 700,
    },
  ],
});
```

## Implementation Details

### 1. Install Dependency

```bash
pnpm add @react-pdf/renderer
```

### 2. Styles (`styles.ts`)

- Define reusable StyleSheet with colors matching the original invoice (teal header, borders, spacing)
- Use **Montserrat Bold** for the EUROFIT logo text
- Use **Inter** (regular/medium/bold) for all body text, labels, and values

### 3. Components

Each component uses React-PDF primitives (`Document`, `Page`, `View`, `Text`, `Image`):

- **Header**: Company logo, name "EUROFIT", tagline "European fitness, African Strength", address block, contact info
- **Invoice Meta**: Right-aligned box with invoice number, date, ACC NO, FAO fields
- **Bill/Ship To**: Two-column layout for billing and shipping addresses
- **Order Info**: Row of fields (sales person, P.O number, requisitioner, terms, shipped via)
- **Items Table**: Table with columns NO | QTY | DESCRIPTION | PRICE with row totals
- **Totals**: Right-aligned summary with subtotal, VAT, delivery fee, grand total, paid, unpaid balance
- **Footer**: Thank you message, payment instructions, QR code placeholder, timestamp

### 4. Preview Page (`page.tsx`)

Use `PDFViewer` component wrapped in a client component with `'use client'` directive:

```typescript
"use client";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoiceDocument } from "./components/invoice-document";
import { sampleInvoice } from "./data";

export default function Page() {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <InvoiceDocument data={sampleInvoice} />
    </PDFViewer>
  );
}
```

### 5. Sample Data (`data.ts`)

Exact data from the Yasir invoice:

- Invoice No: 511305442125
- Date: 05/11/2025
- Customer: YASIR CUSMETICS
- 5 line items totaling Ksh 159,900
- Paid: 100,000, Balance: 59,900

## Key Technical Considerations

1. **Client-side Rendering**: React-PDF's `PDFViewer` requires client-side rendering in Next.js - use `'use client'` directive
2. **Logo Image**: Use the existing `public/logo.png` file via absolute URL or base64 encoding
3. **Currency Formatting**: Format amounts as "Ksh X,XXX" matching the original invoice
4. **QR Code**: Use a static QR code image or generate one for WhatsApp link

## Leveraging Existing Code

- Company info from `[src/constants/site.tsx](src/constants/site.tsx)` (address, phone, email)
- Payment terms from `[src/constants/payment-terms.ts](src/constants/payment-terms.ts)`
