const express = require('express')
const router = express.Router();
const {initializeDatabase} = require('../controllers/product')

router.route('/').get(initializeDatabase)

module.exports = router