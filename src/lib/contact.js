/**
 * Contact information utility
 * Retrieves contact details from environment variables with fallback defaults
 */

export function getContactInfo() {
  return {
    phone: process.env.CONTACT_PHONE || "+1234567890",
    email: process.env.CONTACT_EMAIL || "support@company.com",
    company: process.env.COMPANY_NAME || "Your Company Name",
  };
}

export function getContactMessage() {
  const { phone } = getContactInfo();
  return `We will contact you soon.\nFor urgent requests, call: ${phone}`;
}
