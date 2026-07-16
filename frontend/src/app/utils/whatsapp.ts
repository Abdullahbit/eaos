/**
 * Generates a wa.me redirection URL with a prefilled message.
 * Exposes only the lead reference ID, protecting personal information.
 */
export function generateWhatsAppLink(leadId: string): string {
  const whatsappNumber = "905000000000"; // Abdullah's contact line
  const message = `Hi Abdullah, I just completed my assessment on Campus Insider. My reference ID is: ${leadId}. Let's review my options!`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
