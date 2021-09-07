const router = require('express').Router();

const userRoutes = require('./user');
const testRoutes = require('./test');

router.use('', testRoutes);
router.use('/auth', userRoutes);

module.exports = router;
