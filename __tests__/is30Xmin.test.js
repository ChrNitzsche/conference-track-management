const { is30Xmin } = require('../index');

it ("empty's and null", () => {
    expect(() => is30Xmin()).toThrow();
    expect(() => is30Xmin(null)).toThrow();
    expect(() => is30Xmin(undefined)).toThrow();
    expect(() => is30Xmin('')).toThrow();
});

it ("invalid inputs", () => {
  expect(() => is30Xmin(-1)).toThrow();
  expect(() => is30Xmin(0)).toThrow();
});

if ("valid inputs, received true", () => {
  expect(is30Xmin(0)).toBeTruthy();
  expect(is30Xmin(30)).toBeTruthy();
  expect(is30Xmin(60)).toBeTruthy();
  expect(is30Xmin(90)).toBeTruthy();
  expect(is30Xmin(120)).toBeTruthy();
  expect(is30Xmin(150)).toBeTruthy();
  expect(is30Xmin(180)).toBeTruthy();
  expect(is30Xmin(210)).toBeTruthy();
  expect(is30Xmin(240)).toBeTruthy();
  expect(is30Xmin(30.0)).toBeTruthy();
});

if ("valid inputs, received false", () => {
  expect(is30Xmin(0.0)).toBeFalsy();
  expect(is30Xmin(29)).toBeFalsy();
  expect(is30Xmin(1)).toBeFalsy();
  expect(is30Xmin(3)).toBeFalsy();
  expect(is30Xmin(5)).toBeFalsy();
  expect(is30Xmin(7)).toBeFalsy();
  expect(is30Xmin(11)).toBeFalsy();
  expect(is30Xmin(13)).toBeFalsy();
  expect(is30Xmin(9999999999999999999)).toBeFalsy();
});