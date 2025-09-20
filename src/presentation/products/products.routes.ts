import { Router } from "express";
import { ProductService } from "./product.service";
import { ProductController } from "./products.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();

    const controller = new ProductController(productService);

    router.get("/", controller.getProducts);

    router.post("/", [AuthMiddleware.validateJWT], controller.createProduct);

    return router;
  }
}
