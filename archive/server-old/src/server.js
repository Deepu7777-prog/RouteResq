const app = require('./app');
const seedDatabase = require('./seed');

const PORT = process.env.PORT || 5000;

// Seed database if running for the first time
try {
  seedDatabase();
} catch (err) {
  console.warn('[RouteResQ Server] Database auto-seed warning:', err.message);
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` [RouteResQ REST API Server] Online`);
  console.log(` Organization: Ministry of Development of NER (MDoNER)`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
