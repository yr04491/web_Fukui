import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HamburgerMenu.module.css';
import commonStyles from './NavigationCommon.module.css';
import NavigationItem from './NavigationItem';
import NavigationHeader from './NavigationHeader';
import { navigationItems, searchItems } from '../../data/navigationItems';

// --- Main HamburgerMenu Component ---

const HamburgerMenu = ({ isOpen: externalIsOpen, onToggle }) => {
  const navigate = useNavigate();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);
  const navRef = useRef(null);
  const navItemsRef = useRef(null);
  
  // 外部から状態が制御されている場合はそれを使用
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // メニュー開閉のトグル
  const toggleMenu = () => {
    const newState = !isOpen;
    
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
    
    // メニューを開いた場合は、アニメーション後に縦線の高さを計算
    if (!isOpen) {
      setTimeout(() => {
        if (navItemsRef.current) {
          setLineHeight(navItemsRef.current.offsetHeight);
        }
      }, 350); // トランジションが完了する時間 (0.3s) に少し余裕を持たせる
    }
  };
  
  // 外部からの状態変更を監視
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);
  
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

  // 画面サイズが変更されたらメニューを自動で閉じる
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        if (onToggle) {
          onToggle(false);
        } else {
          setInternalIsOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.hamburgerMenu} onClick={toggleMenu}>
        <span className={styles.menuText}>{isOpen ? 'CLOSE' : 'MENU'}</span>
        <div className={styles.menuIconContainer}>
          {isOpen ? (
            // Close X アイコン - 文字として表示
            <span className={styles.closeIconText}>×</span>
          ) : (
            // ハンバーガーアイコン
            <>
              <div className={styles.menuIcon}></div>
              <div className={styles.menuIcon}></div>
              <div className={styles.menuIcon}></div>
            </>
          )}
        </div>
      </div>

      <nav ref={navRef} className={`${styles.navigation} ${isOpen ? styles.navigationActive : ''}`}>
        {/* ナビゲーションヘッダー - 通常ナビと同じ */}
        <NavigationHeader isHamburger={true} />
        
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
              path={item.path} // 
            />
          ))}
        </div>

        {/* 探してみようセクション */}
        <div className={commonStyles.searchSection}>
          <div className={commonStyles.searchTitle}>探してみよう</div>
          <div className={commonStyles.dividerLine}></div>
          <div className={commonStyles.searchItems}>
            {searchItems.map((item, index) => (
              <div 
                key={index}
                className={commonStyles.searchItem}
                onClick={() => {
                  console.log(`「${item}」がクリックされました`);
                  if (item === '◯体験談を探す') {
                    navigate('/experiences');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // メニューを閉じる
                    if (onToggle) {
                      onToggle(false);
                    } else {
                      setInternalIsOpen(false);
                    }
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        
        <div 
          className={commonStyles.navFooter}
          onClick={() => console.log("プロジェクトと私たちについてがクリックされました")}
          style={{ cursor: 'pointer' }}
        >
          プロジェクトと私たちについて
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu;