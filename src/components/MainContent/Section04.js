import React from 'react';
import styles from './Section04.module.css';
import dotlineImage from '../../assets/images/dotline.png';
import vector0 from '../../assets/icons/vector0.png';
import vector4 from '../../assets/icons/vector4.png';
import PlaceCard from '../common/PlaceCard/PlaceCard';

const Section04 = () => {
    return (
        <div className={styles.section04}>
            <div className={styles.titleWrapper}>
                <div className={styles.logoContainer}>
                    <span className={styles.roadText}>ROAD</span>
                    <img src={vector0} alt="0" className={styles.logoChar} />
                    <img src={vector4} alt="4" className={styles.logoChar} />
                </div>
                <h1 className={styles.mainTitle}>中学卒業後のこと</h1>
                <div className={styles.dotline} style={{ backgroundImage: `url(${dotlineImage})` }}></div>
            </div>

            {/* 学校・フリースクール紹介セクション */}
            <div className={styles.placeSection}>
                <div className={styles.placeHeader}>
                    <span className={styles.placeTag}>選択はいろいろあります</span>
                    <h3 className={styles.placeTitle}>学校・フリースクール紹介</h3>
                </div>
                <div className={styles.placeCardArea}>
                    {/* カードID指定でプレースカードを表示 */}
                    <PlaceCard cardId={7} />
                    <PlaceCard cardId={7} />
                    <PlaceCard cardId={7} />
                </div>

                <button className={styles.projectButton}>
                    <div className={styles.buttonIconContainer}>
                        <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span>中学卒業のことをもっと見る</span>
                </button>
            </div>
        </div>
    );
};

export default Section04;
