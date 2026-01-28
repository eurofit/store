import { slugField } from "../../fields/slug"
import { CollectionConfig } from "payload"
import { getRelatedProducts } from "./hooks/get-related-products"

export const products: CollectionConfig = {
  slug: "products",
  typescript: {
    interface: "Product",
  },
  labels: {
    singular: "Product",
    plural: "Products",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "brand", "origin", "srcImage"],
  },
  defaultSort: "title",
  fields: [
    {
      name: "active",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
      admin: {
        description: "Indicates whether the product is currently active.",
        position: "sidebar",
      },
    },
    {
      name: "brand",
      type: "relationship",
      relationTo: "brands",
      hasMany: false,
      label: "Brand",
      admin: {
        description: "Select the brand associated with this product.",
        allowEdit: true,
        allowCreate: false,
      },
      required: true,
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      admin: {
        description:
          "A descriptive title for the product, used for display purposes.",
      },
      required: true,
    },
    ...slugField("title"),
    {
      name: "origin",
      type: "text",
      label: "Product Origin",
      admin: {
        description:
          "Specify the origin of the product, such as country or region.",
      },
    },
    {
      name: "images",
      type: "upload",
      label: "Product Images",
      relationTo: "media",
      hasMany: true,
      maxRows: 6,
    },
    {
      name: "srcImage",
      type: "text",
      label: "The product source provided image URL",
      admin: {
        description:
          "Enter the URL of the product image provided by the supplier or your source.",
        components: {
          Cell: {
            path: "../../fields/image-cell#ImageCell",
          },
        },
      },
    },
    {
      name: "productInformation",
      type: "textarea",
      label: "Product Information",
      admin: {
        description:
          "Provide detailed information about the product, including features, specifications, and usage instructions.",
      },
    },
    {
      name: "nutritionalInformation",
      type: "textarea",
      label: "Nutritional Information",
      admin: {
        description: "Provide nutritional information for the product.",
      },
    },
    {
      name: "srcUrl",
      type: "text",
      label: "Source URL",
      admin: {
        description:
          "Enter the URL of the product page on the supplier's website.",
      },
    },
    {
      name: "productLines",
      type: "join",
      collection: "product-lines",
      label: "Product Lines",
      hasMany: true,
      on: "product",
      admin: {
        allowCreate: true,
      },
      required: true,
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      label: "Categories",
      admin: {
        description: "Select categories that this product belongs to.",
        allowCreate: true,
        allowEdit: true,
      },
    },
    {
      name: "relatedProducts",
      type: "group",
      fields: [
        {
          name: "products",
          type: "array",
          fields: [
            {
              name: "slug",
              type: "text",
              required: true,
            },
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "image",
              type: "text",
            },
          ],
        },
        {
          name: "total",
          type: "number",
          defaultValue: 0,
          required: true,
        },
      ],

      virtual: true,
      label: "Related Products",
    },
  ],

  hooks: {
    afterRead: [getRelatedProducts],
  },
}
