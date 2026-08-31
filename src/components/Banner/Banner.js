import React from 'react';
import styles from './Banner.module.css';
import BannerItem from './BannerItem';
import GirlImage from './GirlImage';
import bannerImage from '../../assets/images/banner.png';

const Banner = () => {
  return (
    <div className={styles.bannerArea}>
      <BannerItem>
        <a
          href="https://www.fukui-c.ed.jp/~fec/kyoikusodan/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={bannerImage} alt="福井県教育総合研究所 教育相談ページ" className={styles.bannerImage} />
        </a>
      </BannerItem>
      <GirlImage />
    </div>
  );
};

export default Banner;
