const codeMap = new Map<string, { code: string; expiresAt: number }>();

export function setCode(email: string, code: string, expiresAt: number) {
  codeMap.set(email, { code, expiresAt });
}

export function getCode(email: string) {
  return codeMap.get(email);
}

export function deleteCode(email: string) {
  codeMap.delete(email);
}
