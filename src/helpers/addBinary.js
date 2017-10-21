/**
 * addBinary() - Bitwise addition.
 *               This function was pulled from https://www.codewars.com/kata/binary-addition/solutions/javascript
 *               Also, stackoverflow had quite a few code snippets that perform bitwise additions.
 *
 * @param a
 * @param b
 * @returns {string|string}
 */
export default function addBinary(a,b) {
  let res = '';
  let c = 0;

  a = a.split('');
  b = b.split('');
  while (a.length || b.length || c) {
    c += ~~a.pop() + ~~b.pop();
    res = c % 2 + res;
    c = c > 1;
  }

  return res.replace(/^0+/, '') || '0';
}
