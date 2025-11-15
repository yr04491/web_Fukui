import React from 'react';
import styles from './Section04.module.css';
import roadNumberImage from '../../../assets/icons/04_0.png';
import InterviewCard from '../../common/InterviewCard/InterviewCard';
import SectionTitle from '../../common/SectionTitle';
import ContentFrame from '../../common/ContentFrame';

const Section04 = () => {
    return (
        <div className={styles.section04}>
            <SectionTitle 
                roadNumber="04" 
                title="インタビュー
不登校とぼくら" 
                roadNumberImage={roadNumberImage} 
            />

            <ContentFrame
                title="大丈夫、あなただけじゃない。"
            >
                <div className={styles.contentText}>
                    <p>福井県内で不登校を身近に経験した方々にインタビューをしました。当時のこと、今のこと、今だから言えること…<br />なにかヒントが見つかるかもしれません。</p>
                </div>
            </ContentFrame>

            {/* インタビューセクション */}
            <div className={styles.interviewSection}>
                <div className={styles.interviewHeader}>
                    <span className={styles.interviewTag}>自分と同じ気持ちの人はいるのかな。</span>
                    <h3 className={styles.interviewTitle}>みんなのインタビューを見てみよう！</h3>
                </div>
                <div className={styles.interviewCardArea}>
                    <InterviewCard cardId={1} />
                    <InterviewCard cardId={2} />
                </div>

                <button className={styles.moreButton}>
                    <div className={styles.buttonIconContainer}>
                        <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span>インタビューをもっと見る</span>
                </button>
            </div>
        </div>
    );
};

export default Section04;
