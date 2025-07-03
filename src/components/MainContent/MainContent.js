import React from 'react';
import styles from './MainContent.module.css';
import TitleSection from './TitleSection';
import OpeningSection from './OpeningSection';
import Section00 from './Section00';

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      <TitleSection />
      <OpeningSection />
      <Section00 />
      
      {/* ここに他のコンテンツセクションを追加 */}
    </div>
  );
};

export default MainContent;
