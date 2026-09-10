const mongoSanitize = require("express-mongo-sanitize");

function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") {
    mongoSanitize.sanitize(req.body, {
      replaceWith: "_",
    });
  }

  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = { ...req.query };

    mongoSanitize.sanitize(sanitizedQuery, {
      replaceWith: "_",
    });

    Object.defineProperty(req, "query", {
      value: sanitizedQuery,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }

  if (req.params && typeof req.params === "object") {
    mongoSanitize.sanitize(req.params, {
      replaceWith: "_",
    });
  }

  next();
}

module.exports = sanitizeInput;
