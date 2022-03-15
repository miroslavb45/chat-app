/**
 * Checks if the provided value(s) is/are either undefined or null.
 * If the provided value is an array, the function will check every item of the
 * array with OR condition.
 * You can turn on strict checking (AND condition) with the second parameter
 * set to true.
 * @param value
 * @param {boolean} arrayCheckWithAnd
 * @returns {boolean}
 */
export function isNullOrUndefined(value: unknown, arrayCheckWithAnd = false): boolean {
  if (Array.isArray(value)) {
    if (arrayCheckWithAnd) {
      return value.every(item => item === undefined || item === null);
    } else {
      return value.some(item => item === undefined || item === null);
    }
  }

  return value === undefined || value === null;
}
