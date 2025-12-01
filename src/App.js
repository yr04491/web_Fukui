import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout/Layout'; // 
import { navigationItems } from './data/navigationItems'; // 
import ScrollToTop from './components/ScrollToTop';
import ExperiencesContent from './components/MainContent/experiences';
import PlacesContent from './components/MainContent/places';
import PathsContent from './components/MainContent/paths';
import TweetDetailPage from './pages/TweetDetailPage/TweetDetailPage';
import TweetSearchResults from './pages/TweetSearchResults/TweetSearchResults';
import PlaceSearchResults from './pages/PlaceSearchResults/PlaceSearchResults';
import PlaceDetailPage from './pages/PlaceDetailPage/PlaceDetailPage';
import PlaceReviewPage from './pages/PlaceReviewPage/PlaceReviewPage';
// SectionXXPage のインポートは不要になります

function App() {
  return (
    <Router basename="/web_Fukui">
      <ScrollToTop />
      <Routes>
        {/* ホーム画面用のルート */}
        <Route path="/" element={<HomePage />} />

        {/* 体験談を探すページ */}
        <Route path="/experiences" element={
          <Layout>
            <ExperiencesContent />
          </Layout>
        } />

        {/* 居場所を探すページ */}
        <Route path="/places" element={
          <Layout>
            <PlacesContent />
          </Layout>
        } />

        {/* 卒業後の進路を探すページ */}
        <Route path="/paths" element={
          <Layout>
            <PathsContent />
          </Layout>
        } />

        {/* ナビゲーション項目から動的にルートを生成 */}
        {navigationItems.map((item, index) => {
          // コンポーネントとパスが存在しない項目はスキップ
          if (!item.component || !item.path) {
            return null;
          }
          
          const PageComponent = item.component;
          
          return (
            <Route 
              key={index}
              path={item.path} 
              element={
                // 各ページを Layout でラップして表示
                <Layout>
                  <PageComponent />
                </Layout>
              } 
            />
          );
        })}
        {/* 体験談の検索結果と詳細ページ */}
        <Route path="/experiences/search" element={<Layout><TweetSearchResults /></Layout>} />
        <Route path="/experiences/:id" element={<Layout><TweetDetailPage /></Layout>} />
        
        {/* 居場所の検索結果と詳細ページ */}
        <Route path="/places/search" element={<Layout><PlaceSearchResults /></Layout>} />
        <Route path="/places/:id" element={<Layout><PlaceDetailPage /></Layout>} />
        <Route path="/places/:id/reviews" element={<Layout><PlaceReviewPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;