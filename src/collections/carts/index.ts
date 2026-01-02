import { CollectionConfig } from "payload"
import { validateCartItems } from "./hooks/validate-cart-items"

export const carts: CollectionConfig = {
  slug: "carts",
  typescript: {
    interface: "Cart",
  },

  labels: {
    singular: "Cart",
    plural: "Carts",
  },
  admin: {
    useAsTitle: "user",
    defaultColumns: ["user", "items", "total"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      unique: true,
    },
    {
      name: "guestSessionId",
      type: "text",
      unique: true,
      admin: {
        hidden: true,
        description:
          "Identifier for guest user sessions. Programmatically generated.",
      },
    },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "productLine",
          label: "Item",
          type: "relationship",
          relationTo: "product-lines",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
        },
        {
          name: "snapshot",
          type: "group",
          label: "Snapshot",
          admin: {
            description:
              "A snapshot of the product line at the time it was added to the cart.",
            readOnly: true,
          },
          fields: [
            {
              name: "retailPrice",
              type: "number",
              label: "Retail Price",
              required: true,
            },
            {
              name: "inventoryStock",
              type: "number",
              label: "Stock",
              required: true,
            },
            {
              name: "virtualStock",
              type: "number",
              label: "Virtual Stock",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "total",
      type: "number",
      label: "Total",
      admin: {
        readOnly: true,
      },
      defaultValue: 0,
      virtual: true,
    },
    {
      name: "lastActiveAt",
      type: "date",
      label: "Last Active At",
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
        description:
          "Timestamp of the last activity on this cart by its owner.",
      },
      required: true,
    },
  ],
  hooks: {
    beforeChange: [validateCartItems],
    // afterChange: [revalidateCache],
  },
}
