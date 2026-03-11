export function cn(...classes: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const result: string[] = []
  for (const cls of classes) {
    if (!cls) continue
    if (typeof cls === 'string') result.push(cls)
    else if (typeof cls === 'object') {
      for (const [key, val] of Object.entries(cls)) {
        if (val) result.push(key)
      }
    }
  }
  return result.join(' ')
}
