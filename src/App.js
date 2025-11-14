import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout/Layout'; // 
import { navigationItems } from './data/navigationItems'; // 
import ScrollToTop from './components/ScrollToTop';
// SectionXXPage のインポートは不要になります

function App() {
  return (
    <Router basename="/web_Fukui">
      <ScrollToTop />
      <Routes>
        {/* ホーム画面用のルート */}
        <Route path="/" element={<HomePage />} />

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
      </Routes>
    </Router>
  );
}

export default App;