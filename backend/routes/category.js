var express = require("express");
var router = express.Router();
const oapi = require("../config/openapi");
var authentication = require("../middlewares/auth");

const CategoryControllers = require("../controllers/categoryControllers");

router.use(authentication);

/* GET all categories */
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
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }),
  async function (req, res, next) {
    try {
      const categoryControllers = new CategoryControllers();
      const categories = await categoryControllers.getAllCategories();
      res.send(categories);
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  }
);

module.exports = router;
