import React from 'react';
import styles from './Section05.module.css';
import dotlineImage from '../../../assets/images/dotline.png';
import vector0 from '../../../assets/icons/vector0.png';
import vector5 from '../../../assets/icons/vector5.png';
import PicCard from '../../common/PicCard/PicCard';

const Section05 = () => {
    return (
        <div className={styles.section05}>
            <div className={styles.titleWrapper}>
                <div className={styles.logoContainer}>
                    <span className={styles.roadText}>ROAD</span>
                    <img src={vector0} alt="0" className={styles.logoChar} />
                    <img src={vector5} alt="5" className={styles.logoChar} />
                </div>
                <h1 className={styles.mainTitle}>みんなで知恵を 出し合おう</h1>
                <div className={styles.dotline} style={{ backgroundImage: `url(${dotlineImage})` }}></div>
            </div>

            {/* 紹介セクション */}
            <div className={styles.introSection}>
                <h3 className={styles.introTitle}>当事者だからの声を聞こう</h3>
                <p className={styles.introText}>
                    専門家や当事者のみなさんにお会いして、インタビューしてきました。たくさんの人との出会いの中で前に進んで行った皆さんの体験に触れてみてください。
                </p>
            </div>

            {/* 体験談セクション */}
            <div className={styles.experienceSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTag}>ここに文字を入れる</span>
                    <h3 className={styles.sectionTitle}>保護者・子ども当事者からの体験談</h3>
                </div>
                <div className={styles.tweetCardArea}>
                    {/* 体験談カードの表示（PicCardを使用） */}
                    <PicCard cardId={1} />
                    <PicCard cardId={2} />
                    <PicCard cardId={3} />
                </div>

                <button className={`${styles.projectButton} ${styles.experienceButton}`}>
                    <div className={styles.buttonIconContainer}>
                        <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span>保護者・子ども当事者からの体験談をもっと見る</span>
                </button>
            </div>
            {/* 専門家の意見セクション */}
            <div className={styles.expertSection} id="expertSection">
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTag}>ここに文字を入れる</span>
                    <h3 className={styles.sectionTitle}>専門家インタビュー、Q&A</h3>
                </div>
                <div className={styles.tweetCardArea}>
                    {/* 専門家の意見カード（PicCardを使用） */}
                    <PicCard cardId={4} />
                    <PicCard cardId={5} />
                    <PicCard cardId={6} />
                </div>

                <button className={`${styles.projectButton} ${styles.expertButton}`}>
                    <div className={styles.buttonIconContainer}>
                        <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span>専門家インタビューをもっと見る</span>
                </button>
            </div>
        </div>
    );
};

export default Section05;
