import React, { useState } from 'react';
import styles from './HamburgerMenu.module.css';
import NavIcon from '../../assets/icons/NavIcon';

// --- Merged Components ---

const NavigationHeader = () => {
  return (
    <div className={styles.navHeader}>
      <div className={styles.navHeaderTitle}>当事者たちでつくる、不登校情報サイト</div>
      <div className={styles.logoContainer}>
        <div className={styles.navLogo}></div>
        <div className={styles.navHeaderSubtitle}>福井県版</div>
      </div>
    </div>
  );
};

const NavigationItem = ({ title, subItems = [] }) => {
  return (
    <div className={styles.navItem}>
      <div className={styles.navItemHeader}>
        <div className={styles.navIcon}>
          <NavIcon />
        </div>
        <div className={styles.navTitle}>{title}</div>
      </div>
      {subItems.length > 0 && (
        <div className={styles.navSubItems}>
          {subItems.map((item, index) => (
            <div key={index} className={styles.navSubItem}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main HamburgerMenu Component ---

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    {
      title: "まずどうする？",
      subItems: ["おうちの人が焦らないヒント"]
    },
    {
      title: "学校に相談",
      subItems: ["学校にある支援の種類"]
    },
    {
      title: "行政が行う公的支援",
      subItems: ["公的機関の支援の種類"]
    },
    {
      title: "まだまだある！ みんなの居場所",
      subItems: ["こどもの居場所", "保護者の居場所"]
    },
    {
      title: "中学卒業のこと",
      subItems: ["定時制高校", "通信制高校", "広域通信制サポート校"]
    },
    {
      title: "みんなで知恵を 出し合おう！",
      subItems: ["当事者の体験談", "専門家のQ&A"]
    }
  ];

  return (
    <>
      <div className={styles.hamburgerMenu} onClick={toggleMenu}>
        <div className={styles.menuIcon}></div>
        <div className={styles.menuIcon}></div>
        <div className={styles.menuIcon}></div>
      </div>

      <nav className={`${styles.navigation} ${isOpen ? styles.navigationActive : ''}`}>
        <div className={styles.navHeader}>
          <NavigationHeader />
        </div>
        
        {navigationItems.map((item, index) => (
          <div key={index} className={styles.navItem}>
            <NavigationItem
              title={item.title}
              subItems={item.subItems}
            />
          </div>
        ))}
        
        <div className={styles.navFooter}>
          運営/プロジェクトについて
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu;
