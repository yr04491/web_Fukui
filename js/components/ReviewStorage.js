/* ==================== 
   ReviewStorage - データ保存・取得クラス
   Firebase移行時はこのクラスの中身のみ変更
==================== */

class ReviewStorage {
    constructor() {
        this.storageKey = 'bokurano_michi_reviews';
        this.init();
    }

    // 初期化
    init() {
        // localStorage が利用可能かチェック
        if (!this.isLocalStorageAvailable()) {
            console.warn('localStorage is not available');
            return;
        }

        // 初回実行時にサンプルデータを作成
        if (!localStorage.getItem(this.storageKey)) {
            this.createSampleData();
        }
    }

    // localStorage 利用可能性チェック
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // サンプルデータ作成
    createSampleData() {
        const sampleReviews = [
            {
                id: Date.now() - 100000,
                username: "花子ママ",
                childAge: "中学生",
                title: "スクールカウンセラーに相談して良かった",
                content: "息子が中学1年の秋から学校に行きづらくなりました。最初は何をしたらいいか分からず混乱していましたが、担任の先生からスクールカウンセラーを紹介してもらいました。カウンセラーの先生は息子の話をじっくり聞いてくれて、無理に学校に行かせる必要はないと言ってくれました。その後、週1回カウンセリングを受けながら、保健室登校から始めて、少しずつ教室に戻ることができました。",
                categories: ["スクールカウンセラー", "保健室登校", "担任教師との相談"],
                timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), // 7日前
                helpfulCount: 5
            },
            {
                id: Date.now() - 200000,
                username: "太郎パパ",
                childAge: "小学生高学年",
                title: "フリースクールという選択肢もありました",
                content: "小学5年生の娘が友達関係で悩んで不登校になりました。学校復帰を目指していましたが、なかなか難しく、教育委員会の方からフリースクールを教えてもらいました。見学に行くと、様々な年齢の子どもたちが自分のペースで学習していて、娘もここなら通えそうと言いました。今では週3回通って、お友達もできて笑顔が戻ってきました。",
                categories: ["フリースクール", "友人トラブル", "教育委員会"],
                timestamp: new Date(Date.now() - 86400000 * 14).toISOString(), // 14日前
                helpfulCount: 3
            },
            {
                id: Date.now() - 300000,
                username: "みか",
                childAge: "高校生",
                title: "通信制高校に転校して正解でした",
                content: "高校1年の時にいじめが原因で不登校になりました。最初は全日制高校への復帰を考えていましたが、心理的に難しく、通信制高校への転校を決めました。自分のペースで勉強ができ、レポート提出とスクーリングで卒業できます。アルバイトもしながら将来について考える時間もできて、今は大学進学を目指しています。",
                categories: ["通信制高校", "いじめ被害", "転校手続き"],
                timestamp: new Date(Date.now() - 86400000 * 21).toISOString(), // 21日前
                helpfulCount: 2
            }
        ];

        this.saveToStorage(sampleReviews);
    }

    // データを localStorage に保存
    saveToStorage(reviews) {
        try {
            if (!this.isLocalStorageAvailable()) {
                throw new Error('localStorage is not available');
            }
            
            // データの検証
            if (!Array.isArray(reviews)) {
                throw new Error('Reviews must be an array');
            }
            
            const serializedData = JSON.stringify(reviews);
            localStorage.setItem(this.storageKey, serializedData);
            
            // 保存確認
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                throw new Error('Failed to save data to localStorage');
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }

    // localStorage からデータを取得
    loadFromStorage() {
        try {
            if (!this.isLocalStorageAvailable()) {
                console.warn('localStorage is not available, returning empty array');
                return [];
            }
            
            const data = localStorage.getItem(this.storageKey);
            
            if (!data) {
                console.log('No data found in localStorage');
                return [];
            }
            
            const parsedData = JSON.parse(data);
            
            // データ形式の検証
            if (!Array.isArray(parsedData)) {
                console.warn('Invalid data format in localStorage, returning empty array');
                return [];
            }
            
            return parsedData;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return [];
        }
    }

    // 新しいレビューを保存
    async saveReview(reviewData) {
        try {
            // データ構造の検証（修正点：より厳密に）
            const validationResult = this.validateReviewData(reviewData);
            if (!validationResult.isValid) {
                throw new Error('Invalid review data: ' + validationResult.errors.join(', '));
            }

            // 既存データを取得
            const reviews = this.loadFromStorage();
            
            // 新しいレビューを作成
            const newReview = {
                id: Date.now() + Math.random(), // より確実なユニークID
                username: String(reviewData.username).trim(),
                childAge: String(reviewData.childAge),
                title: String(reviewData.title).trim(),
                content: String(reviewData.content).trim(),
                categories: Array.isArray(reviewData.categories) ? reviewData.categories : [],
                timestamp: new Date().toISOString(),
                helpfulCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 配列の先頭に追加（最新が先頭に来るように）
            reviews.unshift(newReview);

            // データサイズ制限（1000件まで）
            if (reviews.length > 1000) {
                reviews.splice(1000);
            }

            // 保存
            const success = this.saveToStorage(reviews);
            
            if (success) {
                console.log('Review saved successfully:', newReview.id);
                return { success: true, data: newReview };
            } else {
                throw new Error('Failed to save review to storage');
            }
        } catch (error) {
            console.error('Error saving review:', error);
            return { success: false, error: error.message };
        }
    }

    // 全レビューを取得
    async loadReviews() {
        try {
            const reviews = this.loadFromStorage();
            
            // データの整合性チェック
            const validReviews = reviews.filter(review => {
                return review && 
                       review.id && 
                       review.username && 
                       review.title && 
                       review.content;
            });
            
            if (validReviews.length !== reviews.length) {
                console.warn(`Filtered out ${reviews.length - validReviews.length} invalid reviews`);
            }
            
            return { success: true, data: validReviews };
        } catch (error) {
            console.error('Error loading reviews:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // レビューを削除
    async deleteReview(reviewId) {
        try {
            if (!reviewId) {
                throw new Error('Review ID is required');
            }
            
            const reviews = this.loadFromStorage();
            const originalLength = reviews.length;
            
            const filteredReviews = reviews.filter(review => review.id !== reviewId);
            
            if (filteredReviews.length === originalLength) {
                throw new Error('Review not found');
            }
            
            const success = this.saveToStorage(filteredReviews);
            
            if (success) {
                console.log('Review deleted successfully:', reviewId);
                return { success: true };
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            return { success: false, error: error.message };
        }
    }

    // レビューを更新
    async updateReview(reviewId, updatedData) {
        try {
            if (!reviewId) {
                throw new Error('Review ID is required');
            }
            
            const reviews = this.loadFromStorage();
            const reviewIndex = reviews.findIndex(review => review.id === reviewId);
            
            if (reviewIndex === -1) {
                throw new Error('Review not found');
            }

            // データ検証
            const validationResult = this.validateReviewData(updatedData);
            if (!validationResult.isValid) {
                throw new Error('Invalid review data: ' + validationResult.errors.join(', '));
            }

            // 更新（既存データを保持しつつ、新しいデータで上書き）
            const existingReview = reviews[reviewIndex];
            reviews[reviewIndex] = {
                ...existingReview,
                username: String(updatedData.username).trim(),
                childAge: String(updatedData.childAge),
                title: String(updatedData.title).trim(),
                content: String(updatedData.content).trim(),
                categories: Array.isArray(updatedData.categories) ? updatedData.categories : existingReview.categories,
                updatedAt: new Date().toISOString()
            };

            const success = this.saveToStorage(reviews);
            
            if (success) {
                console.log('Review updated successfully:', reviewId);
                return { success: true, data: reviews[reviewIndex] };
            } else {
                throw new Error('Failed to update review');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            return { success: false, error: error.message };
        }
    }

    // ID でレビューを取得
    async getReviewById(reviewId) {
        try {
            if (!reviewId) {
                throw new Error('Review ID is required');
            }
            
            const reviews = this.loadFromStorage();
            const review = reviews.find(review => review.id === reviewId);
            
            if (review) {
                return { success: true, data: review };
            } else {
                return { success: false, error: 'Review not found' };
            }
        } catch (error) {
            console.error('Error getting review:', error);
            return { success: false, error: error.message };
        }
    }

    // フィルタリング機能（修正点：エラーハンドリング強化）
    async filterReviews(filters = {}) {
        try {
            let reviews = this.loadFromStorage();

            // フィルターの検証
            const validFilters = {
                childAge: typeof filters.childAge === 'string' ? filters.childAge : '',
                category: typeof filters.category === 'string' ? filters.category : '',
                keyword: typeof filters.keyword === 'string' ? filters.keyword : '',
                sortBy: typeof filters.sortBy === 'string' ? filters.sortBy : 'newest'
            };

            // 年齢でフィルタ
            if (validFilters.childAge && validFilters.childAge !== '') {
                reviews = reviews.filter(review => review.childAge === validFilters.childAge);
            }

            // カテゴリでフィルタ
            if (validFilters.category && validFilters.category !== '') {
                reviews = reviews.filter(review => 
                    review.categories && 
                    Array.isArray(review.categories) &&
                    review.categories.some(cat => cat.includes(validFilters.category))
                );
            }

            // キーワード検索
            if (validFilters.keyword && validFilters.keyword !== '') {
                const keyword = validFilters.keyword.toLowerCase();
                reviews = reviews.filter(review => {
                    const searchText = [
                        review.title || '',
                        review.content || '',
                        review.username || ''
                    ].join(' ').toLowerCase();
                    
                    const categoryText = review.categories && Array.isArray(review.categories) 
                        ? review.categories.join(' ').toLowerCase() 
                        : '';
                    
                    return searchText.includes(keyword) || categoryText.includes(keyword);
                });
            }

            // ソート
            switch (validFilters.sortBy) {
                case 'oldest':
                    reviews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    break;
                case 'newest':
                default:
                    reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    break;
            }

            return { success: true, data: reviews };
        } catch (error) {
            console.error('Error filtering reviews:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // データ検証（修正点：より厳密に）
    validateReviewData(data) {
        const errors = [];
        
        if (!data || typeof data !== 'object') {
            return { isValid: false, errors: ['データが正しくありません'] };
        }
        
        // 必須フィールドのチェック
        if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') {
            errors.push('ユーザーネームは必須です');
        }
        
        if (!data.childAge || typeof data.childAge !== 'string') {
            errors.push('お子さんの年齢は必須です');
        }
        
        if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
            errors.push('タイトルは必須です');
        }
        
        if (!data.content || typeof data.content !== 'string' || data.content.trim() === '') {
            errors.push('口コミ内容は必須です');
        }
        
        // 文字数制限チェック
        if (data.username && data.username.trim().length > 20) {
            errors.push('ユーザーネームは20文字以内で入力してください');
        }
        
        if (data.title && data.title.trim().length > 50) {
            errors.push('タイトルは50文字以内で入力してください');
        }
        
        if (data.content && data.content.trim().length > 1000) {
            errors.push('口コミ内容は1000文字以内で入力してください');
        }
        
        if (data.content && data.content.trim().length < 10) {
            errors.push('口コミ内容は10文字以上で入力してください');
        }
        
        // 許可された年齢区分のチェック
        const allowedAges = [
            "未就学児",
            "小学生低学年",
            "小学生高学年",
            "中学生",
            "高校生",
            "18歳以上"
        ];
        
        if (data.childAge && !allowedAges.includes(data.childAge)) {
            errors.push('お子さんの年齢が正しく選択されていません');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ストレージクリア（開発用）
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Storage cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // データ統計取得（修正点：エラーハンドリング追加）
    async getStatistics() {
        try {
            const reviews = this.loadFromStorage();
            
            const stats = {
                total: reviews.length,
                byAge: {},
                byCategory: {},
                recent: 0,
                thisWeek: 0,
                thisMonth: 0
            };

            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            reviews.forEach(review => {
                try {
                    // 年齢別統計
                    if (review.childAge) {
                        stats.byAge[review.childAge] = (stats.byAge[review.childAge] || 0) + 1;
                    }

                    // カテゴリ別統計
                    if (review.categories && Array.isArray(review.categories)) {
                        review.categories.forEach(category => {
                            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
                        });
                    }

                    // 期間別統計
                    if (review.timestamp) {
                        const reviewDate = new Date(review.timestamp);
                        if (reviewDate > weekAgo) {
                            stats.recent++;
                            stats.thisWeek++;
                        }
                        if (reviewDate > monthAgo) {
                            stats.thisMonth++;
                        }
                    }
                } catch (reviewError) {
                    console.warn('Error processing review for statistics:', reviewError);
                }
            });

            return { success: true, data: stats };
        } catch (error) {
            console.error('Error getting statistics:', error);
            return { success: false, error: error.message };
        }
    }

    // データベースサイズ取得
    getDatabaseSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const sizeInBytes = data ? new Blob([data]).size : 0;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            
            return {
                bytes: sizeInBytes,
                kb: sizeInKB,
                reviewCount: this.loadFromStorage().length
            };
        } catch (error) {
            console.error('Error getting database size:', error);
            return { bytes: 0, kb: '0.00', reviewCount: 0 };
        }
    }

    // データのエクスポート（バックアップ用）
    exportData() {
        try {
            const reviews = this.loadFromStorage();
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                reviewCount: reviews.length,
                reviews: reviews
            };
            
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }

    // データのインポート（復元用）
    importData(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            
            if (!importData.reviews || !Array.isArray(importData.reviews)) {
                throw new Error('Invalid import data format');
            }
            
            // 既存データとマージするかどうかの確認
            const existingReviews = this.loadFromStorage();
            const confirmOverwrite = existingReviews.length === 0 || 
                confirm(`既存の${existingReviews.length}件のデータを${importData.reviews.length}件のデータで置き換えますか？`);
            
            if (!confirmOverwrite) {
                return { success: false, error: 'Import cancelled by user' };
            }
            
            const success = this.saveToStorage(importData.reviews);
            
            if (success) {
                return { success: true, imported: importData.reviews.length };
            } else {
                throw new Error('Failed to save imported data');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            return { success: false, error: error.message };
        }
    }
}