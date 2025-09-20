import { envs } from "../../config";
import { CategoryModel, ProductModel, UserModel } from "../mongo";

import { MongoDatabase } from "../mongo/mongo.database";
import { seedData } from "./data";

(async () => {
  MongoDatabase.connect({
    dbName: envs.DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();

  await MongoDatabase.disconnect();
})();

const randomBetween0AndX = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  // Delete all
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  // Create users
  const users = await UserModel.insertMany(seedData.users);

  // Insert categories
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[randomBetween0AndX(seedData.users.length - 1)].id,
    }))
  );

  // Create products
  const products = await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      user: users[randomBetween0AndX(seedData.users.length - 1)].id,
      category:
        categories[randomBetween0AndX(seedData.categories.length - 1)].id,
    }))
  );

  console.log("Seeding completed");
}
