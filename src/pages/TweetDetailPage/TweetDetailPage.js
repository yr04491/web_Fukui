import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './TweetDetailPage.module.css';
import tweetCards from '../../data/tweetCards';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import { searchExperiences, getExperienceById } from '../../utils/gasApi';

const TweetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [experienceData, setExperienceData] = useState(null);
  const [relatedExperiences, setRelatedExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // locationのstateから渡されたデータを取得
  const passedData = location.state?.experienceData;

  useEffect(() => {
    const loadExperienceData = async () => {
      // 渡されたデータがあればそれを使用
      if (passedData) {
        setExperienceData(passedData);
        loadRelatedExperiences(passedData);
      } else {
        // 渡されたデータがない場合は、GASから取得（URLで直接アクセスした場合）
        try {
          const data = await getExperienceById(id);
          setExperienceData(data);
          loadRelatedExperiences(data);
        } catch (error) {
          console.error('体験談の取得エラー:', error);
          // エラー時はtweetCardsから取得（フォールバック）
          const card = tweetCards.find(c => String(c.id) === String(id));
          if (card) {
            setExperienceData(card);
          }
        }
      }
    };

    loadExperienceData();
  }, [id, passedData]);

  // 関連する体験談を取得
  const loadRelatedExperiences = async (currentData) => {
    setIsLoading(true);
    try {
      // 同じ学年またはきっかけの体験談を検索
      const filters = {};
      if (currentData.grade) {
        filters.grade = [currentData.grade];
      }
      
      const results = await searchExperiences('*', filters);
      // 現在の体験談を除外して最大4件取得
      const related = results.filter(item => item.id !== currentData.id).slice(0, 4);
      setRelatedExperiences(related);
    } catch (error) {
      console.error('関連体験談の取得エラー:', error);
      // エラー時はtweetCardsから取得
      const fallbackRelated = tweetCards.filter(c => c.id !== parseInt(id)).slice(0, 4);
      setRelatedExperiences(fallbackRelated);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' },
    { label: `体験談${id}`, path: `/experiences/${id}` }
  ];

  // データが読み込まれていない場合
  if (!experienceData) {
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

  // データの整形（検索結果とtweetCardsの両方に対応）
  const displayData = {
    // 基本情報
    title: experienceData.title || experienceData.text || 'タイトルなし',
    authorName: experienceData.authorName || 'ひろまま',
    authorInitial: experienceData.authorInitial || 'H',
    date: experienceData.date || '2025.07.03',
    grade: experienceData.grade || '',
    family: experienceData.family || '',
    
    // セクション2: 不登校のきっかけ
    trigger: experienceData.trigger || '',
    detail: experienceData.detail || experienceData.description || experienceData.text || '',
    
    // セクション3: 学校に行っていた時の様子
    schoolBehavior: experienceData.schoolBehavior || '',
    friendRelation: experienceData.friendRelation || '',
    studyStatus: experienceData.studyStatus || '',
    homeStatus: experienceData.homeStatus || '',
    
    // セクション4: 不登校になってからの様子
    initialStatus: experienceData.initialStatus || '',
    dailyLife: experienceData.dailyLife || '',
    mentalPhysical: experienceData.mentalPhysical || '',
    familyRelation: experienceData.familyRelation || '',
    
    // セクション5: 周囲の反応・サポート
    schoolResponse: experienceData.schoolResponse || '',
    parentResponse: experienceData.parentResponse || '',
    otherSupport: experienceData.otherSupport || '',
    
    // セクション6: 利用したサポート
    supports: experienceData.supports || [],
    support: experienceData.support || '',
    
    // セクション7: 現在と今後
    currentStatus: experienceData.currentStatus || '',
    message: experienceData.message || ''
  };

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
            <h2 className={styles.pageTitle}>{displayData.title}</h2>
            <div className={styles.titleDivider}></div>
          </section>

          <section className={styles.tocAndMeta}>
            <aside className={styles.tocBox}>
              <strong>体験談の目次</strong>
              <ul>
                {displayData.grade && <li>▼ 1. 基本情報</li>}
                {displayData.detail && <li>▼ 2. 不登校のきっかけ</li>}
                {(displayData.schoolBehavior || displayData.friendRelation || displayData.studyStatus || displayData.homeStatus) && 
                  <li>▼ 3. 学校に行っていた時の様子</li>}
                {(displayData.initialStatus || displayData.dailyLife || displayData.mentalPhysical || displayData.familyRelation) && 
                  <li>▼ 4. 不登校になってからの様子</li>}
                {(displayData.schoolResponse || displayData.parentResponse || displayData.otherSupport) && 
                  <li>▼ 5. 周囲の反応・サポート</li>}
                {displayData.supports.length > 0 && <li>▼ 6. 利用したサポート</li>}
                {(displayData.currentStatus || displayData.message) && <li>▼ 7. 現在と今後</li>}
              </ul>
            </aside>

            <div className={styles.metaArea}>
              <div className={styles.metaRow}>
                <span>記載日</span>
                <span>{displayData.date}</span>
              </div>
              <div className={styles.metaRow}>
                <span>投稿者</span>
                <span>{displayData.authorName}</span>
              </div>
              <div className={styles.metaRow}>
                <span>不登校時の学年</span>
                <span>{displayData.grade}</span>
              </div>
              {displayData.family && (
                <div className={styles.metaRow}>
                  <span>家族構成</span>
                  <span>{displayData.family}</span>
                </div>
              )}
              {displayData.trigger && (
                <div className={styles.metaRow}>
                  <span>きっかけ</span>
                  <span>{displayData.trigger}</span>
                </div>
              )}
            </div>
          </section>

          {/* セクション2: 不登校のきっかけ */}
          {displayData.detail && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>2. 不登校のきっかけ・詳しい状況</h3>
              <div className={styles.sectionDivider}></div>
              {displayData.trigger && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-1. 不登校になったきっかけ</h4>
                  <div className={styles.articleBody}>
                    <p>{displayData.trigger}</p>
                  </div>
                </div>
              )}
              <div className={styles.subsection}>
                <h4 className={styles.subsectionTitle}>2-2. 詳しい状況</h4>
                <div className={styles.articleBody}>
                  {displayData.detail.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* セクション3: 学校に行っていた時の様子 */}
          {(displayData.schoolBehavior || displayData.friendRelation || displayData.studyStatus || displayData.homeStatus) && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>3. 学校に行っていた時の様子</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.schoolBehavior && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-1. 学校での様子</h4>
                  <div className={styles.articleBody}>
                    {displayData.schoolBehavior.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.friendRelation && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-2. 友人関係</h4>
                  <div className={styles.articleBody}>
                    {displayData.friendRelation.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.studyStatus && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-3. 勉強面</h4>
                  <div className={styles.articleBody}>
                    {displayData.studyStatus.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.homeStatus && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-4. 家での様子</h4>
                  <div className={styles.articleBody}>
                    {displayData.homeStatus.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* セクション4: 不登校になってからの様子 */}
          {(displayData.initialStatus || displayData.dailyLife || displayData.mentalPhysical || displayData.familyRelation) && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>4. 不登校になってからの様子</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.initialStatus && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>4-1. 初期の様子</h4>
                  <div className={styles.articleBody}>
                    {displayData.initialStatus.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.dailyLife && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>4-2. 日常の過ごし方</h4>
                  <div className={styles.articleBody}>
                    {displayData.dailyLife.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.mentalPhysical && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>4-3. 心身の状態</h4>
                  <div className={styles.articleBody}>
                    {displayData.mentalPhysical.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.familyRelation && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>4-4. 家族との関係</h4>
                  <div className={styles.articleBody}>
                    {displayData.familyRelation.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* セクション5: 周囲の反応・サポート */}
          {(displayData.schoolResponse || displayData.parentResponse || displayData.otherSupport) && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>5. 周囲の反応・サポート</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.schoolResponse && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>5-1. 学校の対応</h4>
                  <div className={styles.articleBody}>
                    {displayData.schoolResponse.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.parentResponse && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>5-2. 親の対応</h4>
                  <div className={styles.articleBody}>
                    {displayData.parentResponse.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.otherSupport && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>5-3. その他の支援</h4>
                  <div className={styles.articleBody}>
                    {displayData.otherSupport.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* セクション6: 利用したサポート */}
          {displayData.supports.length > 0 && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>6. 利用したサポート</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.supports.map((support, idx) => (
                <div key={idx} className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>6-{idx + 1}. {support.type}</h4>
                  
                  {support.detail && (
                    <div className={styles.articleBody}>
                      <p><strong>詳細:</strong></p>
                      {support.detail.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  {support.frequency && (
                    <div className={styles.articleBody}>
                      <p><strong>利用頻度:</strong> {support.frequency}</p>
                    </div>
                  )}
                  
                  {support.feeling && (
                    <div className={styles.articleBody}>
                      <p><strong>利用した感想:</strong></p>
                      {support.feeling.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  {support.helpful && (
                    <div className={styles.articleBody}>
                      <p><strong>役に立ったこと:</strong></p>
                      {support.helpful.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  {support.advice && (
                    <div className={styles.articleBody}>
                      <p><strong>これから利用する人へのアドバイス:</strong></p>
                      {support.advice.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* セクション7: 現在と今後 */}
          {(displayData.currentStatus || displayData.message) && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>7. 現在と今後</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.currentStatus && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>7-1. 現在の状況</h4>
                  <div className={styles.articleBody}>
                    {displayData.currentStatus.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.message && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>7-2. 同じ境遇の人へのメッセージ</h4>
                  <div className={styles.articleBody}>
                    {displayData.message.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className={styles.relatedSection}>
            <h4 className={styles.relatedTitle}>関連記事</h4>
            <div className={styles.relatedDivider}></div>
            {isLoading ? (
              <p>読み込み中...</p>
            ) : (
              <div className={styles.relatedGrid}>
                {relatedExperiences.map((item, index) => (
                  <TweetCard 
                    key={item.id || index} 
                    cardId={item.id} 
                    data={item}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default TweetDetailPage;
