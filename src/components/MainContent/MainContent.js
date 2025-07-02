import React from 'react';
import styles from './MainContent.module.css';
import TitleSection from './TitleSection';
import OpeningSection from './OpeningSection';

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      <TitleSection />
      <OpeningSection />
      
      {/* ここに他のコンテンツセクションを追加 */}
    </div>
  );
};

export default MainContent;
