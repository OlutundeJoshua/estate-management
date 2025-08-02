import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import {
  customErrorResponseWithCode,
  customSuccessResponseWithCode,
} from '../models/lib/response.model';
import * as jwt from 'jsonwebtoken';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'supersecretkey';
  private readonly jwtExpiresIn = '30m';
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const userEntity = await this.usersService.findUserEntityByEmail(loginDto.emailAddress);
    if (!userEntity) {
      return customErrorResponseWithCode('Invalid credentials');
    }
    const isMatch = await this.usersService.verifyPassword(loginDto.password, userEntity.password);
    if (!isMatch) {
      return customErrorResponseWithCode('Invalid credentials');
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userEntity.userId,
        emailAddress: userEntity.emailAddress,
        username: userEntity.username,
        type: userEntity.type,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn },
    );
    return customSuccessResponseWithCode('Login successful', {
      userId: userEntity.userId,
      emailAddress: userEntity.emailAddress,
      token,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const userEntity = await this.usersService.findUserEntityByEmail(
      forgotPasswordDto.emailAddress,
    );
    if (!userEntity) {
      return customErrorResponseWithCode('User not found');
    }
    // Generate a password reset token (JWT)
    const resetToken = jwt.sign(
      { emailAddress: forgotPasswordDto.emailAddress, action: 'reset-password' },
      this.jwtSecret,
      { expiresIn: '15m' }, // Token valid for 15 minutes
    );
    // Save the token and expiry to the user entity
    userEntity.resetToken = resetToken;
    userEntity.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    await this.usersService.saveUserEntity(userEntity);
    // Send the reset email
    // await this.mailService.sendMail({
    //   to: forgotPasswordDto.emailAddress,
    //   subject: 'Password Reset',
    //   text: `Use this link to reset your password: https://localhost/reset-password?token=${resetToken}`,
    // });
    console.log('link', `https://localhost/reset-password?token=${resetToken}`);
    return customSuccessResponseWithCode('Reset token generated', { resetToken });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Validate the reset token
    try {
      const decoded: any = jwt.verify(resetPasswordDto.resetToken, this.jwtSecret);
      if (
        decoded.emailAddress !== resetPasswordDto.emailAddress ||
        decoded.action !== 'reset-password'
      ) {
        return customErrorResponseWithCode('Invalid or expired reset token');
      }
    } catch (err) {
      console.error('JWT verification error:', err);
      return customErrorResponseWithCode('Invalid or expired reset token');
    }
    const userEntity = await this.usersService.findUserEntityByEmail(resetPasswordDto.emailAddress);
    if (!userEntity) {
      return customErrorResponseWithCode('User not found');
    }
    userEntity.password = await this.usersService.hashPassword(resetPasswordDto.newPassword);
    await this.usersService.saveUserEntity(userEntity);
    return customSuccessResponseWithCode('Password reset successful', null);
  }
}
