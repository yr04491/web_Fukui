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
        title="＼　大丈夫です。なんとかなります。／まずは慌てず落ち着きましょう。"
        buttonElement={
          <button className={styles.projectButton}>
            <div className={styles.bookIcon}></div>
            <span>心が落ち着くかも。私たちの想いを読んでみてください</span>
          </button>
        }
      >
        <p>
          お子さんの急な不登校宣言。驚きますよね。<br />
          どうしたの？何かあったの？いじめ！？聞きたくなる気持ちはわかります。ただ、お子さんは今、傷ついた自分の心を守るため、必死に戦っています。お子さんの心が回復できるように、まずはお父さん、お母さんが、慌てず落ち着いて、子どもが安心できる家庭を維持する事を意識してください。
        </p>
      </ContentFrame>

      <ExperienceSection 
        title="みんなの体験談を見てみよう"
        tweetCardIds={[1, 2]}
        moreButtonText="不登校になったきっかけの体験談を見る"
      />
    </div>
  );
};

export default Section00;
