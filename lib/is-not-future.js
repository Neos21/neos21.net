import { jstCurrentYear, jstCurrentMonth, jstCurrentDate } from './jst-now.js';

/**
 * 未来日でないことを確認する
 * 
 * @param {number} year 年
 * @param {number} month 月 (1～12 で渡す)
 * @param {number} date 日
 * @return 未来日なら `false`
 */
export const isNotFuture = (year, month, date) => {
  if(year > jstCurrentYear) return false;
  if(year === jstCurrentYear && month > jstCurrentMonth) return false;
  if(year === jstCurrentYear && month === jstCurrentMonth && date > jstCurrentDate) return false;
  return true;
};
