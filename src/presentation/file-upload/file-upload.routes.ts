import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const fileUploadService = new FileUploadService();

    const controller = new FileUploadController(fileUploadService);

    //api/upload/<user|category|product>/
    //api/single/<user|category|product>/
    //api/multiple/<user|category|product>/

    router.use([
      FileUploadMiddleware.containFiles,
      TypeMiddleware.validTypes(["users", "products", "categories"]),
    ]);

    router.post("/single/:type", controller.uploadFile);
    router.post("/multiple/:type", controller.uploadMultiple);

    return router;
  }
}
