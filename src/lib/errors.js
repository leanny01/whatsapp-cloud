export const WhatsAppErrorCodes = {
  UNAUTHORIZED: {
    code: 401,
    message: "Invalid or expired WhatsApp token",
  },
  RATE_LIMITED: {
    code: 429,
    message: "Too many requests to WhatsApp API",
  },
  SERVER_ERROR: {
    code: 500,
    message: "WhatsApp API server error",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Invalid request to WhatsApp API",
  },
};

export class WhatsAppAPIError extends Error {
  constructor(code, details = {}) {
    const errorInfo = WhatsAppErrorCodes[code] || {
      code: 500,
      message: "Unknown WhatsApp API error",
    };
    super(errorInfo.message);
    this.name = "WhatsAppAPIError";
    this.code = errorInfo.code;
    this.details = details;
  }
}
