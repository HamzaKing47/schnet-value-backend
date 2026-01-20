export const validateRequired = (data, fields) => {
  const missing = fields.filter(
    (f) => data[f] === undefined || data[f] === null
  );

  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  return null;
};
