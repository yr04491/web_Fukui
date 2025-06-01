/* ==================== 
   review.js - メイン制御ファイル
   全てのコンポーネントを統合・管理
==================== */

class ReviewApp {
    constructor() {
        this.storage = null;
        this.validator = null;
        this.categoryManager = null;
        this.reviewForm = null;
        this.reviewList = null;
        
        this.isInitialized = false;
        this.debugMode = false;
        
        this.init();
    }

    // アプリケーション初期化
    async init() {
        try {
            console.log('Initializing Review App...');
            
            // DOM読み込み完了を待つ
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
            
        } catch (error) {
            console.error('Failed to initialize Review App:', error);
            this.showErrorPage(error);
        }
    }

    // コンポーネント初期化
    initializeComponents() {
        try {
            // 1. 依存関係のチェック
            this.checkDependencies();
            
            // 2. ストレージ初期化
            this.storage = new ReviewStorage();
            
            // 3. バリデーター初期化
            this.validator = new ReviewValidator();
            
            // 4. カテゴリマネージャー初期化
            this.categoryManager = new CategoryManager();
            
            // 5. フォーム初期化
            this.reviewForm = new ReviewForm(
                this.storage, 
                this.validator, 
                this.categoryManager
            );
            
            // 6. 一覧表示初期化
            this.reviewList = new ReviewList(
                this.storage,
                this.categoryManager
            );
            
            // 7. グローバルイベント設定
            this.setupGlobalEvents();
            
            // 8. デバッグモード設定
            this.setupDebugMode();
            
            // 9. アプリケーション設定
            this.setupAppFeatures();
            
            this.isInitialized = true;
            console.log('Review App initialized successfully');
            
            // 初期化完了イベント発火
            this.dispatchInitEvent();
            
        } catch (error) {
            console.error('Component initialization failed:', error);
            this.showErrorMessage('アプリケーションの初期化に失敗しました: ' + error.message);
        }
    }

    // 依存関係チェック
    checkDependencies() {
        const required = [
            'ReviewStorage',
            'ReviewValidator', 
            'CategoryManager',
            'ReviewForm',
            'ReviewList',
            'ALL_CATEGORIES',
            'KEYWORD_MAPPING'
        ];

        const missing = required.filter(dep => typeof window[dep] === 'undefined');
        
        if (missing.length > 0) {
            throw new Error(`Missing dependencies: ${missing.join(', ')}`);
        }

        // 必要なDOM要素の存在確認
        const requiredElements = [
            'reviewForm',
            'reviewList', 
            'submitBtn',
            'messageContainer'
        ];

        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            throw new Error(`Missing DOM elements: ${missingElements.join(', ')}`);
        }
    }

    // グローバルイベント設定
    setupGlobalEvents() {
        // ページ離脱前の処理
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });

        // エラーハンドリング
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });

        // アンハンドルドプロミス
        window.addEventListener('unhandledrejection', (e) => {
            this.handleUnhandledRejection(e);
        });

        // オンライン/オフライン状態監視
        window.addEventListener('online', () => {
            this.handleOnlineStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatusChange(false);
        });

        // 可視性変更（タブ切り替え）
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    // デバッグモード設定
    setupDebugMode() {
        // URL パラメータでデバッグモード判定
        const urlParams = new URLSearchParams(window.location.search);
        this.debugMode = urlParams.get('debug') === 'true';

        if (this.debugMode) {
            console.log('Debug mode enabled');
            
            // デバッグパネル作成
            this.createDebugPanel();
            
            // グローバルデバッグオブジェクト
            window.reviewAppDebug = {
                app: this,
                storage: this.storage,
                validator: this.validator,
                categoryManager: this.categoryManager,
                form: this.reviewForm,
                list: this.reviewList,
                clearAllData: () => this.clearAllData(),
                generateTestData: () => this.generateTestData(),
                exportData: () => this.exportAllData()
            };
        }
    }

    // アプリケーション機能設定
    setupAppFeatures() {
        // パフォーマンス監視
        this.setupPerformanceMonitoring();
        
        // 統計情報収集
        this.setupAnalytics();
        
        // オートセーブ機能
        this.setupAutoSave();
        
        // キーボードショートカット
        this.setupGlobalShortcuts();
        
        // アクセシビリティ機能
        this.enhanceAccessibility();
    }

    // パフォーマンス監視
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // ページロード時間の記録
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
                
                // 統計に記録
                this.recordPerformanceMetric('pageLoad', loadTime);
            });
        }
    }

    // 統計情報収集
    setupAnalytics() {
        this.analytics = {
            pageViews: 0,
            formSubmissions: 0,
            searchQueries: 0,
            errors: 0
        };

        // ページビュー記録
        this.analytics.pageViews++;
        
        // フォーム送信イベント
        document.addEventListener('reviewAdded', () => {
            this.analytics.formSubmissions++;
            this.saveAnalytics();
        });
    }

    // オートセーブ機能
    setupAutoSave() {
        setInterval(() => {
            if (this.reviewForm && typeof this.reviewForm.saveDraft === 'function') {
                this.reviewForm.saveDraft();
            }
        }, 60000); // 1分ごと
    }

    // グローバルキーボードショートカット
    setupGlobalShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + 系のショートカット
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k': // 検索フォーカス
                        e.preventDefault();
                        const searchInput = document.getElementById('reviewSearch');
                        if (searchInput) {
                            searchInput.focus();
                        }
                        break;
                        
                    case 'r': // ページリフレッシュ（データ再読み込み）
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.refreshData();
                        }
                        break;
                        
                    case 'd': // デバッグモード切り替え
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.toggleDebugMode();
                        }
                        break;
                }
            }
            
            // Escキー
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }

    // アクセシビリティ強化
    enhanceAccessibility() {
        // スキップリンク追加
        this.addSkipLinks();
        
        // フォーカス管理
        this.setupFocusManagement();
        
        // ARIAラベル設定
        this.setupAriaLabels();
    }

    // スキップリンク追加
    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#reviewForm" class="skip-link">投稿フォームへスキップ</a>
            <a href="#reviewList" class="skip-link">口コミ一覧へスキップ</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    // フォーカス管理
    setupFocusManagement() {
        // フォーカストラップ（モーダル用）
        this.focusTrap = null;
        
        // フォーカス可能要素の取得
        this.getFocusableElements = (container) => {
            return container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
        };
    }

    // ARIAラベル設定
    setupAriaLabels() {
        // フォームにaria-label設定
        const form = document.getElementById('reviewForm');
        if (form) {
            form.setAttribute('aria-label', '口コミ投稿フォーム');
        }

        // 一覧にaria-label設定
        const list = document.getElementById('reviewList');
        if (list) {
            list.setAttribute('aria-label', '投稿された口コミ一覧');
            list.setAttribute('role', 'feed');
        }
    }

    // イベントハンドラー
    handleBeforeUnload(event) {
        // 未保存の変更があるかチェック
        if (this.reviewForm && this.reviewForm.hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '入力内容が失われる可能性があります';
            return event.returnValue;
        }
    }

    handleGlobalError(event) {
        console.error('Global error:', event.error);
        this.analytics.errors++;
        
        // ユーザーにエラーを表示（開発時のみ）
        if (this.debugMode) {
            this.showErrorMessage(`エラーが発生しました: ${event.error.message}`);
        }
    }

    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.analytics.errors++;
        
        // プロミスエラーの処理
        event.preventDefault();
    }

    handleOnlineStatusChange(isOnline) {
        const message = isOnline ? 
            'インターネット接続が復旧しました' : 
            'インターネット接続が切断されました';
            
        this.showToast(message, isOnline ? 'success' : 'warning');
        
        // オフライン時の処理
        if (!isOnline) {
            this.enableOfflineMode();
        } else {
            this.disableOfflineMode();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // タブが非アクティブになった時
            this.pauseNonEssentialFeatures();
        } else {
            // タブがアクティブになった時
            this.resumeFeatures();
        }
    }

    handleEscapeKey() {
        // 検索クリア
        const searchInput = document.getElementById('reviewSearch');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            return;
        }
        
        // その他のESC処理
    }

    // ユーティリティメソッド
    refreshData() {
        if (this.reviewList && typeof this.reviewList.loadReviews === 'function') {
            this.reviewList.loadReviews();
            this.showToast('データを更新しました');
        }
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        
        if (this.debugMode) {
            this.createDebugPanel();
            this.showToast('デバッグモードを有効にしました');
        } else {
            this.removeDebugPanel();
            this.showToast('デバッグモードを無効にしました');
        }
    }

    enableOfflineMode() {
        document.body.classList.add('offline-mode');
        // オフライン専用の機能を有効化
    }

    disableOfflineMode() {
        document.body.classList.remove('offline-mode');
        // 通常モードに復帰
    }

    pauseNonEssentialFeatures() {
        // 統計収集停止など
    }

    resumeFeatures() {
        // 機能再開
    }

    // デバッグパネル作成
    createDebugPanel() {
        if (document.getElementById('debugPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        panel.className = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <h3>Debug Panel</h3>
                <button class="debug-close">×</button>
            </div>
            <div class="debug-content">
                <button onclick="reviewAppDebug.clearAllData()">Clear All Data</button>
                <button onclick="reviewAppDebug.generateTestData()">Generate Test Data</button>
                <button onclick="reviewAppDebug.exportData()">Export Data</button>
                <button onclick="console.log(reviewAppDebug.app.getAppStatus())">Show Status</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 閉じるボタン
        panel.querySelector('.debug-close').addEventListener('click', () => {
            this.removeDebugPanel();
        });
    }

    removeDebugPanel() {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            panel.remove();
        }
    }

    // データ管理メソッド
    clearAllData() {
        if (confirm('全てのデータを削除しますか？この操作は取り消せません。')) {
            this.storage.clearStorage();
            localStorage.clear();
            location.reload();
        }
    }

    generateTestData() {
        // テストデータ生成（開発用）
        const testReviews = [
            {
                username: 'テストユーザー1',
                childAge: '中学生',
                title: 'テスト投稿1',
                content: 'これはテスト用の投稿です。',
                categories: ['テスト', 'サンプル', 'デバッグ']
            },
            {
                username: 'テストユーザー2', 
                childAge: '小学生高学年',
                title: 'テスト投稿2',
                content: 'もう一つのテスト投稿です。',
                categories: ['テスト', 'デモ', 'サンプル']
            }
        ];

        testReviews.forEach(review => {
            this.storage.saveReview(review);
        });

        this.refreshData();
        this.showToast('テストデータを生成しました');
    }

    exportAllData() {
        const data = {
            reviews: this.storage.loadFromStorage(),
            analytics: this.analytics,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `review_data_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // 統計・分析メソッド
    recordPerformanceMetric(metric, value) {
        const perfData = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
        
        if (!perfData[metric]) {
            perfData[metric] = [];
        }
        
        perfData[metric].push({
            value,
            timestamp: Date.now()
        });

        // 最新100件のみ保持
        if (perfData[metric].length > 100) {
            perfData[metric] = perfData[metric].slice(-100);
        }

        localStorage.setItem('performance_metrics', JSON.stringify(perfData));
    }

    saveAnalytics() {
        localStorage.setItem('app_analytics', JSON.stringify(this.analytics));
    }

    getAppStatus() {
        return {
            initialized: this.isInitialized,
            debugMode: this.debugMode,
            analytics: this.analytics,
            online: navigator.onLine,
            storage: this.storage ? 'OK' : 'Error',
            validator: this.validator ? 'OK' : 'Error',
            categoryManager: this.categoryManager ? 'OK' : 'Error',
            form: this.reviewForm ? 'OK' : 'Error',
            list: this.reviewList ? 'OK' : 'Error'
        };
    }

    // 通知メソッド
    showToast(message, type = 'info') {
        if (this.reviewList && typeof this.reviewList.showToast === 'function') {
            this.reviewList.showToast(message, type);
        } else {
            // フォールバック
            console.log(`Toast [${type}]: ${message}`);
        }
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showErrorPage(error) {
        document.body.innerHTML = `
            <div class="error-page">
                <h1>アプリケーションエラー</h1>
                <p>申し訳ございません。アプリケーションの起動中にエラーが発生しました。</p>
                <details>
                    <summary>エラー詳細</summary>
                    <pre>${error.message}\n${error.stack}</pre>
                </details>
                <button onclick="location.reload()">ページを再読み込み</button>
            </div>
        `;
    }

    // 初期化完了イベント
    dispatchInitEvent() {
        const event = new CustomEvent('reviewAppReady', {
            detail: { app: this },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
}

// グローバル初期化
let reviewApp;

// アプリケーション開始
try {
    reviewApp = new ReviewApp();
} catch (error) {
    console.error('Failed to start Review App:', error);
    
    // 緊急フォールバック
    document.addEventListener('DOMContentLoaded', () => {
        document.body.innerHTML = `
            <div class="emergency-fallback">
                <h1>システムエラー</h1>
                <p>アプリケーションを開始できませんでした。</p>
                <button onclick="location.reload()">再試行</button>
            </div>
        `;
    });
}

// デバッグ用グローバル関数
window.getReviewApp = () => reviewApp;

// 開発用ヘルパー
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Development mode detected');
    console.log('Use reviewAppDebug for debugging');
}