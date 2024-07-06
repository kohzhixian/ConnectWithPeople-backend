export class HttpError extends Error {
  statusCode: number;
  status: string;
  isOperationalError: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // checks whether it is an operational or programming error
    this.isOperationalError = true;
  }
}
