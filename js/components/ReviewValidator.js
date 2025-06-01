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

    // メインバリデーション関数
    validateReview(data) {
        const errors = {};
        let isValid = true;

        // 各フィールドのバリデーション
        for (const [field, value] of Object.entries(data)) {
            const fieldErrors = this.validateField(field, value);
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
                isValid = false;
            }
        }

        // 全体的なバリデーション
        const globalErrors = this.validateGlobal(data);
        if (globalErrors.length > 0) {
            errors.global = globalErrors;
            isValid = false;
        }

        return {
            isValid,
            errors,
            hasErrors: !isValid
        };
    }

    // 個別フィールドのバリデーション
    validateField(fieldName, value) {
        const errors = [];
        const rule = this.rules[fieldName];
        
        if (!rule) return errors;

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
        if (rule.minLength && trimmedValue.length < rule.minLength) {
            errors.push(this.errorMessages.minLength.replace('{min}', rule.minLength));
        }

        // 最大長チェック
        if (rule.maxLength && trimmedValue.length > rule.maxLength) {
            errors.push(this.errorMessages.maxLength.replace('{max}', rule.maxLength));
        }

        // パターンチェック
        if (rule.pattern && !rule.pattern.test(trimmedValue)) {
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
    }

    // ユーザーネームのバリデーション
    validateUsername(username) {
        const errors = [];

        // 不適切な表現チェック
        if (this.containsProfanity(username)) {
            errors.push(this.errorMessages.profanity);
        }

        // 英数字・ひらがな・カタカナ・漢字のみ許可
        const allowedPattern = /^[a-zA-Z0-9ひらがなカタカナ漢字\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+$/;
        if (!allowedPattern.test(username)) {
            errors.push('ニックネームに使用できない文字が含まれています');
        }

        return errors;
    }

    // タイトルのバリデーション
    validateTitle(title) {
        const errors = [];

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

        return errors;
    }

    // 内容のバリデーション
    validateContent(content) {
        const errors = [];

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

        return errors;
    }

    // 全体的なバリデーション
    validateGlobal(data) {
        const errors = [];

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

        return errors;
    }

    // リアルタイムバリデーション（入力中）
    validateRealtime(fieldName, value) {
        const rule = this.rules[fieldName];
        const errors = [];

        if (!rule) return { isValid: true, errors: [] };

        // 必須チェック（フォーカスアウト時のみ）
        // 文字数チェック
        if (rule.maxLength && value.length > rule.maxLength) {
            errors.push(this.errorMessages.maxLength.replace('{max}', rule.maxLength));
        }

        // 不適切表現の即座チェック
        if (fieldName !== 'childAge' && this.containsProfanity(value)) {
            errors.push(this.errorMessages.profanity);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ヘルパー関数
    isEmpty(value) {
        return value === null || value === undefined || 
               (typeof value === 'string' && value.trim() === '');
    }

    containsProfanity(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return this.profanityWords.some(word => lowerText.includes(word));
    }

    isSpam(text) {
        if (!text) return false;
        return this.spamPatterns.some(pattern => pattern.test(text));
    }

    hasExcessiveRepetition(text) {
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
    }

    extractKeywords(text) {
        if (!text) return [];
        
        // 簡易的なキーワード抽出
        return text
            .replace(/[、。！？\s]/g, ' ')
            .split(' ')
            .filter(word => word.length >= 2)
            .slice(0, 10); // 最大10個
    }

    // エラーメッセージの取得
    getErrorMessage(errorType, params = {}) {
        let message = this.errorMessages[errorType] || 'エラーが発生しました';
        
        // パラメータの置換
        for (const [key, value] of Object.entries(params)) {
            message = message.replace(`{${key}}`, value);
        }
        
        return message;
    }

    // バリデーションルールの動的更新
    updateRule(fieldName, newRule) {
        this.rules[fieldName] = { ...this.rules[fieldName], ...newRule };
    }

    // 禁止ワードの追加
    addProfanityWord(word) {
        if (!this.profanityWords.includes(word)) {
            this.profanityWords.push(word);
        }
    }

    // 投稿頻度制限チェック（DoS対策）
    checkPostingFrequency(storage) {
        const recentPosts = storage.loadFromStorage()
            .filter(review => {
                const postTime = new Date(review.timestamp);
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                return postTime > oneHourAgo;
            });

        // 1時間に3投稿以上は制限
        if (recentPosts.length >= 3) {
            return {
                allowed: false,
                message: '投稿頻度が高すぎます。1時間後に再度お試しください。'
            };
        }

        return { allowed: true };
    }

    // サニタイゼーション（XSS対策）
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // 入力データのサニタイゼーション
    sanitizeReviewData(data) {
        const sanitized = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeInput(value);
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    }
}