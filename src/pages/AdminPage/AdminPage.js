import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './AdminPage.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import { getPendingExperiences, getApprovedExperiences, approveExperience, rejectExperience } from '../../utils/gasApi';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [approvedExperiences, setApprovedExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '管理者画面', path: '/admin' }
  ];

  // データ取得
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pending, approved] = await Promise.all([
        getPendingExperiences(),
        getApprovedExperiences()
      ]);
      setPendingExperiences(pending);
      setApprovedExperiences(approved);
    } catch (error) {
      console.error('データ取得エラー:', error);
      setError('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 承認処理
  const handleApprove = async (id) => {
    if (!window.confirm('この体験談を承認しますか？')) return;
    
    try {
      await approveExperience(id);
      alert('承認しました');
      loadData(); // データを再読み込み
    } catch (error) {
      console.error('承認エラー:', error);
      alert('承認に失敗しました');
    }
  };

  // 却下処理
  const handleReject = async (id) => {
    if (!window.confirm('この体験談を却下しますか？')) return;
    
    try {
      await rejectExperience(id);
      alert('却下しました');
      loadData(); // データを再読み込み
    } catch (error) {
      console.error('却下エラー:', error);
      alert('却下に失敗しました');
    }
  };

  const currentExperiences = activeTab === 'pending' ? pendingExperiences : approvedExperiences;

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={layoutStyles.mainContent}>
        <div className={styles.adminHeader}>
          <h1 className={styles.title}>管理者画面</h1>
          <p className={styles.subtitle}>体験談の承認・管理</p>
        </div>

        {/* タブ切り替え */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            未承認体験談 ({pendingExperiences.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'approved' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            承認済み体験談 ({approvedExperiences.length})
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className={styles.contentArea}>
          {isLoading ? (
            <div className={styles.loadingMessage}>読み込み中...</div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : currentExperiences.length === 0 ? (
            <div className={styles.emptyMessage}>
              {activeTab === 'pending' ? '未承認の体験談はありません' : '承認済みの体験談はありません'}
            </div>
          ) : (
            <div className={styles.experiencesList}>
              {currentExperiences.map((experience) => (
                <div key={experience.id} className={styles.experienceItem}>
                  <TweetCard
                    id={experience.id}
                    title={experience.title}
                    description={experience.summary}
                    grade={experience.startGrade}
                    trigger={experience.trigger}
                    support={experience.supportTypes}
                    onClick={() => navigate(`/experiences/${experience.id}`)}
                  />
                  
                  {/* 承認・却下ボタン（未承認時のみ表示） */}
                  {activeTab === 'pending' && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.approveButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(experience.id);
                        }}
                      >
                        承認
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(experience.id);
                        }}
                      >
                        却下
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
