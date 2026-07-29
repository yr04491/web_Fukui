/**
 * 複数選択（チェックボックス）の回答を配列に分解する
 *
 * GAS側から「A, B」のようなカンマ区切りの文字列で届くため、
 * 表示のときは項目ごとに分けて扱えるようにします。
 * 空の項目（末尾のカンマなど）は取り除きます。
 *
 * @param {string} value - カンマ区切りの文字列
 * @returns {Array<string>} - 選択された項目の配列
 */
export const splitMultiSelect = (value) => {
  if (!value) return [];

  return String(value)
    .split(/[,、，]/)
    .map((item) => item.trim())
    .filter((item) => item);
};
