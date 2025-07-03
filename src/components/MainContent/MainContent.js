import React from 'react';
import styles from './MainContent.module.css';
import TitleSection from './TitleSection';
import OpeningSection from './OpeningSection';
import Section00 from './Section00';
import Section01 from './Section01';
import Section02 from './Section02';
import Section03 from './Section03';

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      <TitleSection />
      <OpeningSection />
      <Section00 />
      <div className={styles.noGap}>
        <Section01 />
      </div>
      <div className={styles.noGap}>
        <Section02 />
      </div>
      <div className={styles.noGap}>
        <Section03 />
      </div>
      
      {/* ここに他のコンテンツセクションを追加 */}
    </div>
  );
};

export default MainContent;
