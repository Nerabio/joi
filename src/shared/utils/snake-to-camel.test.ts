import { snakeToCamel } from './snake-to-camel';

describe('snakeToCamel', () => {
  it('should convert snake_case to camelCase', () => {
    expect(snakeToCamel('hello_world')).toBe('helloWorld');
    expect(snakeToCamel('snake_to_camel')).toBe('snakeToCamel');
    expect(snakeToCamel('this_is_a_test')).toBe('thisIsATest');
  });

  it('should return the same string if there are no underscores', () => {
    expect(snakeToCamel('hello')).toBe('hello');
    expect(snakeToCamel('world')).toBe('world');
  });

  it('should handle empty strings', () => {
    expect(snakeToCamel('')).toBe('');
  });

  it('should handle strings with multiple underscores', () => {
    expect(snakeToCamel('multiple__underscores')).toBe('multipleUnderscores');
    expect(snakeToCamel('leading__and__trailing__')).toBe('leadingAndTrailing');
  });

  it('should handle strings with underscores at the beginning or end', () => {
    expect(snakeToCamel('_leading')).toBe('Leading');
    expect(snakeToCamel('trailing_')).toBe('trailing');
    expect(snakeToCamel('_both_ends_')).toBe('BothEnds');
  });
});
