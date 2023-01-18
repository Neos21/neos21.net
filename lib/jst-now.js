/** 実行環境に関わらず必ず JST で情報が取れるようにする */
const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

const jstCurrentYear  = jstNow.getFullYear();
const jstCurrentMonth = (jstNow.getMonth() + 1);  // 0～11 ではなく 1～12 で表現する
const jstCurrentDate  = jstNow.getDate();
const jstCurrentHour  = jstNow.getHours();

// ゼロパディング値
const zeroPadJstCurrentMonth = ('0' + jstCurrentMonth).slice(-2);
const zeroPadJstCurrentDate  = ('0' + jstCurrentDate ).slice(-2);
const zeroPadJstCurrentHour  = ('0' + jstCurrentHour ).slice(-2);

console.log(`JST Now : [${jstCurrentYear}-${zeroPadJstCurrentMonth}-${zeroPadJstCurrentDate} ${zeroPadJstCurrentHour}]`);

export {
  jstNow,
  jstCurrentYear,        jstCurrentMonth,        jstCurrentDate,        jstCurrentHour,
                  zeroPadJstCurrentMonth, zeroPadJstCurrentDate, zeroPadJstCurrentHour
};
