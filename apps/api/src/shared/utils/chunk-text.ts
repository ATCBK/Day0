export function chunkText(input: string, chunkSize = 400): string[] {
  if (!input) return [];
  const chunks: string[] = [];
  for (let i = 0; i < input.length; i += chunkSize) {
    chunks.push(input.slice(i, i + chunkSize));
  }
  return chunks;
}
