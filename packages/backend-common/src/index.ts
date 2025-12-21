export function getJwtSecret(): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
  }
  return process.env.JWT_SECRET;
}