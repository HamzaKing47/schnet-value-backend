export const healthCheck = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SchNet Value backend is running",
    timestamp: new Date().toISOString(),
  });
};
