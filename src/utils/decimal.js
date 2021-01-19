import Decimal from 'decimal.js';


// 返回小数位后几位 截取
// number 数值
// p 位数
export function toFixed(number, pp) {
  let num = isNaN(number) || !number ? 0 : number;
  let p = isNaN(pp) || !pp ? 0 : pp;
  num = toFull(num);
  var n = (num + '').split('.'); // eslint-disable-line
  var x = n.length > 1 ? n[1] : ''; // eslint-disable-line
  if (x.length > p) {
    // eslint-disable-line
    x = x.substr(0, p); // eslint-disable-line
  } else {
    // eslint-disable-line
    x += Array(p - x.length + 1).join('0'); // eslint-disable-line
  } // eslint-disable-line
  return n[0] + (x == '' ? '' : '.' + x); // eslint-disable-line
}

// 科学计数法转数值 - 处理 1e-7 这类精度问题
export function toFull(num) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  // 处理不需要转换的数字
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num)
    .toFixed(18)
    .replace(/\.?0+$/, '');
}

/*
 ** 加法函数，用来得到精确的加法结果
 ** 返回值：arg1 + arg2的精确结果 Number 型
 */
export function decadd(arg1, arg2) {
  const num = Decimal(arg1).add(new Decimal(arg2));
  return num.toFixed();
}

/*
 ** 减法函数，用来得到精确的减法结果
 ** 返回值：arg1 - arg2的精确结果 Number 型
 */
export function decsub(arg1, arg2) {
  const num = new Decimal(arg1).sub(new Decimal(arg2));
  return num.toFixed();
}

/*
 ** 乘法函数，用来得到精确的乘法结果
 ** 返回值：arg1 * arg2的精确结果 Number 型
 */
export function decmul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new Decimal(arg1).mul(new Decimal(arg2));
  return num.toFixed();
}

/*
 ** 除法函数，用来得到精确的除法结果
 ** 返回值：arg1 / arg2的精确结果 Number 型
 */
export function decdiv(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new Decimal(arg1).div(new Decimal(arg2));
  return num.toFixed();
}

// 将科学计数法转换为小数
export function toNonExponential(num) {
  if (num === null) {
    return 0;
  }
  if (isNaN(num)) {
    return 0;
  }
  const fnum = new Decimal(num);
  return fnum.toFixed();
}




