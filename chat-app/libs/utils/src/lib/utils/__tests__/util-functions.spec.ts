import {
  isNullOrUndefined
} from '../util-functions';

describe('Util functions', () => {

  describe('isNullOrUndefined', () => {

    it('should return true for null or undefined', () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    it('should return false for not null or undefined', () => {
      expect(isNullOrUndefined(1)).toBe(false);
      expect(isNullOrUndefined('test')).toBe(false);
    });

    it('should return true for array with null or undefined', () => {
      expect(isNullOrUndefined([1, null, 2])).toBe(true);
    });

    it('should return false for array if every item is null or undefined', () => {
      expect(isNullOrUndefined([undefined, null], true)).toBe(true);
      expect(isNullOrUndefined([1, null, 2], true)).toBe(false);
    });

  });

});
