const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => res.sendFile('login.html', { root: './views' }));
router.get('/register', (req, res) => res.sendFile('register.html', { root: './views' }));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.send('Usuário já existe');

    await User.create({ username, password });
    res.redirect('/auth/login');
  } catch (err) {
    res.status(500).send('Erro ao registrar');
  }
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login'
  })
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
