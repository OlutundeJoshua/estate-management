export class LoginDto {
  emailAddress: string;
  password: string;
}

export class ForgotPasswordDto {
  emailAddress: string;
}

export class ResetPasswordDto {
  emailAddress: string;
  newPassword: string;
  resetToken: string;
}
