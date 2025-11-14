import React from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './NavigationCommon.module.css';
import NavIcon from '../../assets/icons/NavIcon';

/**
 * 共通NavigationItemコンポーネント
 * * @param {string} title - タイトル
 * @param {Array} subItems - サブ項目
 * @param {number} index - インデックス
 * @param {boolean} isHamburger - ハンバーガーメニューか
 * @param {string} path - (追加) 遷移先のパス
 */
const NavigationItem = ({ title, subItems = [], index, isHamburger = false, path }) => {
  const navigate = useNavigate();
  
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
  
  // クリックハンドラ (
  const handleItemClick = () => {
    // path が props として渡されていれば、そのパスに遷移する
    if (path) {
      console.log(`ナビゲーション項目 "${title.replace(/\\n|\n/g, ' ')}" がクリックされました -> ${path} へ遷移`);
      navigate(path);
    } else {
      console.log(`ナビゲーション項目 "${title.replace(/\\n|\n/g, ' ')}" がクリックされました (遷移パスなし)`);
    }
    
    // 以前の if...else if ブロックはすべて不要になります
  };

  return (
    <div className={commonStyles.navItem} onClick={handleItemClick}>
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