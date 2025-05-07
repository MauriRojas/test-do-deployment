export class AuthError extends Error {
  constructor(message: string = "Authentication error") {
    super(message);
    this.name = "AuthError";
  }
}

export class ApiError extends Error {
  public status: number;

  constructor(message: string = "API error", status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
