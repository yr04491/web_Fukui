import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout/Layout'; // 
import { navigationItems } from './data/navigationItems'; // 
import ScrollToTop from './components/ScrollToTop';
import ExperiencesContent, { PostExperienceContent } from './components/MainContent/experiences';
import PlacesContent from './components/MainContent/places';
import PathsContent from './components/MainContent/paths';
import ProtectedRoute from './components/Auth/ProtectedRoute';
// SectionXXPage のインポートは不要になります

// Google OAuth Client ID（環境変数から取得することを推奨）
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router basename="/web_Fukui">
          <ScrollToTop />
          <Routes>
            {/* ホーム画面用のルート */}
            <Route path="/" element={<HomePage />} />

            {/* ログインページ */}
            <Route path="/login" element={<LoginPage />} />

            {/* 体験談を探すページ */}
            <Route path="/experiences" element={
              <Layout>
                <ExperiencesContent />
              </Layout>
            } />

            {/* 体験談を投稿するページ（認証必須） */}
            <Route path="/experiences/post" element={
              <ProtectedRoute>
                <Layout>
                  <PostExperienceContent />
                </Layout>
              </ProtectedRoute>
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
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;