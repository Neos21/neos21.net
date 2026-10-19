/**
 * `undefined`・`null`、または文字列化して Trim した結果が空なら `true` と判定する
 * 
 * @param {string | number | null | undefined} value 文字列として判定したい値
 * @return {boolean} `undefined`・`null`・空文字相当なら `true`
 */
export const isEmpty = value => value == null || value === '' || String(value).trim().length === 0;
