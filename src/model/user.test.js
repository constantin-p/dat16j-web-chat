const User = require('./user.js');

const testStr = 'test_string';

test('should generate hash', () => {
	const user = new User();

  user.password = user.generateHash(testStr);
  expect(user.password).not.toBe(testStr);
});

test('should validate hash', () => {
	const user = new User();

  user.password = user.generateHash(testStr);
  expect(user.password).not.toBe(testStr);

  expect(user.validPassword(testStr)).toBeTruthy();
});