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
        this.bindEvents();
        this.loadReviews();
        this.setupSearchFeature();
    }

    // イベントバインディング
    bindEvents() {
        // フィルター変更
        this.ageFilter.addEventListener('change', (e) => {
            this.currentFilter.childAge = e.target.value;
            this.applyFilters();
        });

        this.sortBy.addEventListener('change', (e) => {
            this.currentFilter.sortBy = e.target.value;
            this.applyFilters();
        });

        // 新しい投稿の追加をリッスン
        document.addEventListener('reviewAdded', (e) => {
            this.handleNewReview(e.detail.review);
        });

        // 無限スクロール（将来の拡張用）
        this.setupInfiniteScroll();
    }

    // 検索機能設定
    setupSearchFeature() {
        // 検索ボックスを動的に追加
        const searchContainer = this.createSearchBox();
        const listSection = document.querySelector('.list-section .section-header');
        if (listSection) {
            listSection.appendChild(searchContainer);
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

        searchInput.addEventListener('input', (e) => {
            this.currentFilter.keyword = e.target.value.trim();
            this.applyFilters();
            clearButton.style.display = e.target.value ? 'block' : 'none';
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            this.currentFilter.keyword = '';
            this.applyFilters();
            clearButton.style.display = 'none';
        });

        return container;
    }

    // レビューデータ読み込み
    async loadReviews() {
        try {
            const result = await this.storage.loadReviews();
            if (result.success) {
                this.reviews = result.data;
                this.applyFilters();
            } else {
                console.error('Failed to load reviews:', result.error);
                this.showEmptyState();
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showEmptyState();
        }
    }

    // フィルター適用
    applyFilters() {
        this.filteredReviews = this.reviews.filter(review => {
            // 年齢フィルター
            if (this.currentFilter.childAge && review.childAge !== this.currentFilter.childAge) {
                return false;
            }

            // キーワード検索
            if (this.currentFilter.keyword) {
                const keyword = this.currentFilter.keyword.toLowerCase();
                const searchText = `${review.title} ${review.content} ${review.username}`.toLowerCase();
                const categoryText = review.categories ? review.categories.join(' ').toLowerCase() : '';
                
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
    }

    // ソート処理
    sortReviews() {
        switch (this.currentFilter.sortBy) {
            case 'newest':
                this.filteredReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'oldest':
                this.filteredReviews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
        }
    }

    // レビュー一覧描画
    renderReviews() {
        if (this.filteredReviews.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.listContainer.innerHTML = '';
        
        this.filteredReviews.forEach(review => {
            const reviewElement = this.createReviewElement(review);
            this.listContainer.appendChild(reviewElement);
        });

        // アニメーション効果
        this.animateReviewItems();
    }

    // 個別レビュー要素作成
    createReviewElement(review) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.setAttribute('data-review-id', review.id);

        const formattedDate = this.formatDate(review.timestamp);
        const categoriesHtml = this.createCategoriesHtml(review.categories);

        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="review-meta">
                    <div class="review-author">${this.escapeHtml(review.username)}</div>
                    <div class="review-age">${this.escapeHtml(review.childAge)}</div>
                </div>
                <div class="review-date">${formattedDate}</div>
            </div>
            <h3 class="review-title">${this.escapeHtml(review.title)}</h3>
            <div class="review-content">${this.formatContent(review.content)}</div>
            ${categoriesHtml}
            <div class="review-actions">
                <button class="action-btn helpful-btn" data-action="helpful" data-id="${review.id}">
                    <span class="helpful-icon">👍</span>
                    <span class="helpful-text">参考になった</span>
                    <span class="helpful-count">${review.helpfulCount || 0}</span>
                </button>
                <button class="action-btn share-btn" data-action="share" data-id="${review.id}">
                    <span class="share-icon">📤</span>
                    <span class="share-text">共有</span>
                </button>
            </div>
        `;

        // アクションボタンのイベント
        this.bindReviewActions(reviewElement, review);

        return reviewElement;
    }

    // カテゴリHTML作成
    createCategoriesHtml(categories) {
        if (!categories || categories.length === 0) {
            return '<div class="review-categories"><span class="category-tag">未分類</span></div>';
        }

        const categoryTags = categories.map(category => 
            `<span class="category-tag">${this.escapeHtml(category)}</span>`
        ).join('');

        return `<div class="review-categories">${categoryTags}</div>`;
    }

    // レビューアクションのイベントバインディング
    bindReviewActions(reviewElement, review) {
        const helpfulBtn = reviewElement.querySelector('.helpful-btn');
        const shareBtn = reviewElement.querySelector('.share-btn');

        helpfulBtn.addEventListener('click', () => this.handleHelpfulClick(review.id));
        shareBtn.addEventListener('click', () => this.handleShareClick(review));
    }

    // 「参考になった」ボタンの処理
    async handleHelpfulClick(reviewId) {
        try {
            // 既にクリック済みかチェック
            const helpfulReviews = JSON.parse(localStorage.getItem('helpful_reviews') || '[]');
            
            if (helpfulReviews.includes(reviewId)) {
                alert('既に「参考になった」をクリック済みです');
                return;
            }

            // カウント増加
            const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
            if (reviewIndex !== -1) {
                this.reviews[reviewIndex].helpfulCount = (this.reviews[reviewIndex].helpfulCount || 0) + 1;
                
                // ストレージ更新
                await this.storage.updateReview(reviewId, this.reviews[reviewIndex]);
                
                // ローカルストレージに記録
                helpfulReviews.push(reviewId);
                localStorage.setItem('helpful_reviews', JSON.stringify(helpfulReviews));
                
                // 表示更新
                this.updateHelpfulCount(reviewId, this.reviews[reviewIndex].helpfulCount);
                
                // フィードバック
                this.showToast('参考になったことを記録しました');
            }
        } catch (error) {
            console.error('Error updating helpful count:', error);
            this.showToast('エラーが発生しました', 'error');
        }
    }

    // 共有ボタンの処理
    handleShareClick(review) {
        if (navigator.share) {
            // Web Share API対応ブラウザ
            navigator.share({
                title: review.title,
                text: `${review.title}\n\n${review.content.substring(0, 100)}...`,
                url: window.location.href
            });
        } else {
            // フォールバック：クリップボードにコピー
            const shareText = `${review.title}\n\n${review.content}\n\n（ぼくらのみち より）`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('口コミ内容をクリップボードにコピーしました');
            }).catch(() => {
                // 手動コピー用ダイアログ
                prompt('以下の内容をコピーしてください:', shareText);
            });
        }
    }

    // 「参考になった」カウント更新
    updateHelpfulCount(reviewId, newCount) {
        const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
        if (reviewElement) {
            const countElement = reviewElement.querySelector('.helpful-count');
            if (countElement) {
                countElement.textContent = newCount;
                countElement.parentElement.classList.add('helpful-clicked');
            }
        }
    }

    // 新しいレビュー追加処理
    handleNewReview(newReview) {
        this.reviews.unshift(newReview); // 最新を先頭に追加
        this.applyFilters();
        
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
    }

    // 空状態表示
    showEmptyState() {
        this.listContainer.innerHTML = '';
        this.emptyState.classList.remove('hidden');
        
        // フィルター状態に応じたメッセージ変更
        const emptyTitle = this.emptyState.querySelector('.empty-title');
        const emptyText = this.emptyState.querySelector('.empty-text');
        
        if (this.currentFilter.childAge || this.currentFilter.keyword) {
            emptyTitle.textContent = '条件に一致する口コミが見つかりません';
            emptyText.textContent = 'フィルターを変更して再度検索してみてください';
        } else {
            emptyTitle.textContent = 'まだ口コミが投稿されていません';
            emptyText.textContent = '最初の投稿をしてみませんか？';
        }
    }

    // 空状態非表示
    hideEmptyState() {
        this.emptyState.classList.add('hidden');
    }

    // アニメーション効果
    animateReviewItems() {
        const items = this.listContainer.querySelectorAll('.review-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 無限スクロール設定
    setupInfiniteScroll() {
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
    }

    // 追加データ読み込み（将来の実装用）
    async loadMoreReviews() {
        // ページネーション実装時に使用
        console.log('Loading more reviews...');
    }

    // 日付フォーマット
    formatDate(timestamp) {
        const date = new Date(timestamp);
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
    }

    // 内容フォーマット（改行対応）
    formatContent(content) {
        return this.escapeHtml(content)
            .replace(/\n/g, '<br>')
            .replace(/\s\s+/g, ' '); // 連続スペース削除
    }

    // HTMLエスケープ
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // トースト通知表示
    showToast(message, type = 'info') {
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
    }

    // フィルター統計取得
    getFilterStatistics() {
        const stats = {
            total: this.reviews.length,
            filtered: this.filteredReviews.length,
            byAge: {},
            byCategory: {}
        };

        // 年齢別統計
        this.reviews.forEach(review => {
            stats.byAge[review.childAge] = (stats.byAge[review.childAge] || 0) + 1;
        });

        // カテゴリ別統計
        this.reviews.forEach(review => {
            if (review.categories) {
                review.categories.forEach(category => {
                    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
                });
            }
        });

        return stats;
    }

    // エクスポート機能（CSV形式）
    exportToCSV() {
        const headers = ['投稿日', 'ユーザー名', 'お子さんの年齢', 'タイトル', '内容', 'カテゴリ'];
        const csvData = [headers];

        this.filteredReviews.forEach(review => {
            const row = [
                new Date(review.timestamp).toLocaleDateString('ja-JP'),
                review.username,
                review.childAge,
                review.title,
                review.content.replace(/\n/g, ' '),
                review.categories ? review.categories.join(';') : ''
            ];
            csvData.push(row);
        });

        const csvContent = csvData.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');

        // ダウンロード
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '口コミ一覧.csv';
        link.click();
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