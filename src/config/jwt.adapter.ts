import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  static async generateToken(
    payload: any,
    duration: string | number = "2h"
  ): Promise<string | null> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        JWT_SEED,
        { expiresIn: duration as jwt.SignOptions["expiresIn"] },
        (err, token) => {
          if (err) return resolve(null);
          resolve(token!);
        }
      );
    });
  }
  static validateToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded);
      });
    });
  }
}
