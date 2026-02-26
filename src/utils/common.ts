import diff from 'microdiff';
import { get, set, cloneDeep } from 'lodash-es'
import type { Course } from '@/types/course';
import type { Programme, ProgrammeStructure } from '@/types/programme';

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

// export function updateMapping(object: Course | Programme, pathArray: string[], itemIndex: number, isChecked: boolean): void {
//   const currentList = get(object, pathArray);

//   console.log(currentList)

//   if (currentList === undefined) return;

//   if (Array.isArray(currentList)) {
//     if (isChecked) {
//       if (!currentList.includes(itemIndex)) {
//         currentList.push(itemIndex);
//       }
//     } else {
//       set(object, pathArray, currentList.filter(id => id !== itemIndex));
//     }
//   } else {
//     set(object, pathArray, isChecked ? itemIndex : undefined);
//   }
// };
//
type IndexableObject = Record<string, unknown>;

export function updateMapping(
  object: Course | Programme,
  pathArray: readonly string[],
  itemIndex: number,
  isChecked: boolean | 'indeterminate'
): void {
  if (isChecked === 'indeterminate') return;

  const currentValue = get(object, pathArray) as unknown;

  if (currentValue === undefined || currentValue === null) return;

  // 🔹 Array case → mutate in place
  if (Array.isArray(currentValue)) {
    const list = currentValue as number[];
    const index = list.indexOf(itemIndex);

    if (isChecked) {
      if (index === -1) {
        list.push(itemIndex);
      }
    } else {
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
    return;
  }

  // 🔹 Non-array case → mutate parent object
  const parentPath = pathArray.slice(0, -1);
  const key = pathArray[pathArray.length - 1];

  if (!key) return;

  const parent = (parentPath.length
    ? get(object, parentPath)
    : object) as IndexableObject | null | undefined;

  if (parent && typeof parent === 'object') {
    if (isChecked) {
      parent[key] = itemIndex;
    } else { }
  }
}

export function formatRevision(): string {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}.${month}.${day}.${hour}.${minute}.${second}`;
}

interface FormatIdInput {
  code: string;
  revision: string;
}

export function formatId<T extends FormatIdInput>(item: T): string {
  return `${item.code}-${item.revision}`
}

interface FormatStructureIdInput {
  programme: string;
  label: string;
  revision: string;
}

export function formatStructureId<T extends FormatStructureIdInput>(item: T): string {
  return `${item.programme}-${item.label}-${item.revision}`
}

export function zeroPad(num: number, length = 2): string {
  return String(num).padStart(length, '0')
}
