import React from 'react';
import styles from './Section01.module.css';
import vectorRB from '../../../assets/images/vectorRB.png';
import roadNumberImage from '../../../assets/icons/01_0.png';
import SectionTitle from '../../common/SectionTitle';
import ContentFrame from '../../common/ContentFrame';
import ExperienceSection from '../../common/ExperienceSection';


const Section01 = () => {
  return (
    <div className={styles.section01}>
      <SectionTitle 
        roadNumber="01" 
        title="学校に相談" 
        roadNumberImage={roadNumberImage} 
      />

      <ContentFrame
        title="学校にはいろんなサポートがあります"
        buttonElement={
          <button className={styles.projectButton}>
            <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
            <span>親側から積極的に支援を求めて下さい。サポートについて詳しく紹介しています。</span>
          </button>
        }
      >
        <div className={styles.contentList}>
          <p>◯スクールカウンセラー紹介</p>
          <p>◯校内サポートルーム</p>
          <p>◯ライフパートナー制度 など</p>
        </div>
      </ContentFrame>

      <ExperienceSection 
        tag="学校もみんなのペースで活用！"
        title="みんなの学校活用術"
        tweetCardIds={[3, 4, 5]}
        moreButtonText="みんなの学校活用術をもっと見てみる"
      />
    </div>
  );
};

export default Section01;
