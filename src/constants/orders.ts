// answers: “What are we doing with the order?” | "Where is my order?"
export const orderStatus = [
  {
    label: 'Pending',
    value: 'pending' as const,
    color: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    },
  },
  {
    label: 'Processing',
    value: 'processing' as const,
    color: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
  },
  {
    label: 'Shipped',
    value: 'shipped' as const,
    color: {
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
  },
  {
    label: 'Delivered',
    value: 'delivered' as const,
    color: {
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
  },
  {
    label: 'Cancelled',
    value: 'cancelled' as const,
    color: {
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
  },
];

// answers: “Did we get the money?”
export const paymentStatus = [
  { label: 'Unpaid', value: 'unpaid' as const },
  { label: 'Paid', value: 'paid' as const },
  { label: 'Refunded', value: 'refunded' as const },
];
