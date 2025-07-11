import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "../services/email.service";

export class AuthService {
  constructor(
    //Di email service
    private readonly emailService: EmailService
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest("Email already exists");

    try {
      const user = new UserModel(registerUserDto);

      user.password = await bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      //Confirmation email
      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(
        user.toObject()
      );

      const token = await JwtAdapter.generateToken({ id: user.id });

      if (!token)
        throw CustomError.internalServerError("Token generation failed");

      return {
        user: userEntity,
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    //findOne
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("User not found");
    //match password
    const isPasswordValid = await bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) throw CustomError.badRequest("Invalid credentials");

    const { password, ...userEntity } = UserEntity.fromObject(user.toObject());

    const token = await JwtAdapter.generateToken({ id: user.id });

    if (!token)
      throw CustomError.internalServerError("Token generation failed");

    return {
      user: userEntity,
      token: token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });

    if (!token)
      throw CustomError.internalServerError("Token generation failed");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const htmlBody = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">Email Validation</h2>
      <p style="color: #555;">Click the link below to validate your email and complete your registration:</p>
      <p style="color: #007BFF; word-wrap: break-word;">${link}</p>
    </div>
  `;
    const options = {
      to: email,
      subject: "Email Validation",
      htmlBody: htmlBody,
    };

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServerError("Email not sent");

    return true;
  };

  public async validateEmail(token: string) {
    const payload = await JwtAdapter.validateToken(token);

    if (!payload) throw CustomError.unauthorized("Invalid token");

    const { email } = payload as { email: string };

    if (!email) throw CustomError.internalServerError("Email not in token");

    const user = await UserModel.findOne({ email });

    if (!user) throw CustomError.notFound("Email not exists");

    user.emailValidated = true;

    await user.save();

    return true;
  }
}
