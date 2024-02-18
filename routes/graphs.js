const express = require('express')
const router = express.Router();
const {
    getStatistics,getPieGraph,getBarGraph,getAllGraph
} = require('../controllers/product')

router.route('/getStatistics').get(getStatistics)
router.route('/getpiegraph').get(getPieGraph)
router.route('/getbargraph').get(getBarGraph)
router.route('/getallgraph').get(getAllGraph)


module.exports = router