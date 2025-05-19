export interface JwtAdapter {
  createToken(
    payload: {
    userId: string;
    },
    type: "access" | "refresh",
    secret: string,
    expiresIn: string
  ): string;
  verify(token: string, secret: string): any;
}