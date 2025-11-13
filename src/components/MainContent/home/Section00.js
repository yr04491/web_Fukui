import React from 'react';
import styles from './Section00.module.css';
import roadNumberImage from '../../../assets/icons/00_0.png';
import SectionTitle from '../../common/SectionTitle';
import ContentFrame from '../../common/ContentFrame';
import ExperienceSection from '../../common/ExperienceSection';

const Section00 = () => {
  return (
    <div className={styles.section00}>
      <SectionTitle 
        roadNumber="00" 
        title="まずどうする" 
        roadNumberImage={roadNumberImage} 
      />

      <ContentFrame
        title="＼　大丈夫です。なんとかなります。／"
        buttonElement={
          <button className={styles.projectButton}>
            <div className={styles.bookIcon}></div>
            <span>心が落ち着くかも。私たちの想いを読んでみてください</span>
          </button>
        }
      >
        <p>
          お子さんは今、自分の心を守るため、必死に戦っているところです。サボりたいが為に不登校になる子どもはほとんどいません。お子さんの心が回復できるように、周囲が慌てず、落ち着いて、子どもが安心できる家庭を維持する事を意識してください。
        </p>
      </ContentFrame>

      <ExperienceSection 
        title="みんなの体験談を見てみよう"
        tweetCardIds={[1, 2, 3]}
        moreButtonText="みんなの体験談をもっと見てみる"
      />
    </div>
  );
};

export default Section00;
