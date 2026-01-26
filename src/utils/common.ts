import diff from 'microdiff';
import { get, set, cloneDeep } from 'lodash-es'

function isPrimitive(val: unknown): val is string | number | boolean | null | undefined {
  return val === null || (typeof val !== 'object' && typeof val !== 'function');
}

export function checkDiff(currentObj: any, originalObj: any, pathArray: string[]): boolean {
  // whole object comparison
  if (!pathArray.length) {
    return diff(currentObj, originalObj).length > 0;
  }

  const original = get(originalObj, pathArray);
  const current = get(currentObj, pathArray);

  // one exists, the other doesn't
  if (original == null || current == null) {
    return original !== current;
  }

  // primitive values (string / number / boolean)
  if (isPrimitive(original) && isPrimitive(current)) {
    return original !== current;
  }

  // arrays
  if (Array.isArray(original) && Array.isArray(current)) {
    return (
      original.length !== current.length ||
      diff(original, current).length > 0
    );
  }

  // objects
  if (typeof original === 'object' && typeof current === 'object') {
    return diff(original, current).length > 0;
  }

  // fallback: different types
  return true;
}

export function resetDiff(currentObj: any, originalObj: any, pathArray: string[]): void {
  if (!pathArray.length) return

  const original = get(originalObj, pathArray)

  if (original === undefined) return

  set(currentObj, pathArray, cloneDeep(original))
}
