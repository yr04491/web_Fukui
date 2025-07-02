import React from 'react';
import styles from '../../styles/Main.module.css';
import hamburgerStyles from './HamburgerMenu.module.css';
import NavIcon from '../../assets/icons/NavIcon';

/**
 * 共通NavigationItemコンポーネント
 * 通常ナビゲーション（改行あり）とハンバーガーメニュー（改行なし）の両方に対応
 * 
 * @param {string} title - ナビゲーション項目のタイトル
 * @param {Array} subItems - サブ項目の配列
 * @param {number} index - ナビゲーション項目のインデックス
 * @param {boolean} isHamburger - ハンバーガーメニュー内で使用されるかどうか
 */
const NavigationItem = ({ title, subItems = [], index, isHamburger = false }) => {
  // ハンバーガーメニューかどうかでスタイルを切り替え
  const itemStyles = isHamburger ? hamburgerStyles : styles;
  
  // タイトルの処理（ハンバーガーメニューでは改行なし、通常ナビでは改行あり）
  const formattedTitle = isHamburger
    ? title.replace(/\\n/g, ' ').replace(/\n/g, ' ') // ハンバーガーメニューでは改行文字をスペースに置換
    : title
        .replace(/\\n/g, '\n') // 文字列"\n"を実際の改行文字に変換
        .split('\n')           // 改行文字で分割
        .map((line, i, arr) => (
          <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ));
  
  // クリックハンドラ
  const handleItemClick = () => {
    console.log(`ナビゲーション項目 "${title}" がクリックされました`);
    // 実際のページ遷移処理
    // window.location.href = `/category/${index + 1}`;
  };
  
  const handleSubItemClick = (subItem) => (e) => {
    e.stopPropagation(); // 親要素へのイベント伝播を停止
    console.log(`サブ項目 "${subItem}" がクリックされました`);
    // 実際のページ遷移処理
    // window.location.href = `/subcategory/${encodeURIComponent(subItem)}`;
  };

  return (
    <div className={itemStyles.navItem} onClick={handleItemClick} style={{ cursor: 'pointer' }}>
      <div className={itemStyles.navItemHeader}>
        <div className={itemStyles.navIcon}>
          <NavIcon index={index} />
        </div>
        <div className={itemStyles.navTitle}>{formattedTitle}</div>
      </div>
      {subItems.length > 0 && (
        <div className={itemStyles.navSubItems}>
          {subItems.map((item, idx) => (
            <div 
              key={idx} 
              className={itemStyles.navSubItem} 
              onClick={handleSubItemClick(item)}
              style={{ cursor: 'pointer' }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;
