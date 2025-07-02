import React from 'react';
import styles from '../../styles/Main.module.css';
import NavIcon from '../../assets/icons/NavIcon';

// NavigationHeader コンポーネント（内部で使用）
export const NavigationHeader = () => {
  return (
    <div className={styles.navHeader}>
      <p className={styles.navHeaderTitle}>当事者たちでつくる、不登校情報サイト</p>
      <div className={styles.navLogo}></div>
      <div className={styles.navHeaderSubtitle}>福井県版</div>
    </div>
  );
};

// NavigationItem コンポーネント（内部で使用）
export const NavigationItem = ({ title, subItems = [], index }) => {
  return (
    <div className={styles.navItem}>
      <div className={styles.navItemHeader}>
        <div className={styles.navIcon}>
          <NavIcon index={index} />
        </div>
        <div className={styles.navTitle}>{title}</div>
      </div>
      {subItems.length > 0 && (
        <div className={styles.navSubItems}>
          {subItems.map((item, idx) => (
            <div key={idx} className={styles.navSubItem}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// メインの Navigation コンポーネント
const Navigation = () => {
  // ナビゲーション項目
  const navItems = [
    {
      title: 'まずどうする？',
      subItems: ['おうちの人が焦らないヒント']
    },
    {
      title: '学校に相談',
      subItems: ['学校にある支援の種類']
    },
    {
      title: '行政が行う公的支援',
      subItems: ['公的機関の支援の種類']
    },
    {
      title: 'まだまだある！ みんなの居場所',
      subItems: ['こどもの居場所', '保護者の居場所']
    },
    {
      title: '中学卒業のこと',
      subItems: ['定時制高校', '通信制高校', '広域通信制サポート校']
    },
    {
      title: 'みんなで知恵を 出し合おう！',
      subItems: ['当事者の体験談', '専門家のQ&A']
    }
  ];

  return (
    <div className={styles.navigation}>
      {/* ナビゲーションヘッダー */}
      <NavigationHeader />
      
      {/* ナビゲーション項目 */}
      {navItems.map((item, index) => (
        <NavigationItem 
          key={index} 
          title={item.title} 
          subItems={item.subItems} 
          index={index}
        />
      ))}
      
      <div className={styles.navFooter}>運営/プロジェクトについて</div>
    </div>
  );
};

export default Navigation;
