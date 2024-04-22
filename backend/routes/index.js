var express = require("express");
var router = express.Router();
const oapi = require("../config/openapi");

/* GET home page. */
router.get(
  "/",
  oapi.path({
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                hello: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    res.json({
      hello: "world",
    });
  }
);

module.exports = router;
