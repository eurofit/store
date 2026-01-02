import { slugField } from "@/fields/slug"
import { CollectionConfig } from "payload"
import { checkIfBackOrder } from "./hooks/check-if-back-ordered"
import { checkIfLowStock } from "./hooks/check-if-low-stock"
import { checkIfOutOfStock } from "./hooks/check-if-out-stock"
import { checkIfNotfiyRequested } from "./hooks/check-notify-requested"

export const productLines: CollectionConfig = {
  slug: "product-lines",
  typescript: {
    interface: "ProductLine",
  },
  labels: {
    singular: "Product Line",
    plural: "Product Lines",
  },
  admin: {
    useAsTitle: "title",
    listSearchableFields: ["sku", "variant", "title", "barcode", "slug"],
    defaultColumns: ["title", "variant", "sku", "expiryDate", "stock"],
  },
  fields: [
    // === Sidebar Fields ===
    ...slugField("title", {
      slugOverrides: {
        admin: {
          description:
            'Used in URLs like "/products/optimum-whey-900g". Auto-generated from the product title but can be edited.',
        },
      },
    }),
    {
      name: "sku",
      type: "text",
      required: true,
      unique: true,
      label: "SKU",
      admin: {
        position: "sidebar",
        description: "Unique internal ID for managing inventory.",
      },
    },
    {
      name: "active",
      type: "checkbox",
      required: true,
      defaultValue: true,
      label: "Available for Sale",
      admin: {
        position: "sidebar",
        description: "Uncheck to hide this product from the store.",
      },
    },

    // === General Information ===
    {
      type: "collapsible",
      label: "General Information",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          index: true,
          label: "Product Title",
          admin: {
            description:
              'Full name of the product, e.g. "Optimum Nutrition Whey 900g Banana".',
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "size",
              type: "text",
              label: "Size",
              admin: {
                description: 'Package size, e.g. "900g".',
              },
            },
            {
              name: "flavorColor",
              type: "text",
              label: "Flavor / Color",
              admin: {
                description: "Flavor or color of this product variant.",
              },
            },
          ],
        },
        {
          name: "variant",
          type: "text",
          label: "Variant",
          admin: {
            description:
              'Display name like "900g / Banana Cream". Auto or manual.',
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "product",
              type: "relationship",
              relationTo: "products",
              required: true,
              label: "Parent Product",
              admin: {
                description: "The main product this variation belongs to.",
              },
            },
            {
              name: "category",
              type: "text",
              label: "Category",
              admin: {
                description: 'Product type like "Protein", "Vitamins".',
              },
            },
          ],
        },
      ],
    },

    // === Images ===
    {
      type: "collapsible",
      label: "Images",
      fields: [
        {
          name: "images",
          type: "upload",
          relationTo: "media",
          hasMany: true,
          maxRows: 6,
          label: "Product Images",
          admin: {
            description:
              "Upload up to 6 images for this product. If none, it will use the parent product image.",
          },
        },
      ],
    },

    // === Pricing ===
    {
      type: "collapsible",
      label: "Pricing",
      fields: [
        {
          name: "srcPrice",
          type: "number",
          label: "Source Price (GBP)",
          admin: {
            description: "Original price from the supplier in GBP.",
          },
        },
        {
          name: "srcDiscountedPrice",
          type: "number",
          label: "Source Discounted Price (GBP)",
          admin: {
            description: "Discounted supplier price, if any.",
          },
        },
        {
          name: "retailPrice",
          type: "number",
          label: "Retail Price (KES)",
          admin: {
            description:
              "Customer price in KES (calculated from source price, shipping, margin).",
          },
        },
        {
          name: "wholesalePrice",
          type: "number",
          label: "Wholesale Price (KES)",
          admin: {
            description: "Bulk buyer price in KES (lower margin).",
          },
        },
      ],
    },

    // === Inventory ===
    {
      type: "collapsible",
      label: "Inventory",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "stock",
              type: "number",
              defaultValue: 0,
              required: true,
              label: "In-House Stock",
              admin: {
                description: "Units you have on hand.",
              },
            },
            {
              name: "srcStock",
              type: "number",
              label: "Backup Stock",
              admin: {
                description:
                  "Units available from manufacturer / distributor or any external source.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "onPallet",
              type: "number",
              label: "Units per Pallet",
              admin: {
                description: "How many units fit on one pallet.",
              },
            },
            {
              name: "inCase",
              type: "number",
              label: "Units per Case",
              admin: {
                description: "How many units in one box / case.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "expiryDate",
              type: "date",
              label: "Expiry Date",
              admin: {
                description: "Product expiration (if applies).",
              },
            },
            {
              name: "weight",
              type: "number",
              label: "Weight (Kg)",
              admin: {
                description: "Used for shipping cost calc.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "servingSizePerContainer",
              type: "number",
              label: "Total Servings",
              admin: {
                description:
                  "How much product is in the pack (helps predict how long it lasts).",
              },
            },
            {
              name: "servingSize",
              type: "number",
              label: "Daily Serving",
              admin: {
                description:
                  "Recommended daily amount. Used to estimate finish date.",
              },
            },
          ],
        },
      ],
    },

    // === Codes ===
    {
      type: "collapsible",
      label: "Codes & Compliance",
      fields: [
        {
          name: "srcProductCode",
          type: "text",
          label: "Source Product Code",
          admin: {
            description: "Supplier’s product code.",
          },
        },
        {
          name: "barcode",
          type: "text",
          label: "Barcode",
          admin: {
            description: "Retail scan code (EAN/UPC).",
          },
          index: true,
        },
        {
          name: "exportCommodityCode",
          type: "text",
          label: "Export Commodity Code",
          admin: {
            description: "Customs / HS code for export.",
          },
        },
      ],
    },
    {
      name: "isNotifyRequested",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if a customer has requested notification for back-in-stock status. Managed programmatically.  ",
      },
      hooks: {
        afterRead: [checkIfNotfiyRequested],
      },
    },

    {
      name: "isLowStock",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if the product stock is below the low stock threshold. Managed programmatically.",
      },
      hooks: {
        afterRead: [checkIfLowStock],
      },
    },
    {
      name: "isOutOfStock",
      type: "checkbox",
      defaultValue: true,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if the product is out of stock. Managed programmatically.",
      },
      hooks: {
        afterRead: [checkIfOutOfStock],
      },
    },

    {
      name: "isBackorder",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if the product is back-orderable. Managed programmatically.",
      },
      hooks: {
        afterRead: [checkIfBackOrder],
      },
    },
    {
      name: "inventory",
      type: "join",
      collection: "inventory",
      on: "item",
      hasMany: false,
    },
    {
      name: "inventoryStock",
      type: "number",
      virtual: true,
      defaultValue: 0,
    },
  ],

  hooks: {
    // afterChange: [revalidateProductLineCache],
  },
}
