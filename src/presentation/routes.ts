import { Router } from "express";
import { Authroutes } from "./auth/auth.routes";
import { CategoryRoutes } from "./category/category.routes";
import { ProductsRoutes } from "./products/products.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", Authroutes.routes);
    router.use("/api/categories", CategoryRoutes.routes);
    router.use("/api/products", ProductsRoutes.routes);

    return router;
  }
}
