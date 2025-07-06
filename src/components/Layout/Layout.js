import React from 'react';
import styles from './Layout.module.css';
import useResponsive from '../../hooks/useResponsive';
import Navigation from '../Navigation';
import { HamburgerMenu } from '../Navigation';
import MainContent from '../MainContent/MainContent';
import Banner from '../Banner/Banner';
import Overlay from '../common/Overlay/Overlay';

const Layout = ({ children }) => {
  const { isMobile } = useResponsive();

  return (
    <>
      <div className={styles.container}>
        {!isMobile && <Navigation />}
        {children || <MainContent />}
        {!isMobile && <Banner />}
      </div>
      
      {isMobile && <HamburgerMenu />}
      <Overlay />
    </>
  );
};

export default Layout;
