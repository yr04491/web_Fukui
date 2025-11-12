import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Main.module.css';
import hamburgerStyles from './HamburgerMenu.module.css';
import commonStyles from './NavigationCommon.module.css';
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
  const navigate = useNavigate();
  
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
    
    // 「まずどうする？」の場合は専用ページに遷移
    if (title === "まずどうする？") {
      navigate('/section00');
    }
    // 「学校に相談」の場合は01ページに遷移
    else if (title === "学校に相談") {
      navigate('/section01');
    }
    // 「行政が行う公的支援」の場合は02ページに遷移
    else if (title === "行政が行う公的支援") {
      navigate('/section02');
    }
    // 他のページも今後追加予定
  };
  
  const handleSubItemClick = (subItem) => (e) => {
    e.stopPropagation(); // 親要素へのイベント伝播を停止
    console.log(`サブ項目 "${subItem}" がクリックされました`);
    // 実際のページ遷移処理
    // navigate(`/subcategory/${encodeURIComponent(subItem)}`);
  };

  return (
    <div className={commonStyles.navItem} onClick={handleItemClick} style={{ cursor: 'pointer' }}>
      <div className={commonStyles.navItemHeader}>
        <div className={commonStyles.navIcon}>
          <NavIcon index={index} />
        </div>
        <div className={commonStyles.navTitle}>{formattedTitle}</div>
      </div>
      {subItems.length > 0 && (
        <div className={commonStyles.navSubItems}>
          {subItems.map((item, idx) => (
            <div 
              key={idx} 
              className={commonStyles.navSubItem} 
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
