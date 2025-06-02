/* ==================== 
   CategoryManager - AIカテゴリ判定クラス
==================== */

class CategoryManager {
    constructor() {
        // グローバル変数の確実な参照（修正点）
        this.categories = window.ALL_CATEGORIES || ALL_CATEGORIES || [];
        this.keywordMapping = window.KEYWORD_MAPPING || KEYWORD_MAPPING || {};
        this.minConfidenceScore = 0.3;
        this.maxCategories = 3;
        
        // 初期化チェック
        if (this.categories.length === 0) {
            console.warn('Categories not loaded, using fallback');
            this.categories = [
                "担任教師との相談", "保健室登校", "スクールカウンセラー", "心理カウンセラー",
                "教育支援センター", "フリースクール", "不安症状", "親子関係", "進路相談", "いじめ被害"
            ];
        }
        
        if (Object.keys(this.keywordMapping).length === 0) {
            console.warn('Keyword mapping not loaded, using fallback');
            this.keywordMapping = {
                "担任": ["担任教師との相談"],
                "先生": ["担任教師との相談"],
                "カウンセラー": ["スクールカウンセラー", "心理カウンセラー"],
                "相談": ["教育相談員"],
                "フリースクール": ["フリースクール"],
                "不安": ["不安症状"],
                "いじめ": ["いじめ被害"],
                "家族": ["親子関係"]
            };
        }
        
        // 重み付けスコア（より重要なキーワードには高いスコア）
        this.weightedKeywords = {
            // 高優先度キーワード
            'いじめ': 3.0,
            'カウンセラー': 2.5,
            'フリースクール': 2.5,
            '不登校': 2.0,
            '相談': 2.0,
            '支援': 2.0,
            
            // 中優先度キーワード
            '学校': 1.5,
            '先生': 1.5,
            '友達': 1.5,
            '家族': 1.5,
            '勉強': 1.5,
            
            // 通常優先度キーワード
            '心配': 1.0,
            '不安': 1.0,
            '悩み': 1.0
        };
    }

    // メイン関数：口コミ内容からカテゴリを3つ判定
    async categorizeReview(title, content) {
        try {
            // 入力値チェック（修正点）
            if (!title && !content) {
                return this.getErrorResponse();
            }
            
            const safeTitle = title || '';
            const safeContent = content || '';
            
            // 1. キーワードベースの分析
            const keywordCategories = this.analyzeByKeywords(safeTitle, safeContent);
            
            // 2. 文脈分析
            const contextCategories = this.analyzeByContext(safeTitle, safeContent);
            
            // 3. 感情分析
            const emotionCategories = this.analyzeByEmotion(safeTitle, safeContent);
            
            // 4. スコア計算と統合
            const allCategories = this.combineAndScore(
                keywordCategories,
                contextCategories,
                emotionCategories
            );
            
            // 5. 上位3つを選択
            const selectedCategories = this.selectTopCategories(allCategories);
            
            // 6. 最低1つは確保（fallback）
            const finalCategories = this.ensureMinimumCategories(selectedCategories, safeTitle, safeContent);
            
            return {
                success: true,
                categories: finalCategories,
                confidence: this.calculateOverallConfidence(finalCategories, allCategories)
            };
            
        } catch (error) {
            console.error('Error in categorizeReview:', error);
            return this.getErrorResponse();
        }
    }

    // エラー時のレスポンス（修正点）
    getErrorResponse() {
        return {
            success: false,
            categories: this.getFallbackCategories('', ''),
            confidence: 0.1
        };
    }

    // 1. キーワードベースの分析
    analyzeByKeywords(title, content) {
        const text = (title + ' ' + content).toLowerCase();
        const foundCategories = new Map();

        // 直接的なキーワードマッピング
        for (const [keyword, categories] of Object.entries(this.keywordMapping)) {
            if (text.includes(keyword.toLowerCase())) {
                const weight = this.weightedKeywords[keyword] || 1.0;
                categories.forEach(category => {
                    const currentScore = foundCategories.get(category) || 0;
                    foundCategories.set(category, currentScore + weight);
                });
            }
        }

        // カテゴリ名の直接一致
        this.categories.forEach(category => {
            const categoryWords = category.toLowerCase().split(/[・\s]+/);
            const matchCount = categoryWords.filter(word => 
                text.includes(word) && word.length > 1
            ).length;
            
            if (matchCount > 0) {
                const score = matchCount / categoryWords.length;
                const currentScore = foundCategories.get(category) || 0;
                foundCategories.set(category, currentScore + score);
            }
        });

        return foundCategories;
    }

    // 2. 文脈分析（シンプルな共起語分析）
    analyzeByContext(title, content) {
        const text = (title + ' ' + content).toLowerCase();
        const foundCategories = new Map();

        // 文脈パターンの定義
        const contextPatterns = {
            // 学校関連の文脈
            '学校系': {
                patterns: ['学校.*行け', '教室.*入れ', '先生.*話', '授業.*受け'],
                categories: ['担任教師との相談', '別室登校', '保健室登校']
            },
            
            // 相談系の文脈
            '相談系': {
                patterns: ['相談.*して', '話.*聞いて', 'アドバイス.*もらっ', '紹介.*され'],
                categories: ['スクールカウンセラー', '教育相談員', '心理カウンセラー']
            },
            
            // 代替教育の文脈
            '代替教育系': {
                patterns: ['違う.*方法', '別の.*学校', '家で.*勉強', 'オンライン.*学習'],
                categories: ['フリースクール', 'ホームスクーリング', 'オンライン学習']
            },
            
            // メンタルヘルスの文脈
            'メンタル系': {
                patterns: ['不安.*なっ', 'ストレス.*感じ', '眠れ.*ない', '食欲.*ない'],
                categories: ['不安症状', 'ストレス管理', '睡眠障害', '摂食障害']
            },
            
            // いじめ関連の文脈
            'いじめ系': {
                patterns: ['いじめ.*れ', '仲間外れ.*され', '悪口.*言われ', 'からかわ.*れ'],
                categories: ['いじめ被害', '仲間外れ', '悪口・陰口', '友人トラブル']
            }
        };

        // パターンマッチング
        for (const [contextType, data] of Object.entries(contextPatterns)) {
            for (const pattern of data.patterns) {
                try {
                    const regex = new RegExp(pattern);
                    if (regex.test(text)) {
                        data.categories.forEach(category => {
                            // カテゴリが実際に存在するかチェック（修正点）
                            if (this.categories.includes(category)) {
                                const currentScore = foundCategories.get(category) || 0;
                                foundCategories.set(category, currentScore + 1.5);
                            }
                        });
                    }
                } catch (regexError) {
                    console.warn('Regex error:', regexError);
                }
            }
        }

        return foundCategories;
    }

    // 3. 感情分析（ポジティブ/ネガティブな表現から推測）
    analyzeByEmotion(title, content) {
        const text = (title + ' ' + content).toLowerCase();
        const foundCategories = new Map();

        // 感情語辞書
        const emotionWords = {
            positive: {
                words: ['良かった', '助かった', '改善', '回復', '前進', '成功', '嬉しい', '安心'],
                categories: ['自信回復', '自己肯定感', 'ストレス管理']
            },
            negative: {
                words: ['辛い', '苦しい', '困った', '悩んでいる', 'どうしよう', '心配', '不安'],
                categories: ['不安症状', 'ストレス管理', '心理カウンセラー']
            },
            urgent: {
                words: ['緊急', 'すぐに', 'どうしたら', '助けて', '限界'],
                categories: ['24時間相談窓口', '児童相談所', '電話相談']
            }
        };

        // 感情語の検出
        for (const [emotion, data] of Object.entries(emotionWords)) {
            const matchCount = data.words.filter(word => text.includes(word)).length;
            if (matchCount > 0) {
                const score = matchCount * 0.8;
                data.categories.forEach(category => {
                    // カテゴリが実際に存在するかチェック（修正点）
                    if (this.categories.includes(category)) {
                        const currentScore = foundCategories.get(category) || 0;
                        foundCategories.set(category, currentScore + score);
                    }
                });
            }
        }

        return foundCategories;
    }

    // 4. スコア統合
    combineAndScore(keywordCategories, contextCategories, emotionCategories) {
        const allCategories = new Map();

        // 各分析結果を統合
        [keywordCategories, contextCategories, emotionCategories].forEach(categoryMap => {
            for (const [category, score] of categoryMap) {
                const currentScore = allCategories.get(category) || 0;
                allCategories.set(category, currentScore + score);
            }
        });

        // スコアの正規化
        const maxScore = Math.max(...Array.from(allCategories.values())) || 1;
        const normalizedCategories = new Map();
        
        for (const [category, score] of allCategories) {
            const normalizedScore = score / maxScore;
            if (normalizedScore >= this.minConfidenceScore) {
                normalizedCategories.set(category, normalizedScore);
            }
        }

        return normalizedCategories;
    }

    // 5. 上位カテゴリの選択
    selectTopCategories(allCategories) {
        // スコア順にソート
        const sortedCategories = Array.from(allCategories.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.maxCategories);

        return sortedCategories.map(([category, score]) => ({
            name: category,
            confidence: score
        }));
    }

    // 6. 最小カテゴリ数の保証
    ensureMinimumCategories(selectedCategories, title, content) {
        if (selectedCategories.length >= this.maxCategories) {
            return selectedCategories.map(cat => cat.name);
        }

        // 不足分をシンプルなルールで補完
        const fallbackCategories = this.getFallbackCategories(title, content);
        const currentCategoryNames = selectedCategories.map(cat => cat.name);
        
        // 重複を避けて追加
        const additionalCategories = fallbackCategories.filter(cat => 
            !currentCategoryNames.includes(cat)
        );

        const finalCategories = [
            ...currentCategoryNames,
            ...additionalCategories.slice(0, this.maxCategories - selectedCategories.length)
        ];

        return finalCategories.slice(0, this.maxCategories);
    }

    // フォールバック：シンプルなルールベース分類（修正点）
    getFallbackCategories(title, content) {
        const text = (title + ' ' + content).toLowerCase();
        const fallbackCategories = [];

        // 基本的なルール（存在確認付き）
        const rules = [
            { keywords: ['学校', '先生', '教室'], category: '担任教師との相談' },
            { keywords: ['相談', '話', '聞い'], category: '教育相談員' },
            { keywords: ['不安', '心配', '辛い'], category: '不安症状' },
            { keywords: ['いじめ', '友達', 'クラス'], category: 'いじめ被害' },
            { keywords: ['フリースクール'], category: 'フリースクール' },
            { keywords: ['家族', '親'], category: '親子関係' }
        ];

        for (const rule of rules) {
            if (rule.keywords.some(keyword => text.includes(keyword))) {
                if (this.categories.includes(rule.category)) {
                    fallbackCategories.push(rule.category);
                }
            }
        }

        // デフォルトカテゴリ（存在確認付き）
        if (fallbackCategories.length === 0) {
            const defaultCategories = ['家族会議', '生活リズム', '親子関係'];
            defaultCategories.forEach(cat => {
                if (this.categories.includes(cat)) {
                    fallbackCategories.push(cat);
                }
            });
            
            // それでも空の場合は最初の3つを使用
            if (fallbackCategories.length === 0) {
                fallbackCategories.push(...this.categories.slice(0, 3));
            }
        }

        return fallbackCategories.slice(0, 3);
    }

    // 全体の信頼度計算
    calculateOverallConfidence(finalCategories, allCategories) {
        if (finalCategories.length === 0) return 0;

        const totalScore = finalCategories.reduce((sum, categoryName) => {
            return sum + (allCategories.get(categoryName) || 0);
        }, 0);

        return Math.min(totalScore / finalCategories.length, 1.0);
    }

    // カテゴリの説明文生成
    generateCategoryExplanation(categories) {
        if (!categories || categories.length === 0) {
            return 'カテゴリを判定できませんでした。';
        }

        const explanations = {
            'スクールカウンセラー': '学校のカウンセラーに相談することで心理的サポートが受けられます',
            'フリースクール': '学校以外の学習環境で、お子さんのペースに合わせた教育が受けられます',
            'いじめ被害': 'いじめ問題の解決には、学校や専門機関との連携が重要です',
            '不安症状': '心理的な不安を和らげるための専門的なサポートが必要です'
            // 他のカテゴリの説明も追加可能
        };

        const categoryExplanations = categories
            .map(cat => explanations[cat] || `${cat}に関する情報です`)
            .join('、');

        return `選択されたカテゴリ: ${categories.join('、')}。${categoryExplanations}`;
    }

    // カテゴリ統計の取得
    getCategoryStatistics(reviews) {
        const categoryCount = new Map();
        const categoryCooccurrence = new Map();

        reviews.forEach(review => {
            if (review.categories && Array.isArray(review.categories)) {
                // 個別カテゴリのカウント
                review.categories.forEach(category => {
                    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
                });

                // カテゴリの共起関係
                for (let i = 0; i < review.categories.length; i++) {
                    for (let j = i + 1; j < review.categories.length; j++) {
                        const pair = [review.categories[i], review.categories[j]].sort().join(' + ');
                        categoryCooccurrence.set(pair, (categoryCooccurrence.get(pair) || 0) + 1);
                    }
                }
            }
        });

        return {
            mostUsedCategories: Array.from(categoryCount.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10),
            categoryCooccurrence: Array.from(categoryCooccurrence.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        };
    }

    // カテゴリ候補の提案（ユーザーが手動で修正する場合）
    suggestAlternativeCategories(currentCategories, title, content) {
        const allSuggestions = this.analyzeByKeywords(title, content);
        
        // 現在のカテゴリ以外を提案
        const alternatives = Array.from(allSuggestions.entries())
            .filter(([category, score]) => !currentCategories.includes(category))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category, score]) => ({
                name: category,
                confidence: score,
                reason: this.getCategorizationReason(category, title, content)
            }));

        return alternatives;
    }

    // カテゴリ判定理由の説明
    getCategorizationReason(category, title, content) {
        const text = (title + ' ' + content).toLowerCase();
        
        // 主要キーワードの検出
        for (const [keyword, categories] of Object.entries(this.keywordMapping)) {
            if (categories.includes(category) && text.includes(keyword.toLowerCase())) {
                return `「${keyword}」というキーワードから判定されました`;
            }
        }

        return 'AIが内容を分析して判定しました';
    }

    // 学習データの蓄積（将来の精度向上のため）
    recordCategorizationFeedback(reviewId, originalCategories, userModifiedCategories) {
        try {
            // 実装：ユーザーの修正情報を記録
            // Firebase移行時には、この情報を使ってAIの精度を向上させる
            const feedback = {
                reviewId,
                originalCategories,
                userModifiedCategories,
                timestamp: new Date().toISOString()
            };

            // localStorage に学習データとして保存
            const feedbackKey = 'category_feedback';
            const existingFeedback = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
            existingFeedback.push(feedback);
            
            // 最新100件のみ保持
            if (existingFeedback.length > 100) {
                existingFeedback.splice(0, existingFeedback.length - 100);
            }
            
            localStorage.setItem(feedbackKey, JSON.stringify(existingFeedback));

            return feedback;
        } catch (error) {
            console.error('Error recording feedback:', error);
            return null;
        }
    }

    // デバッグ用：現在の設定状況を確認
    getDebugInfo() {
        return {
            categoriesLoaded: this.categories.length,
            keywordMappingLoaded: Object.keys(this.keywordMapping).length,
            sampleCategories: this.categories.slice(0, 5),
            sampleKeywords: Object.keys(this.keywordMapping).slice(0, 5)
        };
    }
}