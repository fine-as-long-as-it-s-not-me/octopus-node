export function normalizeString(str: string): string {
  return str.toLowerCase().trim().replaceAll(' ', '')
}
