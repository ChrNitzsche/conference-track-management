const { getDuration } = require('../index');

it ("empty's and null", () => {
    expect(getDuration()).toBeNull();
    expect(getDuration(null)).toBeNull();
    expect(getDuration('')).toBeNull();
  });
  
it ("valid values", () => {
  expect(getDuration('#1 123min')).toEqual(123);
  expect(getDuration('#2 1min')).toEqual(1);
  expect(getDuration('#3 99999999999999999999min')).toEqual(99999999999999999999);
});
  
it ("invalid values", () => {
  expect(getDuration('0min')).toBeNull();
  expect(getDuration('#2 0a9min')).toBeNull();
  expect(getDuration('#3 0min')).toBeNull();
  expect(getDuration('#4 -4min')).toBeNull();
  expect(getDuration('#5 -0min')).toBeNull();
  expect(getDuration('#6 -999999999999999999999999min')).toBeNull();
  expect(getDuration('#7 *min')).toBeNull();
});