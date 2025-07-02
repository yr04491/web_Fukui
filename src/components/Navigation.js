import React from 'react';
import styles from '../styles/Main.module.css';
import NavIcon from '../assets/icons/NavIcon';

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
    <>
      {/* ナビゲーション内のコンテンツ */}
      <div className={styles.navHeader}>
        <p className={styles.navHeaderTitle}>当事者たちでつくる、不登校情報サイト</p>
        <div className={styles.navLogo}></div>
        <div className={styles.navHeaderSubtitle}>福井県版</div>
      </div>
      
      {/* ナビゲーション項目 */}
      {navItems.map((item, index) => (
        <div key={index} className={styles.navItem}>
          <div className={styles.navItemHeader}>
            <div className={styles.navIcon}>
              <NavIcon index={index} />
            </div>
            <div className={styles.navTitle}>{item.title}</div>
          </div>
          <div className={styles.navSubItems}>
            {item.subItems.map((subItem, subIndex) => (
              <div key={subIndex} className={styles.navSubItem}>{subItem}</div>
            ))}
          </div>
        </div>
      ))}
      
      <div className={styles.navFooter}>運営/プロジェクトについて</div>
    </>
  );
};

export default Navigation;
