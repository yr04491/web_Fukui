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
        {/* 体験談の詳細ページ */}
        <Route path="/tweets" element={<Layout><TweetSearchResults /></Layout>} />
        <Route path="/tweets/:id" element={<Layout><TweetDetailPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;