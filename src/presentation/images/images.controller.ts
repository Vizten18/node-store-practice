import fs from "fs";
import path from "path";
import { Request, Response } from "express";

export class ImageController {
  constructor() {}

  getImage = async (req: Request, res: Response) => {
    const { type = "", img = "" } = req.params;

    const imagePath = path.join(__dirname, `../../../uploads/${type}/${img}`);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(imagePath);
  };
}
