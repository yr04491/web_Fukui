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
        this.initializationAttempts = 0;
        this.maxInitializationAttempts = 3;
        
        this.init();
    }

    // アプリケーション初期化
    async init() {
        try {
            console.log('Initializing Review App...');
            this.initializationAttempts++;
            
            // DOM読み込み完了を待つ
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
            
        } catch (error) {
            console.error('Failed to initialize Review App:', error);
            
            if (this.initializationAttempts < this.maxInitializationAttempts) {
                console.log(`Retrying initialization (${this.initializationAttempts}/${this.maxInitializationAttempts})...`);
                setTimeout(() => this.init(), 1000);
            } else {
                this.showErrorPage(error);
            }
        }
    }

    // コンポーネント初期化（修正点：順序とエラーハンドリング改善）
    initializeComponents() {
        try {
            console.log('Starting component initialization...');
            
            // 1. 依存関係のチェック
            this.checkDependencies();
            
            // 2. ストレージ初期化
            console.log('Initializing storage...');
            this.storage = new ReviewStorage();
            
            // 3. バリデーター初期化
            console.log('Initializing validator...');
            this.validator = new ReviewValidator();
            
            // 4. カテゴリマネージャー初期化
            console.log('Initializing category manager...');
            this.categoryManager = new CategoryManager();
            
            // カテゴリマネージャーのデバッグ情報を確認
            if (this.categoryManager.getDebugInfo) {
                console.log('Category manager debug info:', this.categoryManager.getDebugInfo());
            }
            
            // 5. フォーム初期化
            console.log('Initializing form...');
            this.reviewForm = new ReviewForm(
                this.storage, 
                this.validator, 
                this.categoryManager
            );
            
            // 6. 一覧表示初期化
            console.log('Initializing list...');
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
            
            if (this.initializationAttempts < this.maxInitializationAttempts) {
                console.log(`Retrying component initialization (${this.initializationAttempts}/${this.maxInitializationAttempts})...`);
                setTimeout(() => this.initializeComponents(), 1000);
            } else {
                this.showErrorMessage('アプリケーションの初期化に失敗しました: ' + error.message);
            }
        }
    }

    // 依存関係チェック（修正点：より柔軟に）
    checkDependencies() {
        const required = [
            'ReviewStorage',
            'ReviewValidator', 
            'CategoryManager',
            'ReviewForm',
            'ReviewList'
        ];

        const missing = required.filter(dep => typeof window[dep] === 'undefined');
        
        if (missing.length > 0) {
            console.warn('Missing dependencies:', missing);
            // 依存関係が足りなくても、基本的な機能は動作するように
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
            console.warn('Missing DOM elements:', missingElements);
            // DOM要素が足りなくても警告のみ
        }

        // カテゴリデータの確認
        const categoriesAvailable = window.ALL_CATEGORIES && Array.isArray(window.ALL_CATEGORIES);
        const keywordMappingAvailable = window.KEYWORD_MAPPING && typeof window.KEYWORD_MAPPING === 'object';
        
        console.log('Categories available:', categoriesAvailable, window.ALL_CATEGORIES ? window.ALL_CATEGORIES.length : 0);
        console.log('Keyword mapping available:', keywordMappingAvailable, window.KEYWORD_MAPPING ? Object.keys(window.KEYWORD_MAPPING).length : 0);
    }

    // グローバルイベント設定
    setupGlobalEvents() {
        try {
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

            console.log('Global events setup complete');
        } catch (error) {
            console.error('Error setting up global events:', error);
        }
    }

    // デバッグモード設定
    setupDebugMode() {
        try {
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
                    exportData: () => this.exportAllData(),
                    refreshData: () => this.refreshData(),
                    getStatus: () => this.getAppStatus()
                };
            }
        } catch (error) {
            console.error('Error setting up debug mode:', error);
        }
    }

    // アプリケーション機能設定
    setupAppFeatures() {
        try {
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
            
            console.log('App features setup complete');
        } catch (error) {
            console.error('Error setting up app features:', error);
        }
    }

    // パフォーマンス監視
    setupPerformanceMonitoring() {
        try {
            if ('performance' in window) {
                // ページロード時間の記録
                window.addEventListener('load', () => {
                    const loadTime = performance.now();
                    console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
                    
                    // 統計に記録
                    this.recordPerformanceMetric('pageLoad', loadTime);
                });
            }
        } catch (error) {
            console.error('Error setting up performance monitoring:', error);
        }
    }

    // 統計情報収集
    setupAnalytics() {
        try {
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
        } catch (error) {
            console.error('Error setting up analytics:', error);
        }
    }

    // オートセーブ機能
    setupAutoSave() {
        try {
            setInterval(() => {
                if (this.reviewForm && typeof this.reviewForm.saveDraft === 'function') {
                    this.reviewForm.saveDraft();
                }
            }, 60000); // 1分ごと
        } catch (error) {
            console.error('Error setting up auto save:', error);
        }
    }

    // グローバルキーボードショートカット
    setupGlobalShortcuts() {
        try {
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
        } catch (error) {
            console.error('Error setting up global shortcuts:', error);
        }
    }

    // アクセシビリティ強化
    enhanceAccessibility() {
        try {
            // スキップリンク追加
            this.addSkipLinks();
            
            // フォーカス管理
            this.setupFocusManagement();
            
            // ARIAラベル設定
            this.setupAriaLabels();
        } catch (error) {
            console.error('Error enhancing accessibility:', error);
        }
    }

    // スキップリンク追加
    addSkipLinks() {
        try {
            const skipLinks = document.createElement('div');
            skipLinks.className = 'skip-links';
            skipLinks.innerHTML = `
                <a href="#reviewForm" class="skip-link">投稿フォームへスキップ</a>
                <a href="#reviewList" class="skip-link">口コミ一覧へスキップ</a>
            `;
            
            document.body.insertBefore(skipLinks, document.body.firstChild);
        } catch (error) {
            console.error('Error adding skip links:', error);
        }
    }

    // フォーカス管理
    setupFocusManagement() {
        try {
            // フォーカストラップ（モーダル用）
            this.focusTrap = null;
            
            // フォーカス可能要素の取得
            this.getFocusableElements = (container) => {
                return container.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
            };
        } catch (error) {
            console.error('Error setting up focus management:', error);
        }
    }

    // ARIAラベル設定
    setupAriaLabels() {
        try {
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
        } catch (error) {
            console.error('Error setting up ARIA labels:', error);
        }
    }

    // イベントハンドラー
    handleBeforeUnload(event) {
        try {
            // 未保存の変更があるかチェック
            if (this.reviewForm && this.reviewForm.hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '入力内容が失われる可能性があります';
                return event.returnValue;
            }
        } catch (error) {
            console.error('Error handling before unload:', error);
        }
    }

    handleGlobalError(event) {
        try {
            console.error('Global error:', event.error);
            if (this.analytics) {
                this.analytics.errors++;
            }
            
            // ユーザーにエラーを表示（開発時のみ）
            if (this.debugMode) {
                this.showErrorMessage(`エラーが発生しました: ${event.error.message}`);
            }
        } catch (error) {
            console.error('Error handling global error:', error);
        }
    }

    handleUnhandledRejection(event) {
        try {
            console.error('Unhandled promise rejection:', event.reason);
            if (this.analytics) {
                this.analytics.errors++;
            }
            
            // プロミスエラーの処理
            event.preventDefault();
        } catch (error) {
            console.error('Error handling unhandled rejection:', error);
        }
    }

    handleOnlineStatusChange(isOnline) {
        try {
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
        } catch (error) {
            console.error('Error handling online status change:', error);
        }
    }

    handleVisibilityChange() {
        try {
            if (document.hidden) {
                // タブが非アクティブになった時
                this.pauseNonEssentialFeatures();
            } else {
                // タブがアクティブになった時
                this.resumeFeatures();
            }
        } catch (error) {
            console.error('Error handling visibility change:', error);
        }
    }

    handleEscapeKey() {
        try {
            // 検索クリア
            const searchInput = document.getElementById('reviewSearch');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                return;
            }
            
            // その他のESC処理
        } catch (error) {
            console.error('Error handling escape key:', error);
        }
    }

    // ユーティリティメソッド
    refreshData() {
        try {
            if (this.reviewList && typeof this.reviewList.refreshData === 'function') {
                this.reviewList.refreshData();
            } else if (this.reviewList && typeof this.reviewList.loadReviews === 'function') {
                this.reviewList.loadReviews();
                this.showToast('データを更新しました', 'success');
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showToast('データ更新中にエラーが発生しました', 'error');
        }
    }

    toggleDebugMode() {
        try {
            this.debugMode = !this.debugMode;
            
            if (this.debugMode) {
                this.createDebugPanel();
                this.showToast('デバッグモードを有効にしました', 'info');
            } else {
                this.removeDebugPanel();
                this.showToast('デバッグモードを無効にしました', 'info');
            }
        } catch (error) {
            console.error('Error toggling debug mode:', error);
        }
    }

    enableOfflineMode() {
        try {
            document.body.classList.add('offline-mode');
            // オフライン専用の機能を有効化
        } catch (error) {
            console.error('Error enabling offline mode:', error);
        }
    }

    disableOfflineMode() {
        try {
            document.body.classList.remove('offline-mode');
            // 通常モードに復帰
        } catch (error) {
            console.error('Error disabling offline mode:', error);
        }
    }

    pauseNonEssentialFeatures() {
        try {
            // 統計収集停止など
        } catch (error) {
            console.error('Error pausing features:', error);
        }
    }

    resumeFeatures() {
        try {
            // 機能再開
        } catch (error) {
            console.error('Error resuming features:', error);
        }
    }

    // デバッグパネル作成
    createDebugPanel() {
        try {
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
                    <button onclick="reviewAppDebug.refreshData()">Refresh Data</button>
                    <button onclick="console.log(reviewAppDebug.getStatus())">Show Status</button>
                </div>
            `;

            document.body.appendChild(panel);

            // 閉じるボタン
            const closeBtn = panel.querySelector('.debug-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.removeDebugPanel();
                });
            }
        } catch (error) {
            console.error('Error creating debug panel:', error);
        }
    }

    removeDebugPanel() {
        try {
            const panel = document.getElementById('debugPanel');
            if (panel) {
                panel.remove();
            }
        } catch (error) {
            console.error('Error removing debug panel:', error);
        }
    }

    // データ管理メソッド
    clearAllData() {
        try {
            if (confirm('全てのデータを削除しますか？この操作は取り消せません。')) {
                if (this.storage && typeof this.storage.clearStorage === 'function') {
                    this.storage.clearStorage();
                }
                localStorage.clear();
                location.reload();
            }
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }

    generateTestData() {
        try {
            // テストデータ生成（開発用）
            const testReviews = [
                {
                    username: 'テストユーザー1',
                    childAge: '中学生',
                    title: 'テスト投稿1',
                    content: 'これはテスト用の投稿です。カウンセラーに相談して良かったです。',
                    categories: ['スクールカウンセラー', 'テスト', 'サンプル']
                },
                {
                    username: 'テストユーザー2', 
                    childAge: '小学生高学年',
                    title: 'テスト投稿2',
                    content: 'もう一つのテスト投稿です。フリースクールという選択肢もあります。',
                    categories: ['フリースクール', 'テスト', 'デモ']
                }
            ];

            const promises = testReviews.map(review => {
                if (this.storage && typeof this.storage.saveReview === 'function') {
                    return this.storage.saveReview(review);
                }
                return Promise.resolve({ success: false });
            });

            Promise.all(promises).then(() => {
                this.refreshData();
                this.showToast('テストデータを生成しました', 'success');
            }).catch(error => {
                console.error('Error generating test data:', error);
                this.showToast('テストデータ生成中にエラーが発生しました', 'error');
            });
        } catch (error) {
            console.error('Error in generateTestData:', error);
        }
    }

    exportAllData() {
        try {
            const data = {
                reviews: this.storage && typeof this.storage.loadFromStorage === 'function' ? 
                    this.storage.loadFromStorage() : [],
                analytics: this.analytics || {},
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
            this.showToast('データをエクスポートしました', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('エクスポート中にエラーが発生しました', 'error');
        }
    }

    // 統計・分析メソッド
    recordPerformanceMetric(metric, value) {
        try {
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
        } catch (error) {
            console.error('Error recording performance metric:', error);
        }
    }

    saveAnalytics() {
        try {
            if (this.analytics) {
                localStorage.setItem('app_analytics', JSON.stringify(this.analytics));
            }
        } catch (error) {
            console.error('Error saving analytics:', error);
        }
    }

    getAppStatus() {
        try {
            return {
                initialized: this.isInitialized,
                debugMode: this.debugMode,
                analytics: this.analytics || {},
                online: navigator.onLine,
                storage: this.storage ? 'OK' : 'Error',
                validator: this.validator ? 'OK' : 'Error',
                categoryManager: this.categoryManager ? 'OK' : 'Error',
                form: this.reviewForm ? 'OK' : 'Error',
                list: this.reviewList ? 'OK' : 'Error',
                categoriesLoaded: window.ALL_CATEGORIES ? window.ALL_CATEGORIES.length : 0,
                keywordMappingLoaded: window.KEYWORD_MAPPING ? Object.keys(window.KEYWORD_MAPPING).length : 0
            };
        } catch (error) {
            console.error('Error getting app status:', error);
            return { error: error.message };
        }
    }

    // 通知メソッド
    showToast(message, type = 'info') {
        try {
            if (this.reviewList && typeof this.reviewList.showToast === 'function') {
                this.reviewList.showToast(message, type);
            } else {
                // フォールバック
                console.log(`Toast [${type}]: ${message}`);
            }
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showErrorPage(error) {
        try {
            document.body.innerHTML = `
                <div class="error-page">
                    <h1>アプリケーションエラー</h1>
                    <p>申し訳ございません。アプリケーションの起動中にエラーが発生しました。</p>
                    <details>
                        <summary>エラー詳細</summary>
                        <pre>${error.message}\n${error.stack || ''}</pre>
                    </details>
                    <button onclick="location.reload()">ページを再読み込み</button>
                </div>
            `;
        } catch (pageError) {
            console.error('Error showing error page:', pageError);
            alert('重大なエラーが発生しました。ページを再読み込みしてください。');
        }
    }

    // 初期化完了イベント
    dispatchInitEvent() {
        try {
            const event = new CustomEvent('reviewAppReady', {
                detail: { app: this },
                bubbles: true
            });
            document.dispatchEvent(event);
            console.log('Review app ready event dispatched');
        } catch (error) {
            console.error('Error dispatching init event:', error);
        }
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
                <p>ページを再読み込みしてください。</p>
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
    console.log('Add ?debug=true to URL for debug panel');
}