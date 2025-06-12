export function getRandomMessage(items: string[] = []): string {
  return items[Math.floor(Math.random() * items.length)];
}
