import { of, rejected } from 'folktale/concurrency/task';

export default function orCombinatorT(fn1, fn2) {
  const fn1Result = fn1();

  return (fn1Result) ? fn1Result : fn2();
};
