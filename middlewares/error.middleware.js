export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Interner Serverfehler',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};