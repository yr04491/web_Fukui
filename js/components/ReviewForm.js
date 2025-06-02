/* ==================== 
   ReviewForm - 投稿フォーム制御クラス
==================== */

class ReviewForm {
    constructor(storage, validator, categoryManager) {
        this.storage = storage;
        this.validator = validator;
        this.categoryManager = categoryManager;
        
        this.form = document.getElementById('reviewForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageContainer = document.getElementById('messageContainer');
        
        this.isSubmitting = false;
        this.formData = {};
        this.hasUnsavedChanges = false;
        
        this.init();
    }

    // 初期化
    init() {
        try {
            // 必要な要素の存在確認
            if (!this.form || !this.submitBtn || !this.messageContainer) {
                throw new Error('Required DOM elements not found');
            }
            
            this.bindEvents();
            this.setupRealTimeValidation();
            this.setupCharacterCounters();
            this.setupBeforeUnloadWarning();
            this.initializeDraftRestore();
            
            console.log('ReviewForm initialized successfully');
        } catch (error) {
            console.error('ReviewForm initialization failed:', error);
        }
    }

    // イベントバインディング
    bindEvents() {
        // フォーム送信
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // リアルタイムバリデーション
        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => {
                this.clearFieldErrors(e.target);
                this.hasUnsavedChanges = true;
            });
        });

        // Enterキーでの送信防止（テキストエリア以外）
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
    }

    // リアルタイムバリデーション設定
    setupRealTimeValidation() {
        const fields = ['username', 'title', 'content'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => {
                    this.performRealTimeValidation(fieldName, field.value);
                });
            }
        });
    }

    // 文字数カウンター設定
    setupCharacterCounters() {
        // タイトル文字数カウンター
        const titleInput = document.getElementById('title');
        const titleCounter = document.getElementById('titleCounter');
        if (titleInput && titleCounter) {
            titleInput.addEventListener('input', () => {
                const count = titleInput.value.length;
                titleCounter.textContent = count;
                titleCounter.style.color = count > 45 ? '#e74c3c' : '#666';
            });
        }

        // 内容文字数カウンター
        const contentTextarea = document.getElementById('content');
        const contentCounter = document.getElementById('contentCounter');
        if (contentTextarea && contentCounter) {
            contentTextarea.addEventListener('input', () => {
                const count = contentTextarea.value.length;
                contentCounter.textContent = count;
                contentCounter.style.color = count > 950 ? '#e74c3c' : '#666';
            });
        }
    }

    // フォーム送信処理（修正点：エラーハンドリング強化）
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            console.log('Already submitting, ignoring additional submit');
            return;
        }
        
        try {
            this.isSubmitting = true;
            this.setSubmitButtonLoading(true);
            this.hideMessage();

            // フォームデータ取得
            const formData = this.getFormData();
            console.log('Form data collected:', formData);
            
            // バリデーション
            const validation = this.validator.validateReview(formData);
            if (!validation.isValid) {
                console.log('Validation failed:', validation.errors);
                this.displayValidationErrors(validation.errors);
                return;
            }

            // 投稿頻度チェック（修正点：エラーハンドリング追加）
            try {
                const frequencyCheck = this.validator.checkPostingFrequency ? 
                    this.validator.checkPostingFrequency(this.storage) : 
                    { allowed: true };
                    
                if (!frequencyCheck.allowed) {
                    this.showMessage(frequencyCheck.message, 'error');
                    return;
                }
            } catch (frequencyError) {
                console.warn('Frequency check failed:', frequencyError);
                // 頻度チェックが失敗しても投稿は続行
            }

            // サニタイゼーション
            const sanitizedData = this.validator.sanitizeReviewData ? 
                this.validator.sanitizeReviewData(formData) : formData;

            // AIカテゴリ判定
            this.showMessage('投稿内容を分析中...', 'info');
            console.log('Starting category analysis...');
            
            const categorization = await this.categoryManager.categorizeReview(
                sanitizedData.title, 
                sanitizedData.content
            );
            
            console.log('Category analysis result:', categorization);

            if (categorization.success) {
                sanitizedData.categories = categorization.categories;
            } else {
                // フォールバック
                console.log('Using fallback categories');
                sanitizedData.categories = this.categoryManager.getFallbackCategories ? 
                    this.categoryManager.getFallbackCategories(sanitizedData.title, sanitizedData.content) : 
                    ['家族会議', '親子関係'];
            }

            // データ保存
            this.showMessage('投稿を保存中...', 'info');
            console.log('Saving review data:', sanitizedData);
            
            const result = await this.storage.saveReview(sanitizedData);
            console.log('Save result:', result);

            if (result.success) {
                this.showMessage('投稿が完了しました！', 'success');
                this.resetForm();
                this.hasUnsavedChanges = false;
                
                // 一覧を更新（イベント発火）
                this.dispatchUpdateEvent(result.data);
                
                // 成功時のフィードバック
                if (result.data.categories && result.data.categories.length > 0) {
                    this.showCategorizationResult(result.data.categories, categorization.confidence || 0.5);
                }
                
            } else {
                throw new Error(result.error || '投稿に失敗しました');
            }

        } catch (error) {
            console.error('Submit error:', error);
            this.showMessage('投稿中にエラーが発生しました: ' + error.message, 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    // フォームデータ取得
    getFormData() {
        const elements = {
            username: document.getElementById('username'),
            childAge: document.getElementById('childAge'),
            title: document.getElementById('title'),
            content: document.getElementById('content')
        };

        // 要素の存在確認
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.warn(`Element ${key} not found`);
                elements[key] = { value: '' };
            }
        }

        return {
            username: elements.username.value ? elements.username.value.trim() : '',
            childAge: elements.childAge.value || '',
            title: elements.title.value ? elements.title.value.trim() : '',
            content: elements.content.value ? elements.content.value.trim() : ''
        };
    }

    // リアルタイムバリデーション実行
    performRealTimeValidation(fieldName, value) {
        try {
            if (this.validator && typeof this.validator.validateRealtime === 'function') {
                const validation = this.validator.validateRealtime(fieldName, value);
                const field = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');

                if (!validation.isValid && validation.errors.length > 0) {
                    this.showFieldError(field, errorElement, validation.errors[0]);
                } else {
                    this.clearFieldErrors(field);
                }
            }
        } catch (error) {
            console.warn('Real-time validation error:', error);
        }
    }

    // フィールドバリデーション
    validateField(field) {
        try {
            const fieldName = field.name || field.id;
            const value = field.value;
            
            if (this.validator && typeof this.validator.validateField === 'function') {
                const errors = this.validator.validateField(fieldName, value);
                const errorElement = document.getElementById(fieldName + 'Error');

                if (errors.length > 0) {
                    this.showFieldError(field, errorElement, errors[0]);
                    return false;
                } else {
                    this.clearFieldErrors(field);
                    return true;
                }
            }
            
            return true;
        } catch (error) {
            console.warn('Field validation error:', error);
            return true; // エラー時は通す
        }
    }

    // フィールドエラー表示
    showFieldError(field, errorElement, message) {
        if (field) {
            field.classList.add('error');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    // フィールドエラークリア
    clearFieldErrors(field) {
        if (field) {
            field.classList.remove('error');
            const fieldName = field.name || field.id;
            const errorElement = document.getElementById(fieldName + 'Error');
            if (errorElement) {
                errorElement.classList.add('hidden');
                errorElement.textContent = '';
            }
        }
    }

    // バリデーションエラー表示
    displayValidationErrors(errors) {
        let errorMessages = [];

        // 既存エラーをクリア
        this.clearAllFieldErrors();

        for (const [field, fieldErrors] of Object.entries(errors)) {
            if (field === 'global') {
                errorMessages.push(...fieldErrors);
            } else {
                const fieldElement = document.getElementById(field);
                const errorElement = document.getElementById(field + 'Error');
                
                if (fieldElement && errorElement && fieldErrors.length > 0) {
                    this.showFieldError(fieldElement, errorElement, fieldErrors[0]);
                }
                
                errorMessages.push(`${this.getFieldLabel(field)}: ${fieldErrors[0]}`);
            }
        }

        if (errorMessages.length > 0) {
            this.showMessage('入力内容を確認してください', 'error');
        }
    }

    // 全フィールドエラークリア
    clearAllFieldErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
            el.classList.remove('error');
        });
    }

    // フィールドラベル取得
    getFieldLabel(fieldName) {
        const labels = {
            username: 'お名前',
            childAge: 'お子さんの年齢', 
            title: 'タイトル',
            content: '口コミ内容'
        };
        return labels[fieldName] || fieldName;
    }

    // メッセージ表示
    showMessage(message, type = 'info') {
        if (this.messageContainer) {
            this.messageContainer.textContent = message;
            this.messageContainer.className = `message-container ${type}`;
            this.messageContainer.classList.remove('hidden');

            // 自動非表示（エラー以外）
            if (type !== 'error') {
                setTimeout(() => {
                    this.hideMessage();
                }, 3000);
            }
        }
    }

    // メッセージ非表示
    hideMessage() {
        if (this.messageContainer) {
            this.messageContainer.classList.add('hidden');
        }
    }

    // 送信ボタンのローディング状態
    setSubmitButtonLoading(loading) {
        if (!this.submitBtn) return;
        
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        if (loading) {
            this.submitBtn.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnLoading) btnLoading.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoading) btnLoading.classList.add('hidden');
        }
    }

    // フォームリセット
    resetForm() {
        if (this.form) {
            this.form.reset();
            
            // 文字カウンターリセット
            const titleCounter = document.getElementById('titleCounter');
            const contentCounter = document.getElementById('contentCounter');
            if (titleCounter) titleCounter.textContent = '0';
            if (contentCounter) contentCounter.textContent = '0';

            // エラー状態クリア
            this.clearAllFieldErrors();
            
            // 下書きクリア
            this.clearDraft();
        }
    }

    // カテゴリ判定結果表示
    showCategorizationResult(categories, confidence) {
        if (!categories || categories.length === 0) return;

        const explanation = this.categoryManager.generateCategoryExplanation ? 
            this.categoryManager.generateCategoryExplanation(categories) : 
            `選択されたカテゴリ: ${categories.join('、')}`;
            
        const confidenceText = confidence > 0.7 ? '（高い信頼度）' : 
                              confidence > 0.4 ? '（中程度の信頼度）' : '（低い信頼度）';

        setTimeout(() => {
            this.showMessage(
                `自動分類: ${categories.join('、')} ${confidenceText}`, 
                'info'
            );
        }, 2000);
    }

    // 更新イベント発火（修正点：イベント名統一）
    dispatchUpdateEvent(newReview) {
        try {
            const event = new CustomEvent('reviewAdded', {
                detail: { review: newReview },
                bubbles: true
            });
            document.dispatchEvent(event);
            console.log('Review added event dispatched:', newReview.id);
        } catch (error) {
            console.error('Error dispatching update event:', error);
        }
    }

    // フォーム状態の保存（下書き機能）
    saveDraft() {
        try {
            const formData = this.getFormData();
            const hasContent = Object.values(formData).some(value => 
                typeof value === 'string' && value.trim() !== ''
            );
            
            if (hasContent) {
                const draftData = {
                    ...formData,
                    savedAt: new Date().toISOString()
                };
                localStorage.setItem('review_draft', JSON.stringify(draftData));
                console.log('Draft saved');
            }
        } catch (error) {
            console.warn('Error saving draft:', error);
        }
    }

    // 下書きの復元
    restoreDraft() {
        try {
            const draft = localStorage.getItem('review_draft');
            if (draft) {
                const draftData = JSON.parse(draft);
                const savedAt = new Date(draftData.savedAt);
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

                // 24時間以内の下書きのみ復元
                if (savedAt > oneDayAgo) {
                    if (confirm('保存された下書きがあります。復元しますか？')) {
                        const elements = {
                            username: document.getElementById('username'),
                            childAge: document.getElementById('childAge'),
                            title: document.getElementById('title'),
                            content: document.getElementById('content')
                        };

                        // 要素が存在する場合のみ値を設定
                        if (elements.username) elements.username.value = draftData.username || '';
                        if (elements.childAge) elements.childAge.value = draftData.childAge || '';
                        if (elements.title) elements.title.value = draftData.title || '';
                        if (elements.content) elements.content.value = draftData.content || '';

                        // 文字カウンター更新
                        const titleCounter = document.getElementById('titleCounter');
                        const contentCounter = document.getElementById('contentCounter');
                        if (titleCounter) titleCounter.textContent = (draftData.title || '').length;
                        if (contentCounter) contentCounter.textContent = (draftData.content || '').length;

                        this.showMessage('下書きを復元しました', 'info');
                    }
                }
                
                // 使用済み下書きを削除
                this.clearDraft();
            }
        } catch (error) {
            console.warn('Error restoring draft:', error);
        }
    }

    // 下書きクリア
    clearDraft() {
        try {
            localStorage.removeItem('review_draft');
        } catch (error) {
            console.warn('Error clearing draft:', error);
        }
    }

    // フォーム離脱時の警告
    setupBeforeUnloadWarning() {
        // 入力変更の監視
        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.hasUnsavedChanges = true;
            });
        });

        // フォーム送信時は警告無効
        this.form.addEventListener('submit', () => {
            this.hasUnsavedChanges = false;
        });

        // ページ離脱前の警告
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                this.saveDraft();
                e.preventDefault();
                e.returnValue = '入力中の内容が失われますが、よろしいですか？';
                return e.returnValue;
            }
        });
    }

    // 初期化時の下書き復元チェック
    initializeDraftRestore() {
        // ページ読み込み完了後に下書きチェック
        setTimeout(() => {
            this.restoreDraft();
        }, 500);
    }

    // アクセシビリティ向上
    enhanceAccessibility() {
        // フォーカス管理
        const firstInput = this.form.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }

        // キーボードナビゲーション
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Tabキーでのフォーカス移動の最適化
                this.handleTabNavigation(e);
            }
        });

        // スクリーンリーダー対応
        this.form.setAttribute('role', 'form');
        this.form.setAttribute('aria-label', '口コミ投稿フォーム');
    }

    // Tabナビゲーション制御
    handleTabNavigation(event) {
        const focusableElements = this.form.querySelectorAll(
            'input, select, textarea, button'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    // エラー統計の取得
    getValidationStatistics() {
        try {
            const statsData = localStorage.getItem('validation_stats');
            if (statsData) {
                return JSON.parse(statsData);
            }
        } catch (error) {
            console.warn('Error getting validation statistics:', error);
        }
        
        return {
            totalAttempts: 0,
            fieldErrors: {},
            commonErrors: []
        };
    }

    // エラー統計の更新
    updateValidationStatistics(errors) {
        try {
            const stats = this.getValidationStatistics();
            stats.totalAttempts++;

            for (const [field, fieldErrors] of Object.entries(errors)) {
                if (!stats.fieldErrors[field]) {
                    stats.fieldErrors[field] = 0;
                }
                stats.fieldErrors[field]++;
                
                fieldErrors.forEach(error => {
                    const existingError = stats.commonErrors.find(e => e.message === error);
                    if (existingError) {
                        existingError.count++;
                    } else {
                        stats.commonErrors.push({ message: error, count: 1 });
                    }
                });
            }

            localStorage.setItem('validation_stats', JSON.stringify(stats));
        } catch (error) {
            console.warn('Error updating validation statistics:', error);
        }
    }

    // デバッグ用メソッド
    debug() {
        return {
            formData: this.getFormData(),
            isSubmitting: this.isSubmitting,
            hasUnsavedChanges: this.hasUnsavedChanges,
            validationStats: this.getValidationStatistics(),
            draftExists: !!localStorage.getItem('review_draft')
        };
    }
}