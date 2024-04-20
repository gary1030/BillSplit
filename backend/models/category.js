const { prisma } = require("../prisma");

class Category {
  async createCategory(name) {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return category;
  }

  async getCategoryById(categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return category;
  }

  async getAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }
}

module.exports = Category;
