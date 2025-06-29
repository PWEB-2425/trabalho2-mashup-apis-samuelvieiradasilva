const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

router.get('/', (req, res) => res.redirect('/auth/login'));

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile('dashboard.html', { root: './views' });
});

module.exports = router;
