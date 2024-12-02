const jwt = require("jsonwebtoken");

export async function getUserId(token: string): Promise<string> {
  token = token.replace("Bearer", "").trim();
  try {
    const decoded = await jwt.decode(token);
    return decoded ? decoded["id"] : null;
  } catch (error) {
    throw new Error("Usuario no tiene un Identificador");
  }
}

export async function getRolesByToken(token: string): Promise<string> {
  token = token.replace("Bearer", "").trim();
  try {
    const decoded = await jwt.decode(token);
    return decoded ? decoded["roles"] : null;
  } catch (error) {
    throw new Error("Usuario no tiene Roles asignados");
  }
}
