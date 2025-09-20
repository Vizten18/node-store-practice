import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // ID of the user
    public readonly category: string // ID of the category
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = object;

    if (!name) return ["Name is required"];
    if (!user) return ["User ID is required"];
    if (!Validators.isMongoId(user)) return ["User ID is not valid"];
    if (!category) return ["Category ID is required"];
    if (!Validators.isMongoId(category)) return ["Category ID is not valid"];

    return [
      undefined,
      new CreateProductDto(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
