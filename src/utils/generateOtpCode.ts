import { IGenerateOtpCode } from '../interfaces/Authentication';

export class GenerateOTP implements IGenerateOtpCode {
  generateOtpCode(): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString().padStart(6, '0');
  }
}
