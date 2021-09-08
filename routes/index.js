const router = require('express').Router();

const authRoutes = require('./auth');
const homeRoutes = require('./home');

router.use('', homeRoutes);
router.use('/auth', authRoutes);

module.exports = router;
