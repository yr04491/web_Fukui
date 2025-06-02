/* ==================== 
   ReviewList - 口コミ一覧表示クラス
==================== */

class ReviewList {
    constructor(storage, categoryManager) {
        this.storage = storage;
        this.categoryManager = categoryManager;
        
        this.listContainer = document.getElementById('reviewList');
        this.emptyState = document.getElementById('emptyState');
        this.ageFilter = document.getElementById('ageFilter');
        this.sortBy = document.getElementById('sortBy');
        
        this.currentFilter = {
            childAge: '',
            sortBy: 'newest',
            keyword: ''
        };
        
        this.reviews = [];
        this.filteredReviews = [];
        
        this.init();
    }

    // 初期化
    init() {
        try {
            // 必要な要素の存在確認
            if (!this.listContainer) {
                throw new Error('Review list container not found');
            }
            
            this.bindEvents();
            this.loadReviews();
            this.setupSearchFeature();
            
            console.log('ReviewList initialized successfully');
        } catch (error) {
            console.error('ReviewList initialization failed:', error);
            this.showEmptyState('初期化エラーが発生しました');
        }
    }

    // イベントバインディング
    bindEvents() {
        try {
            // フィルター変更
            if (this.ageFilter) {
                this.ageFilter.addEventListener('change', (e) => {
                    this.currentFilter.childAge = e.target.value;
                    this.applyFilters();
                });
            }

            if (this.sortBy) {
                this.sortBy.addEventListener('change', (e) => {
                    this.currentFilter.sortBy = e.target.value;
                    this.applyFilters();
                });
            }

            // 新しい投稿の追加をリッスン（修正点：イベント名統一）
            document.addEventListener('reviewAdded', (e) => {
                console.log('ReviewAdded event received:', e.detail);
                this.handleNewReview(e.detail.review);
            });

            // 無限スクロール（将来の拡張用）
            this.setupInfiniteScroll();
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }

    // 検索機能設定
    setupSearchFeature() {
        try {
            // 検索ボックスを動的に追加
            const searchContainer = this.createSearchBox();
            const listSection = document.querySelector('.list-section .section-header');
            if (listSection) {
                listSection.appendChild(searchContainer);
            }
        } catch (error) {
            console.warn('Search feature setup failed:', error);
        }
    }

    // 検索ボックス作成
    createSearchBox() {
        const container = document.createElement('div');
        container.className = 'search-container';
        container.innerHTML = `
            <div class="search-box">
                <input 
                    type="text" 
                    id="reviewSearch" 
                    placeholder="キーワードで検索..."
                    class="search-input"
                >
                <button type="button" class="search-clear" id="searchClear">×</button>
            </div>
        `;

        // 検索イベント
        const searchInput = container.querySelector('#reviewSearch');
        const clearButton = container.querySelector('#searchClear');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.keyword = e.target.value.trim();
                this.applyFilters();
                if (clearButton) {
                    clearButton.style.display = e.target.value ? 'block' : 'none';
                }
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    this.currentFilter.keyword = '';
                    this.applyFilters();
                    clearButton.style.display = 'none';
                }
            });
        }

        return container;
    }

    // レビューデータ読み込み（修正点：エラーハンドリング強化）
    async loadReviews() {
        try {
            console.log('Loading reviews...');
            const result = await this.storage.loadReviews();
            console.log('Load result:', result);
            
            if (result.success) {
                this.reviews = Array.isArray(result.data) ? result.data : [];
                console.log(`Loaded ${this.reviews.length} reviews`);
                this.applyFilters();
            } else {
                console.error('Failed to load reviews:', result.error);
                this.reviews = [];
                this.showEmptyState('データの読み込みに失敗しました');
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = [];
            this.showEmptyState('データの読み込み中にエラーが発生しました');
        }
    }

    // フィルター適用
    applyFilters() {
        try {
            console.log('Applying filters:', this.currentFilter);
            
            this.filteredReviews = this.reviews.filter(review => {
                // データの検証
                if (!review || typeof review !== 'object') {
                    return false;
                }
                
                // 年齢フィルター
                if (this.currentFilter.childAge && review.childAge !== this.currentFilter.childAge) {
                    return false;
                }

                // キーワード検索
                if (this.currentFilter.keyword) {
                    const keyword = this.currentFilter.keyword.toLowerCase();
                    const searchText = [
                        review.title || '',
                        review.content || '',
                        review.username || ''
                    ].join(' ').toLowerCase();
                    
                    const categoryText = review.categories && Array.isArray(review.categories) ? 
                        review.categories.join(' ').toLowerCase() : '';
                    
                    if (!searchText.includes(keyword) && !categoryText.includes(keyword)) {
                        return false;
                    }
                }

                return true;
            });

            // ソート
            this.sortReviews();
            
            // 表示更新
            this.renderReviews();
            
            console.log(`Filtered to ${this.filteredReviews.length} reviews`);
        } catch (error) {
            console.error('Error applying filters:', error);
            this.showEmptyState('フィルター処理中にエラーが発生しました');
        }
    }

    // ソート処理
    sortReviews() {
        try {
            switch (this.currentFilter.sortBy) {
                case 'newest':
                    this.filteredReviews.sort((a, b) => {
                        const dateA = new Date(a.timestamp || 0);
                        const dateB = new Date(b.timestamp || 0);
                        return dateB - dateA;
                    });
                    break;
                case 'oldest':
                    this.filteredReviews.sort((a, b) => {
                        const dateA = new Date(a.timestamp || 0);
                        const dateB = new Date(b.timestamp || 0);
                        return dateA - dateB;
                    });
                    break;
            }
        } catch (error) {
            console.error('Error sorting reviews:', error);
        }
    }

    // レビュー一覧描画
    renderReviews() {
        try {
            if (this.filteredReviews.length === 0) {
                this.showEmptyState();
                return;
            }

            this.hideEmptyState();
            
            if (this.listContainer) {
                this.listContainer.innerHTML = '';
                
                this.filteredReviews.forEach(review => {
                    try {
                        const reviewElement = this.createReviewElement(review);
                        this.listContainer.appendChild(reviewElement);
                    } catch (reviewError) {
                        console.error('Error creating review element:', reviewError);
                    }
                });

                // アニメーション効果
                this.animateReviewItems();
            }
        } catch (error) {
            console.error('Error rendering reviews:', error);
            this.showEmptyState('表示処理中にエラーが発生しました');
        }
    }

    // 個別レビュー要素作成（修正点：安全性向上）
    createReviewElement(review) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.setAttribute('data-review-id', review.id);

        // データの安全性チェック
        const safeReview = {
            id: review.id || 'unknown',
            username: review.username || 'Unknown User',
            childAge: review.childAge || '未設定',
            title: review.title || 'No Title',
            content: review.content || '',
            categories: Array.isArray(review.categories) ? review.categories : [],
            timestamp: review.timestamp || new Date().toISOString(),
            helpfulCount: review.helpfulCount || 0
        };

        const formattedDate = this.formatDate(safeReview.timestamp);
        const categoriesHtml = this.createCategoriesHtml(safeReview.categories);

        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="review-meta">
                    <div class="review-author">${this.escapeHtml(safeReview.username)}</div>
                    <div class="review-age">${this.escapeHtml(safeReview.childAge)}</div>
                </div>
                <div class="review-date">${formattedDate}</div>
            </div>
            <h3 class="review-title">${this.escapeHtml(safeReview.title)}</h3>
            <div class="review-content">${this.formatContent(safeReview.content)}</div>
            ${categoriesHtml}
            <div class="review-actions">
                <button class="action-btn helpful-btn" data-action="helpful" data-id="${safeReview.id}">
                    <span class="helpful-icon">👍</span>
                    <span class="helpful-text">参考になった</span>
                    <span class="helpful-count">${safeReview.helpfulCount}</span>
                </button>
                <button class="action-btn share-btn" data-action="share" data-id="${safeReview.id}">
                    <span class="share-icon">📤</span>
                    <span class="share-text">共有</span>
                </button>
            </div>
        `;

        // アクションボタンのイベント
        this.bindReviewActions(reviewElement, safeReview);

        return reviewElement;
    }

    // カテゴリHTML作成
    createCategoriesHtml(categories) {
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return '<div class="review-categories"><span class="category-tag">未分類</span></div>';
        }

        const categoryTags = categories.map(category => 
            `<span class="category-tag">${this.escapeHtml(category)}</span>`
        ).join('');

        return `<div class="review-categories">${categoryTags}</div>`;
    }

    // レビューアクションのイベントバインディング
    bindReviewActions(reviewElement, review) {
        try {
            const helpfulBtn = reviewElement.querySelector('.helpful-btn');
            const shareBtn = reviewElement.querySelector('.share-btn');

            if (helpfulBtn) {
                helpfulBtn.addEventListener('click', () => this.handleHelpfulClick(review.id));
            }
            
            if (shareBtn) {
                shareBtn.addEventListener('click', () => this.handleShareClick(review));
            }
        } catch (error) {
            console.error('Error binding review actions:', error);
        }
    }

    // 「参考になった」ボタンの処理
    async handleHelpfulClick(reviewId) {
        try {
            // 既にクリック済みかチェック
            const helpfulReviews = JSON.parse(localStorage.getItem('helpful_reviews') || '[]');
            
            if (helpfulReviews.includes(reviewId)) {
                this.showToast('既に「参考になった」をクリック済みです', 'warning');
                return;
            }

            // カウント増加
            const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
            if (reviewIndex !== -1) {
                this.reviews[reviewIndex].helpfulCount = (this.reviews[reviewIndex].helpfulCount || 0) + 1;
                
                // ストレージ更新
                if (this.storage && typeof this.storage.updateReview === 'function') {
                    await this.storage.updateReview(reviewId, this.reviews[reviewIndex]);
                }
                
                // ローカルストレージに記録
                helpfulReviews.push(reviewId);
                localStorage.setItem('helpful_reviews', JSON.stringify(helpfulReviews));
                
                // 表示更新
                this.updateHelpfulCount(reviewId, this.reviews[reviewIndex].helpfulCount);
                
                // フィードバック
                this.showToast('参考になったことを記録しました', 'success');
            }
        } catch (error) {
            console.error('Error updating helpful count:', error);
            this.showToast('エラーが発生しました', 'error');
        }
    }

    // 共有ボタンの処理
    handleShareClick(review) {
        try {
            if (navigator.share) {
                // Web Share API対応ブラウザ
                navigator.share({
                    title: review.title,
                    text: `${review.title}\n\n${review.content.substring(0, 100)}...`,
                    url: window.location.href
                }).catch(error => {
                    console.log('Share cancelled:', error);
                });
            } else {
                // フォールバック：クリップボードにコピー
                const shareText = `${review.title}\n\n${review.content}\n\n（ぼくらのみち より）`;
                
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(shareText).then(() => {
                        this.showToast('口コミ内容をクリップボードにコピーしました', 'success');
                    }).catch(() => {
                        this.fallbackCopyToClipboard(shareText);
                    });
                } else {
                    this.fallbackCopyToClipboard(shareText);
                }
            }
        } catch (error) {
            console.error('Error sharing review:', error);
            this.showToast('共有中にエラーが発生しました', 'error');
        }
    }

    // フォールバック：手動コピー
    fallbackCopyToClipboard(text) {
        try {
            // テキストエリアを作成してコピー
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '-1000px';
            document.body.appendChild(textArea);
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showToast('口コミ内容をクリップボードにコピーしました', 'success');
            } else {
                // 手動コピー用ダイアログ
                prompt('以下の内容をコピーしてください:', text);
            }
        } catch (error) {
            console.error('Fallback copy failed:', error);
            prompt('以下の内容をコピーしてください:', text);
        }
    }

    // 「参考になった」カウント更新
    updateHelpfulCount(reviewId, newCount) {
        try {
            const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
            if (reviewElement) {
                const countElement = reviewElement.querySelector('.helpful-count');
                if (countElement) {
                    countElement.textContent = newCount;
                    countElement.parentElement.classList.add('helpful-clicked');
                }
            }
        } catch (error) {
            console.error('Error updating helpful count display:', error);
        }
    }

    // 新しいレビュー追加処理（修正点：安全性向上）
    handleNewReview(newReview) {
        try {
            if (!newReview || typeof newReview !== 'object') {
                console.warn('Invalid new review data:', newReview);
                return;
            }
            
            console.log('Adding new review to list:', newReview.id);
            
            // 既存の配列に追加（重複チェック）
            const existingIndex = this.reviews.findIndex(r => r.id === newReview.id);
            if (existingIndex === -1) {
                this.reviews.unshift(newReview); // 最新を先頭に追加
                this.applyFilters(); // フィルターを再適用して表示更新
                
                // 新しい投稿をハイライト
                setTimeout(() => {
                    const newElement = document.querySelector(`[data-review-id="${newReview.id}"]`);
                    if (newElement) {
                        newElement.classList.add('new-review');
                        setTimeout(() => {
                            newElement.classList.remove('new-review');
                        }, 3000);
                    }
                }, 100);
                
                console.log('New review added successfully');
            } else {
                console.log('Review already exists, skipping');
            }
        } catch (error) {
            console.error('Error handling new review:', error);
        }
    }

    // 空状態表示
    showEmptyState(customMessage = null) {
        try {
            if (this.listContainer) {
                this.listContainer.innerHTML = '';
            }
            
            if (this.emptyState) {
                this.emptyState.classList.remove('hidden');
                
                // カスタムメッセージがある場合は更新
                if (customMessage) {
                    const emptyTitle = this.emptyState.querySelector('.empty-title');
                    const emptyText = this.emptyState.querySelector('.empty-text');
                    
                    if (emptyTitle) {
                        emptyTitle.textContent = customMessage;
                    }
                    if (emptyText) {
                        emptyText.textContent = '';
                    }
                } else {
                    // フィルター状態に応じたメッセージ変更
                    const emptyTitle = this.emptyState.querySelector('.empty-title');
                    const emptyText = this.emptyState.querySelector('.empty-text');
                    
                    if (this.currentFilter.childAge || this.currentFilter.keyword) {
                        if (emptyTitle) emptyTitle.textContent = '条件に一致する口コミが見つかりません';
                        if (emptyText) emptyText.textContent = 'フィルターを変更して再度検索してみてください';
                    } else {
                        if (emptyTitle) emptyTitle.textContent = 'まだ口コミが投稿されていません';
                        if (emptyText) emptyText.textContent = '最初の投稿をしてみませんか？';
                    }
                }
            }
        } catch (error) {
            console.error('Error showing empty state:', error);
        }
    }

    // 空状態非表示
    hideEmptyState() {
        try {
            if (this.emptyState) {
                this.emptyState.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error hiding empty state:', error);
        }
    }

    // アニメーション効果
    animateReviewItems() {
        try {
            const items = this.listContainer ? this.listContainer.querySelectorAll('.review-item') : [];
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        } catch (error) {
            console.error('Error animating review items:', error);
        }
    }

    // 無限スクロール設定
    setupInfiniteScroll() {
        try {
            // 将来の実装用（大量データ対応）
            let loading = false;
            
            window.addEventListener('scroll', () => {
                if (loading) return;
                
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    // スクロール底部に到達
                    this.loadMoreReviews();
                }
            });
        } catch (error) {
            console.error('Error setting up infinite scroll:', error);
        }
    }

    // 追加データ読み込み（将来の実装用）
    async loadMoreReviews() {
        try {
            // ページネーション実装時に使用
            console.log('Loading more reviews...');
        } catch (error) {
            console.error('Error loading more reviews:', error);
        }
    }

    // 日付フォーマット（修正点：エラーハンドリング追加）
    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            
            // 無効な日付をチェック
            if (isNaN(date.getTime())) {
                return '日付不明';
            }
            
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                return '今日';
            } else if (diffDays === 2) {
                return '昨日';
            } else if (diffDays <= 7) {
                return `${diffDays - 1}日前`;
            } else {
                return date.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                });
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return '日付不明';
        }
    }

    // 内容フォーマット（改行対応）
    formatContent(content) {
        try {
            if (!content || typeof content !== 'string') {
                return '';
            }
            
            return this.escapeHtml(content)
                .replace(/\n/g, '<br>')
                .replace(/\s\s+/g, ' '); // 連続スペース削除
        } catch (error) {
            console.error('Error formatting content:', error);
            return this.escapeHtml(content || '');
        }
    }

    // HTMLエスケープ
    escapeHtml(text) {
        try {
            if (text === null || text === undefined) {
                return '';
            }
            
            const div = document.createElement('div');
            div.textContent = String(text);
            return div.innerHTML;
        } catch (error) {
            console.error('Error escaping HTML:', error);
            return String(text || '');
        }
    }

    // トースト通知表示
    showToast(message, type = 'info') {
        try {
            // 既存のトーストを削除
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }

            // 新しいトースト作成
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            
            document.body.appendChild(toast);

            // アニメーション
            setTimeout(() => {
                toast.classList.add('toast-show');
            }, 100);

            // 自動削除
            setTimeout(() => {
                toast.classList.remove('toast-show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, 3000);
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }

    // フィルター統計取得
    getFilterStatistics() {
        try {
            const stats = {
                total: this.reviews.length,
                filtered: this.filteredReviews.length,
                byAge: {},
                byCategory: {}
            };

            // 年齢別統計
            this.reviews.forEach(review => {
                if (review.childAge) {
                    stats.byAge[review.childAge] = (stats.byAge[review.childAge] || 0) + 1;
                }
            });

            // カテゴリ別統計
            this.reviews.forEach(review => {
                if (review.categories && Array.isArray(review.categories)) {
                    review.categories.forEach(category => {
                        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
                    });
                }
            });

            return stats;
        } catch (error) {
            console.error('Error getting filter statistics:', error);
            return { total: 0, filtered: 0, byAge: {}, byCategory: {} };
        }
    }

    // エクスポート機能（CSV形式）
    exportToCSV() {
        try {
            const headers = ['投稿日', 'ユーザー名', 'お子さんの年齢', 'タイトル', '内容', 'カテゴリ'];
            const csvData = [headers];

            this.filteredReviews.forEach(review => {
                const row = [
                    new Date(review.timestamp).toLocaleDateString('ja-JP'),
                    review.username || '',
                    review.childAge || '',
                    review.title || '',
                    (review.content || '').replace(/\n/g, ' '),
                    review.categories && Array.isArray(review.categories) ? review.categories.join(';') : ''
                ];
                csvData.push(row);
            });

            const csvContent = csvData.map(row => 
                row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
            ).join('\n');

            // ダウンロード
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `口コミ一覧_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            this.showToast('CSV形式でエクスポートしました', 'success');
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            this.showToast('エクスポート中にエラーが発生しました', 'error');
        }
    }

    // データリフレッシュ
    async refreshData() {
        try {
            console.log('Refreshing review data...');
            await this.loadReviews();
            this.showToast('データを更新しました', 'success');
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showToast('データ更新中にエラーが発生しました', 'error');
        }
    }

    // デバッグ用メソッド
    debug() {
        return {
            totalReviews: this.reviews.length,
            filteredReviews: this.filteredReviews.length,
            currentFilter: this.currentFilter,
            statistics: this.getFilterStatistics()
        };
    }
}