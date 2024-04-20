var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const CurrencyControllers = require("../controllers/currencyControllers");

router.use(authentication);

/* GET all currencies */
router.get("/", async function (req, res, next) {
  try {
    const currencyControllers = new CurrencyControllers();
    const currencies = await currencyControllers.getAllCurrencies();
    res.send(currencies);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
