export function buildWhatsAppLink({
  phone,
  message,
}: {
  phone: string
  message: string
}) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`
}
