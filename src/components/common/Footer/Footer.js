// src/components/common/Footer/Footer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
// 1. logo1 から Footer_logo.png にインポートを変更
import footerLogo from '../../../assets/icons/Footer_logo.png'; 

const Footer = () => {
  const navigate = useNavigate();

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

  // 2. リスト項目用のクリックハンドラを追加
  const handleListClick = (item) => {
    console.log(`${item} がクリックされました`);
    // 体験談を探すページに遷移
    if (item === '体験談を探す') {
      navigate('/experiences');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 居場所を探すページに遷移
    if (item === 'みんなの居場所を探す') {
      navigate('/places');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 卒業後の進路を探すページに遷移
    if (item === '中学卒業後の進路を探す') {
      navigate('/paths');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 体験談の投稿ページに遷移
    if (item === '体験談の投稿') {
      navigate('/experiences/post');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <button 
          className={styles.footerLogo}
          onClick={handleLogoClick}
          aria-label="ホームページに戻る"
        >
          {/* 3. src と alt を変更 */}
          <img src={footerLogo} alt="ぼくらのみち 福井県版" className={styles.logoImage} />
        </button>
        
        {/* 4. 既存の .footerMenu を削除し、新しい .footerList に変更 */}
        <ul className={styles.footerList}>
          <li onClick={() => handleListClick('体験談を探す')}>体験談を探す</li>
          <li onClick={() => handleListClick('体験談の投稿')}>体験談を投稿する</li>
          <li onClick={() => handleListClick('みんなの居場所を探す')}>居場所を探す</li>
          <li onClick={() => handleListClick('中学卒業後の進路を探す')}>卒業後の進路を探す</li>
          <li onClick={() => handleListClick('学校・行政・医療情報の一覧')}>学校・行政・医療情報の一覧</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;