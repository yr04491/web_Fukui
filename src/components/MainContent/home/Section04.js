import React from 'react';
import styles from './Section04.module.css';
import roadNumberImage from '../../../assets/icons/04_0.png';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import SectionTitle from '../../common/SectionTitle';

const Section04 = () => {
    return (
        <div className={styles.section04}>
            <SectionTitle 
                roadNumber="04" 
                title="中学卒業後のこと" 
                roadNumberImage={roadNumberImage} 
            />

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
