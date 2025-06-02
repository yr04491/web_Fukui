/* ==================== 
   ReviewValidator - バリデーションクラス
==================== */

class ReviewValidator {
    constructor() {
        this.rules = {
            username: {
                required: true,
                minLength: 1,
                maxLength: 20,
                pattern: null
            },
            childAge: {
                required: true,
                allowedValues: [
                    "未就学児",
                    "小学生低学年",
                    "小学生高学年", 
                    "中学生",
                    "高校生",
                    "18歳以上"
                ]
            },
            title: {
                required: true,
                minLength: 1,
                maxLength: 50,
                pattern: null
            },
            content: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                pattern: null
            }
        };

        this.errorMessages = {
            required: 'この項目は必須です',
            minLength: '文字数が足りません（最低{min}文字）',
            maxLength: '文字数が多すぎます（最大{max}文字）',
            pattern: '入力形式が正しくありません',
            allowedValues: '選択肢から選んでください',
            profanity: '不適切な表現が含まれています',
            spam: 'スパムと判定されました'
        };

        // 禁止ワード（基本的なもの）
        this.profanityWords = [
            '死ね', 'バカ', 'アホ', 'クソ', '殺す',
            // 実際の運用では外部サービスのAPIを使用することを推奨
        ];

        // スパム判定パターン
        this.spamPatterns = [
            /https?:\/\/[^\s]+/g, // URL
            /[0-9]{10,}/g, // 長い数字（電話番号など）
            /(.)\1{4,}/g, // 同じ文字の連続
            /[!！]{3,}/g, // 感嘆符の連続
        ];
    }

    // メインバリデーション関数（修正点：エラーハンドリング強化）
    validateReview(data) {
        try {
            const errors = {};
            let isValid = true;

            // 入力データの安全性チェック
            if (!data || typeof data !== 'object') {
                return {
                    isValid: false,
                    errors: { global: ['無効なデータです'] },
                    hasErrors: true
                };
            }

            // 各フィールドのバリデーション
            for (const [field, value] of Object.entries(data)) {
                try {
                    const fieldErrors = this.validateField(field, value);
                    if (fieldErrors.length > 0) {
                        errors[field] = fieldErrors;
                        isValid = false;
                    }
                } catch (fieldError) {
                    console.warn(`Validation error for field ${field}:`, fieldError);
                    errors[field] = ['バリデーションエラーが発生しました'];
                    isValid = false;
                }
            }

            // 全体的なバリデーション
            try {
                const globalErrors = this.validateGlobal(data);
                if (globalErrors.length > 0) {
                    errors.global = globalErrors;
                    isValid = false;
                }
            } catch (globalError) {
                console.warn('Global validation error:', globalError);
            }

            return {
                isValid,
                errors,
                hasErrors: !isValid
            };
        } catch (error) {
            console.error('Validation process failed:', error);
            return {
                isValid: false,
                errors: { global: ['バリデーション処理中にエラーが発生しました'] },
                hasErrors: true
            };
        }
    }

    // 個別フィールドのバリデーション（修正点：安全性向上）
    validateField(fieldName, value) {
        try {
            const errors = [];
            const rule = this.rules[fieldName];
            
            if (!rule) {
                console.warn(`No validation rule found for field: ${fieldName}`);
                return errors;
            }

            // 必須チェック
            if (rule.required && this.isEmpty(value)) {
                errors.push(this.errorMessages.required);
                return errors; // 必須エラーがある場合は他のチェックをスキップ
            }

            // 値が空の場合で必須でない場合はOK
            if (this.isEmpty(value) && !rule.required) {
                return errors;
            }

            const trimmedValue = typeof value === 'string' ? value.trim() : value;

            // 最小長チェック
            if (rule.minLength && typeof trimmedValue === 'string' && trimmedValue.length < rule.minLength) {
                errors.push(this.errorMessages.minLength.replace('{min}', rule.minLength));
            }

            // 最大長チェック
            if (rule.maxLength && typeof trimmedValue === 'string' && trimmedValue.length > rule.maxLength) {
                errors.push(this.errorMessages.maxLength.replace('{max}', rule.maxLength));
            }

            // パターンチェック
            if (rule.pattern && typeof trimmedValue === 'string' && !rule.pattern.test(trimmedValue)) {
                errors.push(this.errorMessages.pattern);
            }

            // 許可値チェック
            if (rule.allowedValues && !rule.allowedValues.includes(value)) {
                errors.push(this.errorMessages.allowedValues);
            }

            // フィールド固有のバリデーション
            switch (fieldName) {
                case 'username':
                    errors.push(...this.validateUsername(trimmedValue));
                    break;
                case 'title':
                    errors.push(...this.validateTitle(trimmedValue));
                    break;
                case 'content':
                    errors.push(...this.validateContent(trimmedValue));
                    break;
            }

            return errors;
        } catch (error) {
            console.error(`Field validation error for ${fieldName}:`, error);
            return ['バリデーションエラーが発生しました'];
        }
    }

    // ユーザーネームのバリデーション
    validateUsername(username) {
        const errors = [];

        try {
            if (typeof username !== 'string') {
                errors.push('ユーザーネームは文字列で入力してください');
                return errors;
            }

            // 不適切な表現チェック
            if (this.containsProfanity(username)) {
                errors.push(this.errorMessages.profanity);
            }

            // 英数字・ひらがな・カタカナ・漢字のみ許可
            const allowedPattern = /^[a-zA-Z0-9ひらがなカタカナ漢字\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+$/;
            if (!allowedPattern.test(username)) {
                errors.push('ニックネームに使用できない文字が含まれています');
            }
        } catch (error) {
            console.error('Username validation error:', error);
            errors.push('ユーザーネームの検証中にエラーが発生しました');
        }

        return errors;
    }

    // タイトルのバリデーション
    validateTitle(title) {
        const errors = [];

        try {
            if (typeof title !== 'string') {
                errors.push('タイトルは文字列で入力してください');
                return errors;
            }

            // 不適切な表現チェック
            if (this.containsProfanity(title)) {
                errors.push(this.errorMessages.profanity);
            }

            // スパムチェック
            if (this.isSpam(title)) {
                errors.push(this.errorMessages.spam);
            }

            // 全角英数字の制限（タイトルは読みやすさ重視）
            const suspiciousPattern = /[Ａ-Ｚａ-ｚ０-９]{10,}/;
            if (suspiciousPattern.test(title)) {
                errors.push('タイトルが読みにくい形式です');
            }
        } catch (error) {
            console.error('Title validation error:', error);
            errors.push('タイトルの検証中にエラーが発生しました');
        }

        return errors;
    }

    // 内容のバリデーション
    validateContent(content) {
        const errors = [];

        try {
            if (typeof content !== 'string') {
                errors.push('口コミ内容は文字列で入力してください');
                return errors;
            }

            // 不適切な表現チェック
            if (this.containsProfanity(content)) {
                errors.push(this.errorMessages.profanity);
            }

            // スパムチェック
            if (this.isSpam(content)) {
                errors.push(this.errorMessages.spam);
            }

            // 改行の制限
            const lineCount = content.split('\n').length;
            if (lineCount > 30) {
                errors.push('改行が多すぎます（最大30行）');
            }

            // 同じ文字・単語の繰り返しチェック
            if (this.hasExcessiveRepetition(content)) {
                errors.push('同じ文字や単語の繰り返しが多すぎます');
            }
        } catch (error) {
            console.error('Content validation error:', error);
            errors.push('口コミ内容の検証中にエラーが発生しました');
        }

        return errors;
    }

    // 全体的なバリデーション
    validateGlobal(data) {
        const errors = [];

        try {
            // タイトルと内容の関連性チェック（簡易版）
            if (data.title && data.content) {
                const titleWords = this.extractKeywords(data.title);
                const contentWords = this.extractKeywords(data.content);
                
                const hasCommonWords = titleWords.some(word => 
                    contentWords.some(cWord => cWord.includes(word) || word.includes(cWord))
                );

                if (!hasCommonWords && data.title.length > 10 && data.content.length > 50) {
                    // タイトルと内容が全く関連していない可能性
                    // 警告レベル（エラーではない）
                    // errors.push('タイトルと内容の関連性を確認してください');
                }
            }
        } catch (error) {
            console.error('Global validation error:', error);
        }

        return errors;
    }

    // リアルタイムバリデーション（入力中）
    validateRealtime(fieldName, value) {
        try {
            const rule = this.rules[fieldName];
            const errors = [];

            if (!rule) return { isValid: true, errors: [] };

            // 文字数チェック
            if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
                errors.push(this.errorMessages.maxLength.replace('{max}', rule.maxLength));
            }

            // 不適切表現の即座チェック
            if (fieldName !== 'childAge' && typeof value === 'string' && this.containsProfanity(value)) {
                errors.push(this.errorMessages.profanity);
            }

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        } catch (error) {
            console.error('Real-time validation error:', error);
            return { isValid: true, errors: [] }; // エラー時は通す
        }
    }

    // ヘルパー関数
    isEmpty(value) {
        return value === null || value === undefined || 
               (typeof value === 'string' && value.trim() === '');
    }

    containsProfanity(text) {
        try {
            if (!text || typeof text !== 'string') return false;
            const lowerText = text.toLowerCase();
            return this.profanityWords.some(word => lowerText.includes(word));
        } catch (error) {
            console.error('Profanity check error:', error);
            return false;
        }
    }

    isSpam(text) {
        try {
            if (!text || typeof text !== 'string') return false;
            return this.spamPatterns.some(pattern => {
                try {
                    return pattern.test(text);
                } catch (patternError) {
                    console.warn('Spam pattern test error:', patternError);
                    return false;
                }
            });
        } catch (error) {
            console.error('Spam check error:', error);
            return false;
        }
    }

    hasExcessiveRepetition(text) {
        try {
            if (!text || typeof text !== 'string') return false;
            
            // 同じ文字が5回以上連続
            if (/(.)\1{4,}/.test(text)) return true;
            
            // 同じ単語が3回以上連続
            const words = text.split(/\s+/);
            for (let i = 0; i < words.length - 2; i++) {
                if (words[i] === words[i + 1] && words[i] === words[i + 2]) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Repetition check error:', error);
            return false;
        }
    }

    extractKeywords(text) {
        try {
            if (!text || typeof text !== 'string') return [];
            
            // 簡易的なキーワード抽出
            return text
                .replace(/[、。！？\s]/g, ' ')
                .split(' ')
                .filter(word => word.length >= 2)
                .slice(0, 10); // 最大10個
        } catch (error) {
            console.error('Keyword extraction error:', error);
            return [];
        }
    }

    // エラーメッセージの取得
    getErrorMessage(errorType, params = {}) {
        try {
            let message = this.errorMessages[errorType] || 'エラーが発生しました';
            
            // パラメータの置換
            for (const [key, value] of Object.entries(params)) {
                message = message.replace(`{${key}}`, value);
            }
            
            return message;
        } catch (error) {
            console.error('Error getting error message:', error);
            return 'エラーが発生しました';
        }
    }

    // バリデーションルールの動的更新
    updateRule(fieldName, newRule) {
        try {
            if (this.rules[fieldName]) {
                this.rules[fieldName] = { ...this.rules[fieldName], ...newRule };
            } else {
                this.rules[fieldName] = newRule;
            }
        } catch (error) {
            console.error('Error updating validation rule:', error);
        }
    }

    // 禁止ワードの追加
    addProfanityWord(word) {
        try {
            if (typeof word === 'string' && !this.profanityWords.includes(word)) {
                this.profanityWords.push(word);
            }
        } catch (error) {
            console.error('Error adding profanity word:', error);
        }
    }

    // 投稿頻度制限チェック（DoS対策）
    checkPostingFrequency(storage) {
        try {
            if (!storage || typeof storage.loadFromStorage !== 'function') {
                console.warn('Storage not available for frequency check');
                return { allowed: true };
            }

            const recentPosts = storage.loadFromStorage()
                .filter(review => {
                    try {
                        const postTime = new Date(review.timestamp);
                        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                        return postTime > oneHourAgo;
                    } catch (dateError) {
                        console.warn('Invalid timestamp in review:', review.timestamp);
                        return false;
                    }
                });

            // 1時間に3投稿以上は制限
            if (recentPosts.length >= 3) {
                return {
                    allowed: false,
                    message: '投稿頻度が高すぎます。1時間後に再度お試しください。'
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('Error checking posting frequency:', error);
            return { allowed: true }; // エラー時は許可
        }
    }

    // サニタイゼーション（XSS対策）
    sanitizeInput(input) {
        try {
            if (typeof input !== 'string') return input;
            
            return input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        } catch (error) {
            console.error('Error sanitizing input:', error);
            return String(input || '');
        }
    }

    // 入力データのサニタイゼーション
    sanitizeReviewData(data) {
        try {
            const sanitized = {};
            
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'string') {
                    sanitized[key] = this.sanitizeInput(value);
                } else {
                    sanitized[key] = value;
                }
            }
            
            return sanitized;
        } catch (error) {
            console.error('Error sanitizing review data:', error);
            return data; // エラー時は元データを返す
        }
    }

    // バリデーション統計の取得
    getValidationStatistics() {
        try {
            const statsData = localStorage.getItem('validation_statistics');
            if (statsData) {
                return JSON.parse(statsData);
            }
        } catch (error) {
            console.error('Error getting validation statistics:', error);
        }

        return {
            totalValidations: 0,
            failedValidations: 0,
            fieldErrors: {},
            commonErrors: [],
            lastReset: new Date().toISOString()
        };
    }

    // バリデーション統計の更新
    updateValidationStatistics(isValid, errors = {}) {
        try {
            const stats = this.getValidationStatistics();
            stats.totalValidations++;
            
            if (!isValid) {
                stats.failedValidations++;
                
                // フィールド別エラー統計
                for (const [field, fieldErrors] of Object.entries(errors)) {
                    if (!stats.fieldErrors[field]) {
                        stats.fieldErrors[field] = 0;
                    }
                    stats.fieldErrors[field]++;
                    
                    // 共通エラー統計
                    if (Array.isArray(fieldErrors)) {
                        fieldErrors.forEach(error => {
                            const existingError = stats.commonErrors.find(e => e.message === error);
                            if (existingError) {
                                existingError.count++;
                            } else {
                                stats.commonErrors.push({ message: error, count: 1 });
                            }
                        });
                    }
                }
            }

            // 統計データを保存（最新1000件まで）
            if (stats.totalValidations > 1000) {
                stats.totalValidations = 1000;
                stats.failedValidations = Math.min(stats.failedValidations, 1000);
                stats.lastReset = new Date().toISOString();
            }

            localStorage.setItem('validation_statistics', JSON.stringify(stats));
        } catch (error) {
            console.error('Error updating validation statistics:', error);
        }
    }

    // バリデーション設定のエクスポート
    exportValidationConfig() {
        try {
            return {
                rules: this.rules,
                errorMessages: this.errorMessages,
                profanityWords: this.profanityWords.length, // 実際の単語は秘匿
                spamPatterns: this.spamPatterns.length,
                statistics: this.getValidationStatistics()
            };
        } catch (error) {
            console.error('Error exporting validation config:', error);
            return null;
        }
    }

    // バリデーション設定のインポート
    importValidationConfig(config) {
        try {
            if (!config || typeof config !== 'object') {
                throw new Error('Invalid configuration format');
            }

            if (config.rules) {
                this.rules = { ...this.rules, ...config.rules };
            }

            if (config.errorMessages) {
                this.errorMessages = { ...this.errorMessages, ...config.errorMessages };
            }

            console.log('Validation configuration imported successfully');
            return true;
        } catch (error) {
            console.error('Error importing validation config:', error);
            return false;
        }
    }

    // カスタムバリデーター追加
    addCustomValidator(fieldName, validatorFunction, errorMessage) {
        try {
            if (typeof validatorFunction !== 'function') {
                throw new Error('Validator must be a function');
            }

            if (!this.customValidators) {
                this.customValidators = {};
            }

            this.customValidators[fieldName] = {
                validator: validatorFunction,
                errorMessage: errorMessage || 'カスタムバリデーションエラー'
            };

            console.log(`Custom validator added for field: ${fieldName}`);
        } catch (error) {
            console.error('Error adding custom validator:', error);
        }
    }

    // カスタムバリデーター実行
    runCustomValidators(fieldName, value) {
        const errors = [];

        try {
            if (this.customValidators && this.customValidators[fieldName]) {
                const { validator, errorMessage } = this.customValidators[fieldName];
                
                if (!validator(value)) {
                    errors.push(errorMessage);
                }
            }
        } catch (error) {
            console.error('Error running custom validators:', error);
            errors.push('カスタムバリデーションでエラーが発生しました');
        }

        return errors;
    }

    // バリデーションルールのリセット
    resetValidationRules() {
        try {
            // デフォルトルールに戻す
            this.rules = {
                username: {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                    pattern: null
                },
                childAge: {
                    required: true,
                    allowedValues: [
                        "未就学児",
                        "小学生低学年",
                        "小学生高学年", 
                        "中学生",
                        "高校生",
                        "18歳以上"
                    ]
                },
                title: {
                    required: true,
                    minLength: 1,
                    maxLength: 50,
                    pattern: null
                },
                content: {
                    required: true,
                    minLength: 10,
                    maxLength: 1000,
                    pattern: null
                }
            };

            // カスタムバリデーターもクリア
            this.customValidators = {};

            console.log('Validation rules reset to defaults');
        } catch (error) {
            console.error('Error resetting validation rules:', error);
        }
    }

    // デバッグ用メソッド
    debug() {
        return {
            rules: this.rules,
            errorMessages: this.errorMessages,
            profanityWordsCount: this.profanityWords.length,
            spamPatternsCount: this.spamPatterns.length,
            customValidatorsCount: this.customValidators ? Object.keys(this.customValidators).length : 0,
            statistics: this.getValidationStatistics()
        };
    }

    // バリデーションのテスト実行
    runValidationTests() {
        try {
            const testCases = [
                // 正常なデータ
                {
                    name: '正常なデータ',
                    data: {
                        username: 'テストユーザー',
                        childAge: '中学生',
                        title: 'テストタイトル',
                        content: 'これはテスト用の口コミ内容です。十分な文字数があります。'
                    },
                    expectedValid: true
                },
                // 必須フィールド不足
                {
                    name: '必須フィールド不足',
                    data: {
                        username: '',
                        childAge: '中学生',
                        title: 'テストタイトル',
                        content: 'テスト内容'
                    },
                    expectedValid: false
                },
                // 文字数超過
                {
                    name: '文字数超過',
                    data: {
                        username: 'テストユーザー',
                        childAge: '中学生',
                        title: 'a'.repeat(51), // 50文字超過
                        content: 'テスト内容です。'
                    },
                    expectedValid: false
                }
            ];

            const results = testCases.map(testCase => {
                const result = this.validateReview(testCase.data);
                const passed = result.isValid === testCase.expectedValid;
                
                return {
                    name: testCase.name,
                    passed,
                    expected: testCase.expectedValid,
                    actual: result.isValid,
                    errors: result.errors
                };
            });

            console.log('Validation test results:', results);
            return results;
        } catch (error) {
            console.error('Error running validation tests:', error);
            return [];
        }
    }
}