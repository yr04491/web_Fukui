import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './TweetDetailPage.module.css';
import tweetCards from '../../data/tweetCards';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';

const TweetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = tweetCards.find(c => String(c.id) === String(id));

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' },
    { label: `体験談${id}`, path: `/experiences/${id}` }
  ];

  if (!card) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当の体験談が見つかりません。</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Related: show other tweet cards (exclude current)
  const related = tweetCards.filter(c => c.id !== card.id).slice(0,4);

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        <header className={styles.hero}>
          <p className={styles.heroLead}>子どもが不登校に・・・</p>
          <h1 className={styles.heroTitle}>みんなの体験</h1>
          <div className={styles.heroDots} />
        </header>

        <main className={styles.main}>
          <section className={styles.titleSection}>
            <h2 className={styles.pageTitle}>{card.title || 'ここはページのタイトル部分'}</h2>
            <div className={styles.titleDivider}></div>
          </section>

          <section className={styles.tocAndMeta}>
            <aside className={styles.tocBox}>
              <strong>体験談の目次</strong>
              <ul>
                <li>▼ 不登校のきっかけ</li>
                <li>▼ 不登校のきっかけ</li>
                <li>▼ 同じ状況の方へのアドバイス</li>
              </ul>
            </aside>

            <div className={styles.metaArea}>
              <div className={styles.metaRow}><span>記載日</span><span>{card.date}</span></div>
              <div className={styles.metaRow}><span>不登校時の学年</span><span>{card.grade || '小学校2年生'}</span></div>
              <div className={styles.metaRow}><span>家族構成</span><span>{card.family || '父・母・本人'}</span></div>
            </div>
          </section>

          <section className={styles.bodySection}>
            <h3 className={styles.sectionHeading}>ここは各見出し</h3>
            <div className={styles.sectionDivider}></div>
            <div className={styles.articleBody}>{card.body || card.text || 'ここに本文が入ります。'}</div>
          </section>

          <section className={styles.relatedSection}>
            <h4 className={styles.relatedTitle}>関連記事</h4>
            <div className={styles.relatedDivider}></div>
            <div className={styles.relatedGrid}>
              {related.map(r => (
                <TweetCard key={r.id} cardId={r.id} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default TweetDetailPage;
