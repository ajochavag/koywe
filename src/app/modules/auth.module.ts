import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { UserRegister } from "src/context/auth/application/UserRegister";
import { UserModule } from "src/context/auth/infrastructure/user.module";
import { AuthFacade } from "src/context/auth/application/AuthFacade";
import { UserAuthenticator } from "src/context/auth/application/UserAuthenticator";
import { JwtModule } from "@nestjs/jwt";
import config from "../config";
import { JwtStrategy } from "../middlewares/jwt/JwtStrategy";


@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.ACCESS_TOKEN.JWT_SECRET,
      signOptions: { expiresIn: config.ACCESS_TOKEN.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthFacade, UserRegister, UserAuthenticator, JwtStrategy],
})
export class AuthModule { }
