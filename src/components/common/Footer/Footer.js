import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
import logo1 from '../../../assets/images/logo1.png';

const Footer = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    console.log('運営について がクリックされました');
    // 運営ページへの遷移処理（今後実装予定）
    // navigate('/about');
  };

  const handleLogoClick = () => {
    console.log('フッターロゴがクリックされました - ホームページに遷移');
    // ホームページに遷移
    navigate('/');
    // ページトップにスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerTitle}>
          当事者たちでつくる、不登校情報サイト
        </p>
        
        <button 
          className={styles.footerLogo}
          onClick={handleLogoClick}
          aria-label="ホームページに戻る"
        >
          <img src={logo1} alt="ロゴ" className={styles.logoImage} />
        </button>
        
        <div className={styles.footerMenu}>
          <button 
            className={styles.menuItem}
            onClick={handleAboutClick}
          >
            ・運営について　（ここにフッターメニュー）
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
