// Google Apps Script (GAS) APIのエンドポイント設定
// .envファイルで環境変数を設定することを推奨

const GAS_CONFIG = {
  // GASのデプロイURL（環境変数から取得、なければデフォルト値）
  API_URL: process.env.REACT_APP_GAS_API_URL || '',
  
  // API エンドポイント
  ENDPOINTS: {
    SEARCH_EXPERIENCES: 'searchExperiences',
    GET_ALL_EXPERIENCES: 'getAllExperiences',
    POST_EXPERIENCE: 'postExperience'
  },
  
  // タイムアウト設定（ミリ秒）
  TIMEOUT: 30000,
  
  // リトライ設定
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
};

export default GAS_CONFIG;
