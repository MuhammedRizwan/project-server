export class CustomError extends Error {
    public statusCode: number;
    public message: string;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }