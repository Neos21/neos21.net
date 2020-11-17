const jstNow = require('./jst-now');

/**
 * 未来日でないことを確認する
 * 
 * @param {number} year 年
 * @param {number} month 月
 * @param {number} date 日
 * @return 未来日なら `false`
 */
module.exports = function isNotFuture(year, month, date) {
  if(year > jstNow.jstCurrentYear) {
    //console.log(`  Future Year [${year}] [${jstNow.jstCurrentYear}]`);
    return false;
  }
  if(year === jstNow.jstCurrentYear && month > jstNow.jstCurrentMonth) {
    //console.log(`  Future Month [${month}] [${jstNow.jstCurrentMonth}]`);
    return false;
  }
  if(year === jstNow.jstCurrentYear && month === jstNow.jstCurrentMonth && date > jstNow.jstCurrentDate) {
    //console.log(`  Future Date [${date}] [${jstNow.jstCurrentDate}]`);
    return false;
  }
  return true;
};
