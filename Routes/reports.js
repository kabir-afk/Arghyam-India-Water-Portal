const express = require('express');
const router = express.Router();
const {homePage,getMonthlyMean,getAnnualMean,getAnnualTotal} = require("../Controllers/reports");

router.get('/',homePage);
router.post('/annualMean',getAnnualMean);
router.post('/monthlyMean',getMonthlyMean);
router.post('/annualTotals',getAnnualTotal);

module.exports = router;