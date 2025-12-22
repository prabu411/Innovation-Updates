// Simple ping to keep Render free tier awake
setInterval(() => {
  fetch('https://innovation-updates.onrender.com/api/health')
    .then(() => console.log('Backend pinged successfully'))
    .catch(() => console.log('Ping failed'));
}, 14 * 60 * 1000); // Every 14 minutes

console.log('Backend keep-alive started');