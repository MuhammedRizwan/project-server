export class GenerateOtp {
    private otpLength: number;
  
    constructor(otpLength: number = 4) {
      this.otpLength = otpLength;
    }
  
    public setLength(length: number): void {
      this.otpLength = length;
    }
  
    public generate(): string {
      const digits = '0123456789';
      let otp = '';
      for (let i = 0; i < this.otpLength; i++) {
        otp += digits.charAt(Math.floor(Math.random() * digits.length));
      }
      return otp;
    }
  }