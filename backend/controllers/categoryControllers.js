const Category = require("../models/category");

class CategoryControllers {
  constructor() {
    this.categoryModel = new Category();
  }
  async getAllCategories() {
    try {
      const categories = await this.categoryModel.getAllCategories();
      return { data: categories };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = CategoryControllers;
