import React from 'react';
import styles from './Section05.module.css';
import roadNumberImage from '../../../assets/icons/05_0.png';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import SectionTitle from '../../common/SectionTitle';

const Section05 = () => {
    return (
        <div className={styles.section05}>
            <SectionTitle 
                roadNumber="05" 
                title="中学卒業後のこと" 
                roadNumberImage={roadNumberImage} 
            />

            {/* 説明テキスト */}
            <div className={styles.description}>
                <p className={styles.descriptionTitle1}>ここにことばをいれる</p>
                <p className={styles.descriptionTitle2}>ここにことばをいれるここにことば</p>
                <p className={styles.descriptionText}>
                    ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。
                </p>
            </div>

            {/* 学校・フリースクール紹介セクション */}
            <div className={styles.placeSection}>
                <div className={styles.placeHeader}>
                    <span className={styles.placeTag}>選択肢はいろいろあります</span>
                    <h3 className={styles.placeTitle}>学校・フリースクールの紹介</h3>
                </div>
                <div className={styles.placeCardArea}>
                    <PlaceCard cardId={7} />
                    <PlaceCard cardId={8} />
                    <PlaceCard cardId={3} />
                </div>

                <button className={styles.moreButton}>
                    <div className={styles.buttonIconContainer}>
                        <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span>中学校卒業後のことをもっと見る</span>
                </button>
            </div>
        </div>
    );
};

export default Section05;