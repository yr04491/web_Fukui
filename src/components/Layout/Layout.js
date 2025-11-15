import React, { useState } from 'react';
import styles from './Layout.module.css';
import useResponsive from '../../hooks/useResponsive';
import Navigation from '../Navigation';
import { HamburgerMenu } from '../Navigation';
import { MainContent } from '../MainContent';
import Banner from '../Banner/Banner';
import Overlay from '../common/Overlay/Overlay';

const Layout = ({ children }) => {
  const { isMobile } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        {!isMobile && <Navigation />}
        {!isMobile && <Banner />}
        {children || <MainContent />}
      </div>
      
      {/* ハンバーガーメニューを常に表示（モバイル時のみ可視） */}
      <HamburgerMenu isOpen={isMenuOpen} onToggle={handleMenuToggle} />
      <Overlay isVisible={isMenuOpen} onClick={handleOverlayClick} />
    </>
  );
};

export default Layout;
