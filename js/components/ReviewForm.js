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
        
        this.init();
    }

    // 初期化
    init() {
        this.bindEvents();
        this.setupRealTimeValidation();
        this.setupCharacterCounters();
    }

    // イベントバインディング
    bindEvents() {
        // フォーム送信
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // リアルタイムバリデーション
        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldErrors(e.target));
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

    // フォーム送信処理
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        try {
            this.isSubmitting = true;
            this.setSubmitButtonLoading(true);
            this.hideMessage();

            // フォームデータ取得
            const formData = this.getFormData();
            
            // バリデーション
            const validation = this.validator.validateReview(formData);
            if (!validation.isValid) {
                this.displayValidationErrors(validation.errors);
                return;
            }

            // 投稿頻度チェック
            const frequencyCheck = this.validator.checkPostingFrequency(this.storage);
            if (!frequencyCheck.allowed) {
                this.showMessage(frequencyCheck.message, 'error');
                return;
            }

            // サニタイゼーション
            const sanitizedData = this.validator.sanitizeReviewData(formData);

            // AIカテゴリ判定
            this.showMessage('投稿内容を分析中...', 'info');
            const categorization = await this.categoryManager.categorizeReview(
                sanitizedData.title, 
                sanitizedData.content
            );

            if (categorization.success) {
                sanitizedData.categories = categorization.categories;
            } else {
                // フォールバック
                sanitizedData.categories = this.categoryManager.getFallbackCategories(
                    sanitizedData.title, 
                    sanitizedData.content
                );
            }

            // データ保存
            this.showMessage('投稿を保存中...', 'info');
            const result = await this.storage.saveReview(sanitizedData);

            if (result.success) {
                this.showMessage('投稿が完了しました！', 'success');
                this.resetForm();
                
                // 一覧を更新（イベント発火）
                this.dispatchUpdateEvent(result.data);
                
                // 成功時のフィードバック
                this.showCategorizationResult(result.data.categories, categorization.confidence);
                
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
        return {
            username: document.getElementById('username').value.trim(),
            childAge: document.getElementById('childAge').value,
            title: document.getElementById('title').value.trim(),
            content: document.getElementById('content').value.trim()
        };
    }

    // リアルタイムバリデーション実行
    performRealTimeValidation(fieldName, value) {
        const validation = this.validator.validateRealtime(fieldName, value);
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (!validation.isValid && validation.errors.length > 0) {
            this.showFieldError(field, errorElement, validation.errors[0]);
        } else {
            this.clearFieldErrors(field);
        }
    }

    // フィールドバリデーション
    validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value;
        
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

    // フィールドエラー表示
    showFieldError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    // フィールドエラークリア
    clearFieldErrors(field) {
        field.classList.remove('error');
        const fieldName = field.name || field.id;
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }
    }

    // バリデーションエラー表示
    displayValidationErrors(errors) {
        let errorMessages = [];

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

    // メッセージ非表示
    hideMessage() {
        this.messageContainer.classList.add('hidden');
    }

    // 送信ボタンのローディング状態
    setSubmitButtonLoading(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        if (loading) {
            this.submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }

    // フォームリセット
    resetForm() {
        this.form.reset();
        
        // 文字カウンターリセット
        const titleCounter = document.getElementById('titleCounter');
        const contentCounter = document.getElementById('contentCounter');
        if (titleCounter) titleCounter.textContent = '0';
        if (contentCounter) contentCounter.textContent = '0';

        // エラー状態クリア
        this.form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
            this.clearFieldErrors(input);
        });
    }

    // カテゴリ判定結果表示
    showCategorizationResult(categories, confidence) {
        if (!categories || categories.length === 0) return;

        const explanation = this.categoryManager.generateCategoryExplanation(categories);
        const confidenceText = confidence > 0.7 ? '（高い信頼度）' : 
                              confidence > 0.4 ? '（中程度の信頼度）' : '（低い信頼度）';

        setTimeout(() => {
            this.showMessage(
                `自動分類: ${categories.join('、')} ${confidenceText}`, 
                'info'
            );
        }, 2000);
    }

    // 更新イベント発火
    dispatchUpdateEvent(newReview) {
        const event = new CustomEvent('reviewAdded', {
            detail: { review: newReview },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // フォーム状態の保存（下書き機能）
    saveDraft() {
        const formData = this.getFormData();
        const hasContent = Object.values(formData).some(value => value.trim() !== '');
        
        if (hasContent) {
            localStorage.setItem('review_draft', JSON.stringify({
                ...formData,
                savedAt: new Date().toISOString()
            }));
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
                        document.getElementById('username').value = draftData.username || '';
                        document.getElementById('childAge').value = draftData.childAge || '';
                        document.getElementById('title').value = draftData.title || '';
                        document.getElementById('content').value = draftData.content || '';

                        // 文字カウンター更新
                        document.getElementById('titleCounter').textContent = (draftData.title || '').length;
                        document.getElementById('contentCounter').textContent = (draftData.content || '').length;

                        this.showMessage('下書きを復元しました', 'info');
                    }
                }
                
                // 使用済み下書きを削除
                localStorage.removeItem('review_draft');
            }
        } catch (error) {
            console.error('Error restoring draft:', error);
        }
    }

    // フォーム離脱時の警告
    setupBeforeUnloadWarning() {
        let hasUnsavedChanges = false;

        // 入力変更の監視
        this.form.addEventListener('input', () => {
            hasUnsavedChanges = true;
        });

        // フォーム送信時は警告無効
        this.form.addEventListener('submit', () => {
            hasUnsavedChanges = false;
        });

        // ページ離脱前の警告
        window.addEventListener('beforeunload', (e) => {
            if (hasUnsavedChanges) {
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

    // バリデーション状態の可視化
    updateValidationStatus() {
        const formData = this.getFormData();
        const validation = this.validator.validateReview(formData);
        
        // 進捗表示
        const totalFields = Object.keys(this.validator.rules).length;
        const validFields = Object.keys(formData).filter(field => {
            const errors = this.validator.validateField(field, formData[field]);
            return errors.length === 0;
        }).length;
        
        const progress = (validFields / totalFields) * 100;
        this.updateProgressIndicator(progress);
    }

    // 進捗インジケーター更新
    updateProgressIndicator(progress) {
        let progressBar = document.getElementById('formProgress');
        if (!progressBar) {
            // 進捗バーが存在しない場合は作成
            progressBar = this.createProgressBar();
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    // 進捗バー作成
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'formProgress';
        progressContainer.className = 'form-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <span class="progress-text">入力進捗</span>
        `;
        
        // フォームの最初に挿入
        this.form.insertBefore(progressContainer, this.form.firstChild);
        return progressContainer;
    }

    // エラー統計の取得
    getValidationStatistics() {
        const stats = {
            totalAttempts: 0,
            fieldErrors: {},
            commonErrors: []
        };

        // ローカルストレージから統計情報を取得
        const statsData = localStorage.getItem('validation_stats');
        if (statsData) {
            return JSON.parse(statsData);
        }

        return stats;
    }

    // エラー統計の更新
    updateValidationStatistics(errors) {
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
    }

    // フォームの使いやすさ向上
    enhanceUserExperience() {
        // 自動保存機能
        setInterval(() => {
            this.saveDraft();
        }, 30000); // 30秒ごと

        // 入力補助
        this.setupInputAssistance();
        
        // ショートカットキー
        this.setupKeyboardShortcuts();
    }

    // 入力補助機能
    setupInputAssistance() {
        const titleInput = document.getElementById('title');
        const contentTextarea = document.getElementById('content');

        // タイトル候補の提案
        titleInput.addEventListener('input', () => {
            this.suggestTitles(titleInput.value);
        });

        // 定型文の挿入支援
        contentTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                this.showTemplateDialog();
            }
        });
    }

    // タイトル候補提案
    suggestTitles(currentTitle) {
        if (currentTitle.length < 3) return;

        const suggestions = [
            'スクールカウンセラーに相談して良かった',
            'フリースクールという選択肢',
            '保健室登校から始めた復帰',
            '家族で話し合った結果',
            '担任の先生との相談'
        ];

        const matchingSuggestions = suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(currentTitle.toLowerCase())
        );

        if (matchingSuggestions.length > 0) {
            this.showTitleSuggestions(matchingSuggestions);
        }
    }

    // タイトル候補表示
    showTitleSuggestions(suggestions) {
        // 実装省略（ドロップダウンリストの表示）
        console.log('Title suggestions:', suggestions);
    }

    // 定型文ダイアログ表示
    showTemplateDialog() {
        const templates = [
            '子どもが学校に行きづらくなって...',
            '最初は何をしたらいいか分からず...',
            'カウンセラーの先生に相談したところ...',
            '段階的に復帰することができました'
        ];

        // 簡易的な実装
        const template = prompt('挿入したい定型文を選択してください:\n' + 
            templates.map((t, i) => `${i + 1}. ${t}`).join('\n'));
        
        if (template) {
            const index = parseInt(template) - 1;
            if (index >= 0 && index < templates.length) {
                const contentTextarea = document.getElementById('content');
                contentTextarea.value += templates[index];
                contentTextarea.dispatchEvent(new Event('input'));
            }
        }
    }

    // キーボードショートカット
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveDraft();
                        this.showMessage('下書きを保存しました', 'info');
                        break;
                    case 'Enter':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.form.dispatchEvent(new Event('submit'));
                        }
                        break;
                }
            }
        });
    }

    // モバイル対応の改善
    enhanceMobileExperience() {
        // タッチデバイスの検出
        if ('ontouchstart' in window) {
            // モバイル固有の機能
            this.setupMobileFeatures();
        }
    }

    // モバイル固有機能
    setupMobileFeatures() {
        // 仮想キーボード対応
        this.handleVirtualKeyboard();
        
        // タッチ操作の最適化
        this.optimizeTouchInteraction();
    }

    // 仮想キーボード対応
    handleVirtualKeyboard() {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            // フォーカス時にズームを防ぐ
            document.addEventListener('focusin', () => {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
            });
            
            document.addEventListener('focusout', () => {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1');
            });
        }
    }

    // タッチ操作最適化
    optimizeTouchInteraction() {
        // ボタンのタッチ領域拡大
        const buttons = this.form.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.minHeight = '44px'; // iOS推奨サイズ
            button.style.minWidth = '44px';
        });
    }

    // デバッグ用メソッド
    debug() {
        return {
            formData: this.getFormData(),
            isSubmitting: this.isSubmitting,
            validationStats: this.getValidationStatistics(),
            draftExists: !!localStorage.getItem('review_draft')
        };
    }
}