const Category = require("../models/category");

class CategoryControllers {
  async getAllCategories() {
    try {
      const categories = await Category.getAllCategories();
      return { data: categories };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new CategoryControllers();
