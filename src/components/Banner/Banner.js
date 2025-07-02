import React from 'react';
import styles from './Banner.module.css';
import BannerItem from './BannerItem';
import GirlImage from './GirlImage';

const Banner = () => {
  return (
    <div className={styles.bannerArea}>
      <BannerItem>バナーエリア</BannerItem>
      <BannerItem>バナーエリア</BannerItem>
      <GirlImage />
    </div>
  );
};

export default Banner;
