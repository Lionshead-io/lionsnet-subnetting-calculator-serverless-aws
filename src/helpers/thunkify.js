export default function thunkify(fn, ...args) {
  return () => {
    return fn(...args);
  }
};
