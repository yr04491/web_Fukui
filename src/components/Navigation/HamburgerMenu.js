import React, { useState, useEffect, useRef } from 'react';
import styles from './HamburgerMenu.module.css';
import NavigationHeader from './NavigationHeader';
import NavigationItem from './NavigationItem';

// --- Main HamburgerMenu Component ---

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);
  const navRef = useRef(null);
  const navItemsRef = useRef(null);
  
  // メニュー開閉のトグル
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    
    // メニューを開いた場合は、アニメーション後に縦線の高さを計算
    if (!isOpen) {
      setTimeout(() => {
        if (navItemsRef.current) {
          setLineHeight(navItemsRef.current.offsetHeight);
        }
      }, 350); // トランジションが完了する時間 (0.3s) に少し余裕を持たせる
    }
  };
  
  // 縦線の高さを動的に計算
  useEffect(() => {
    if (isOpen && navRef.current && navItemsRef.current) {
      // リサイズイベントでも計算を更新
      const calculateLineHeight = () => {
        // ナビゲーション項目の高さを取得
        const navItemsHeight = navItemsRef.current.offsetHeight;
        // 縦線の高さをステート変数に設定
        setLineHeight(navItemsHeight);
      };
      
      // メニューが開いてから少し待って高さを計算（トランジション完了後）
      const timer = setTimeout(calculateLineHeight, 350);
      
      // リサイズイベントでも高さを再計算
      window.addEventListener('resize', calculateLineHeight);
      
      return () => {
        window.removeEventListener('resize', calculateLineHeight);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

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
      title: "まだまだある！\nみんなの居場所",
      subItems: ["こどもの居場所", "保護者の居場所"]
    },
    {
      title: "中学卒業のこと",
      subItems: ["定時制高校", "通信制高校", "広域通信制サポート校"]
    },
    {
      title: "みんなで知恵を出し合おう！",
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

      <nav ref={navRef} className={`${styles.navigation} ${isOpen ? styles.navigationActive : ''}`}>
        <NavigationHeader isHamburger={true} />
        
        {/* ロゴと「まずどうする？」の間にスペースを追加 */}
        <div style={{ marginTop: '50px' }}></div>
        
        {/* ナビゲーション項目を囲むコンテナ - 高さ計測用 */}
        <div ref={navItemsRef} className={styles.navItemsContainer}>
          {/* 縦線を実際のDOMノードとして追加 */}
          <div className={styles.verticalLine} style={{ height: `${lineHeight}px` }} />
          
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={index}
              title={item.title}
              subItems={item.subItems}
              index={index}
              isHamburger={true}
            />
          ))}
        </div>
        
        <div 
          className={styles.navFooter}
          onClick={() => console.log("運営/プロジェクトについてがクリックされました")}
          style={{ cursor: 'pointer' }}
        >
          運営/プロジェクトについて
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu;
