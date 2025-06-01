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
                categories: ["スクールカウンセラー", "保健室登校", "段階的復帰"],
                timestamp: new Date(Date.now() - 86400000 * 7).toISOString() // 7日前
            },
            {
                id: Date.now() - 200000,
                username: "太郎パパ",
                childAge: "小学生高学年",
                title: "フリースクールという選択肢もありました",
                content: "小学5年生の娘が友達関係で悩んで不登校になりました。学校復帰を目指していましたが、なかなか難しく、教育委員会の方からフリースクールを教えてもらいました。見学に行くと、様々な年齢の子どもたちが自分のペースで学習していて、娘もここなら通えそうと言いました。今では週3回通って、お友達もできて笑顔が戻ってきました。",
                categories: ["フリースクール", "友人トラブル", "教育委員会"],
                timestamp: new Date(Date.now() - 86400000 * 14).toISOString() // 14日前
            },
            {
                id: Date.now() - 300000,
                username: "みか",
                childAge: "高校生",
                title: "通信制高校に転校して正解でした",
                content: "高校1年の時にいじめが原因で不登校になりました。最初は全日制高校への復帰を考えていましたが、心理的に難しく、通信制高校への転校を決めました。自分のペースで勉強ができ、レポート提出とスクーリングで卒業できます。アルバイトもしながら将来について考える時間もできて、今は大学進学を目指しています。",
                categories: ["通信制高校", "いじめ被害", "転校手続き"],
                timestamp: new Date(Date.now() - 86400000 * 21).toISOString() // 21日前
            }
        ];

        this.saveToStorage(sampleReviews);
    }

    // データを localStorage に保存
    saveToStorage(reviews) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(reviews));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }

    // localStorage からデータを取得
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return [];
        }
    }

    // 新しいレビューを保存
    async saveReview(reviewData) {
        try {
            // データ構造の検証
            if (!this.validateReviewData(reviewData)) {
                throw new Error('Invalid review data');
            }

            // 既存データを取得
            const reviews = this.loadFromStorage();
            
            // 新しいレビューを追加
            const newReview = {
                id: Date.now(),
                username: reviewData.username.trim(),
                childAge: reviewData.childAge,
                title: reviewData.title.trim(),
                content: reviewData.content.trim(),
                categories: reviewData.categories || [],
                timestamp: new Date().toISOString()
            };

            reviews.unshift(newReview); // 最新が先頭に来るように

            // 保存
            const success = this.saveToStorage(reviews);
            
            if (success) {
                return { success: true, data: newReview };
            } else {
                throw new Error('Failed to save review');
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
            return { success: true, data: reviews };
        } catch (error) {
            console.error('Error loading reviews:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // レビューを削除
    async deleteReview(reviewId) {
        try {
            const reviews = this.loadFromStorage();
            const filteredReviews = reviews.filter(review => review.id !== reviewId);
            
            const success = this.saveToStorage(filteredReviews);
            
            if (success) {
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
            const reviews = this.loadFromStorage();
            const reviewIndex = reviews.findIndex(review => review.id === reviewId);
            
            if (reviewIndex === -1) {
                throw new Error('Review not found');
            }

            // データ検証
            if (!this.validateReviewData(updatedData)) {
                throw new Error('Invalid review data');
            }

            // 更新
            reviews[reviewIndex] = {
                ...reviews[reviewIndex],
                username: updatedData.username.trim(),
                childAge: updatedData.childAge,
                title: updatedData.title.trim(),
                content: updatedData.content.trim(),
                categories: updatedData.categories || [],
                updatedAt: new Date().toISOString()
            };

            const success = this.saveToStorage(reviews);
            
            if (success) {
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

    // フィルタリング機能
    async filterReviews(filters = {}) {
        try {
            let reviews = this.loadFromStorage();

            // 年齢でフィルタ
            if (filters.childAge && filters.childAge !== '') {
                reviews = reviews.filter(review => review.childAge === filters.childAge);
            }

            // カテゴリでフィルタ
            if (filters.category && filters.category !== '') {
                reviews = reviews.filter(review => 
                    review.categories.some(cat => cat.includes(filters.category))
                );
            }

            // キーワード検索
            if (filters.keyword && filters.keyword !== '') {
                const keyword = filters.keyword.toLowerCase();
                reviews = reviews.filter(review => 
                    review.title.toLowerCase().includes(keyword) ||
                    review.content.toLowerCase().includes(keyword) ||
                    review.username.toLowerCase().includes(keyword)
                );
            }

            // ソート
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'newest':
                        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        break;
                    case 'oldest':
                        reviews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                        break;
                }
            }

            return { success: true, data: reviews };
        } catch (error) {
            console.error('Error filtering reviews:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // データ検証
    validateReviewData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') return false;
        if (!data.childAge || typeof data.childAge !== 'string') return false;
        if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') return false;
        if (!data.content || typeof data.content !== 'string' || data.content.trim() === '') return false;
        
        // 文字数制限チェック
        if (data.username.trim().length > 20) return false;
        if (data.title.trim().length > 50) return false;
        if (data.content.trim().length > 1000) return false;
        
        return true;
    }

    // ストレージクリア（開発用）
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // データ統計取得
    async getStatistics() {
        try {
            const reviews = this.loadFromStorage();
            
            const stats = {
                total: reviews.length,
                byAge: {},
                byCategory: {},
                recent: reviews.filter(r => {
                    const reviewDate = new Date(r.timestamp);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return reviewDate > weekAgo;
                }).length
            };

            // 年齢別統計
            reviews.forEach(review => {
                stats.byAge[review.childAge] = (stats.byAge[review.childAge] || 0) + 1;
            });

            // カテゴリ別統計
            reviews.forEach(review => {
                review.categories.forEach(category => {
                    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
                });
            });

            return { success: true, data: stats };
        } catch (error) {
            console.error('Error getting statistics:', error);
            return { success: false, error: error.message };
        }
    }
}

// Firebase 移行時の実装例（コメントアウト）
/*
class ReviewStorageFirebase extends ReviewStorage {
    constructor() {
        super();
        // Firebase 初期化
        this.db = firebase.firestore();
        this.collection = 'reviews';
    }

    async saveReview(reviewData) {
        try {
            if (!this.validateReviewData(reviewData)) {
                throw new Error('Invalid review data');
            }

            const newReview = {
                username: reviewData.username.trim(),
                childAge: reviewData.childAge,
                title: reviewData.title.trim(),
                content: reviewData.content.trim(),
                categories: reviewData.categories || [],
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: firebase.auth().currentUser?.uid || 'anonymous'
            };

            const docRef = await this.db.collection(this.collection).add(newReview);
            
            return { success: true, data: { id: docRef.id, ...newReview } };
        } catch (error) {
            console.error('Error saving review to Firebase:', error);
            return { success: false, error: error.message };
        }
    }

    async loadReviews() {
        try {
            const snapshot = await this.db.collection(this.collection)
                .orderBy('timestamp', 'desc')
                .get();
            
            const reviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString()
            }));

            return { success: true, data: reviews };
        } catch (error) {
            console.error('Error loading reviews from Firebase:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
}
*/