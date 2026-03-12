export function isEmpty(obj: any): boolean {
  return obj === null || obj === undefined || Object.keys(obj).length === 0;
}

export function omit(obj: Record<string, any>, keys: string[]): Record<string, any> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function pick(obj: Record<string, any>, keys: string[]): Record<string, any> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Record<string, any>);
}