const codes = new Map("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c, n) => [c, n]));

export default (code) => {
  if (codes.has(code)) {
    return codes.get(code);
  }
  const base = 36;
  const codeLength = code.length;
  let num = 0;
  let places = 1;
  let pow = 1;
  let range = base;
  while (places < codeLength) {
    num += range;
    places++;
    range *= base;
  }
  for (let i = codeLength - 1; i >= 0; i--) {
    let d = code.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    num += d * pow;
    pow *= base;
  }
  codes.set(code, num);
  return num;
};
