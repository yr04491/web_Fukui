import React from 'react';
import styles from './MainContent.module.css';
import TitleSection from './TitleSection';
import OpeningSection from './OpeningSection';
import Section00 from './Section00';
import Section01 from './Section01';
import Section02 from './Section02';
import Section03 from './Section03';
import Section04 from './Section04';
import Section05 from './Section05';
import Footer from '../../common/Footer';

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      {/* ヘッダーセクション */}
      <div className={styles.headerSection}>
        <TitleSection />
        <OpeningSection />
      </div>
      
      {/* ROADセクション群 */}
      <div className={styles.roadSections}>
        <Section00 />
        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
      </div>
      
      {/* フッター */}
      <Footer />
    </div>
  );
};

export default MainContent;
