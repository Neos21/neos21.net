/**
 * デバッグログ出力する関数を作成する
 * 
 * @param {string} loggerName ロガー名・環境変数に指定するので大文字スネークケース・先頭に DEBUG_ を付与する
 * @return {function} デバッグログ出力する関数
 */
module.exports = function createLog(loggerName) {
  /**
   * デバッグログ出力する
   * 
   * @param {string} text テキスト
   */
  const log = (text) => {
    if(process.env.DEBUG || process.env['DEBUG_' + loggerName]) {
      console.log(text);
    }
  };
  return log;
};
