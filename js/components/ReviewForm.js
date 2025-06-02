/* ==================== 
   ReviewForm - 投稿フォーム制御クラス（手動カテゴリ選択版）
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
        
        // カテゴリ選択関連
        this.selectedCategories = [];
        this.minCategories = 3;
        this.maxCategories = 5;
        this.allCategories = [];
        this.filteredCategories = [];
        
        this.init();
    }

    // 初期化
    init() {
        try {
            // 必要な要素の存在確認
            if (!this.form || !this.submitBtn || !this.messageContainer) {
                throw new Error('Required DOM elements not found');
            }
            
            this.loadCategories();
            this.initializeCategorySelection();
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

    // カテゴリデータを読み込み
    loadCategories() {
        try {
            // グローバル変数からカテゴリを取得
            if (window.ALL_CATEGORIES && Array.isArray(window.ALL_CATEGORIES)) {
                this.allCategories = [...window.ALL_CATEGORIES];
            } else if (window.CATEGORIES && typeof window.CATEGORIES === 'object') {
                // オブジェクト形式の場合は配列に変換
                this.allCategories = Object.values(window.CATEGORIES).flat();
            } else {
                // フォールバック
                this.allCategories = [
                    "担任教師との相談", "保健室登校", "別室登校", "時間差登校",
                    "スクールカウンセラー", "心理カウンセラー", "教育相談員",
                    "教育支援センター", "適応指導教室", "チャレンジ教室",
                    "フリースクール", "ホームスクーリング", "通信制高校",
                    "不安症状", "うつ症状", "起立性調節障害", "睡眠障害",
                    "親子関係", "兄弟姉妹関係", "家族会議", "生活リズム",
                    "高校受験", "進路相談", "将来の夢", "目標設定",
                    "いじめ被害", "友人トラブル", "仲間外れ", "悪口・陰口"
                ];
            }
            
            this.filteredCategories = [...this.allCategories];
            console.log(`Loaded ${this.allCategories.length} categories`);
        } catch (error) {
            console.error('Error loading categories:', error);
            this.allCategories = [];
            this.filteredCategories = [];
        }
    }

    // カテゴリ選択UIの初期化
    initializeCategorySelection() {
        try {
            this.renderCategoryGroups();
            this.setupCategorySearch();
            this.updateSelectedCategoriesDisplay();
        } catch (error) {
            console.error('Error initializing category selection:', error);
        }
    }

    // カテゴリグループを表示
    renderCategoryGroups() {
        try {
            const container = document.getElementById('categoryGroups');
            if (!container) return;

            // カテゴリをグループ分け（アルファベット順）
            const grouped = this.groupCategoriesByType();
            
            container.innerHTML = '';
            
            for (const [groupName, categories] of Object.entries(grouped)) {
                const groupElement = document.createElement('div');
                groupElement.className = 'category-group';
                
                const groupTitle = document.createElement('h4');
                groupTitle.className = 'category-group-title';
                groupTitle.textContent = groupName;
                groupElement.appendChild(groupTitle);
                
                const categoryList = document.createElement('div');
                categoryList.className = 'category-list';
                
                categories.forEach(category => {
                    if (this.filteredCategories.includes(category)) {
                        const categoryItem = this.createCategoryItem(category);
                        categoryList.appendChild(categoryItem);
                    }
                });
                
                groupElement.appendChild(categoryList);
                container.appendChild(groupElement);
            }
        } catch (error) {
            console.error('Error rendering category groups:', error);
        }
    }

    // カテゴリをタイプ別にグループ分け
    groupCategoriesByType() {
        const groups = {
            '学校関連の支援': [],
            'カウンセリング・相談': [],
            '公的支援機関': [],
            '代替教育': [],
            'メンタルヘルス': [],
            '家庭・家族': [],
            '進路・将来': [],
            'いじめ・人間関係': []
        };

        // キーワードベースでグループ分け
        this.allCategories.forEach(category => {
            if (category.includes('登校') || category.includes('学校') || category.includes('担任') || category.includes('教室')) {
                groups['学校関連の支援'].push(category);
            } else if (category.includes('カウンセラー') || category.includes('相談') || category.includes('心理')) {
                groups['カウンセリング・相談'].push(category);
            } else if (category.includes('支援センター') || category.includes('教育委員会') || category.includes('児童相談所') || category.includes('市役所')) {
                groups['公的支援機関'].push(category);
            } else if (category.includes('フリースクール') || category.includes('ホームスクーリング') || category.includes('通信制') || category.includes('定時制')) {
                groups['代替教育'].push(category);
            } else if (category.includes('不安') || category.includes('うつ') || category.includes('障害') || category.includes('ストレス') || category.includes('睡眠')) {
                groups['メンタルヘルス'].push(category);
            } else if (category.includes('親子') || category.includes('家族') || category.includes('兄弟') || category.includes('生活')) {
                groups['家庭・家族'].push(category);
            } else if (category.includes('受験') || category.includes('進路') || category.includes('将来') || category.includes('目標') || category.includes('就職')) {
                groups['進路・将来'].push(category);
            } else if (category.includes('いじめ') || category.includes('友人') || category.includes('人間関係') || category.includes('トラブル')) {
                groups['いじめ・人間関係'].push(category);
            }
        });

        return groups;
    }

    // 個別カテゴリアイテムを作成
    createCategoryItem(category) {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.textContent = category;
        item.setAttribute('data-category', category);
        
        // 選択状態を反映
        if (this.selectedCategories.includes(category)) {
            item.classList.add('selected');
        }
        
        // クリックイベント
        item.addEventListener('click', () => {
            this.toggleCategory(category);
        });
        
        return item;
    }

    // カテゴリの選択・選択解除
    toggleCategory(category) {
        try {
            const index = this.selectedCategories.indexOf(category);
            
            if (index > -1) {
                // 選択解除
                this.selectedCategories.splice(index, 1);
            } else {
                // 選択追加（最大数チェック）
                if (this.selectedCategories.length >= this.maxCategories) {
                    this.showMessage(`カテゴリは最大${this.maxCategories}個まで選択できます`, 'warning');
                    return;
                }
                this.selectedCategories.push(category);
            }
            
            this.updateCategoryDisplay();
            this.updateSelectedCategoriesDisplay();
            this.validateCategories();
            this.hasUnsavedChanges = true;
            
        } catch (error) {
            console.error('Error toggling category:', error);
        }
    }

    // カテゴリ表示を更新
    updateCategoryDisplay() {
        try {
            const categoryItems = document.querySelectorAll('.category-item');
            categoryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (this.selectedCategories.includes(category)) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        } catch (error) {
            console.error('Error updating category display:', error);
        }
    }

    // 選択されたカテゴリの表示を更新
    updateSelectedCategoriesDisplay() {
        try {
            const container = document.getElementById('selectedCategories');
            if (!container) return;
            
            if (this.selectedCategories.length === 0) {
                container.innerHTML = '<p class="selection-hint">下のカテゴリから3〜5個選んでください</p>';
                return;
            }
            
            container.innerHTML = '';
            
            const selectedTitle = document.createElement('div');
            selectedTitle.className = 'selected-title';
            selectedTitle.textContent = `選択済み (${this.selectedCategories.length}/${this.maxCategories})`;
            container.appendChild(selectedTitle);
            
            const selectedList = document.createElement('div');
            selectedList.className = 'selected-list';
            
            this.selectedCategories.forEach(category => {
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.innerHTML = `
                    ${category}
                    <button type="button" class="remove-tag" aria-label="削除">×</button>
                `;
                
                // 削除ボタンのイベント
                const removeBtn = tag.querySelector('.remove-tag');
                removeBtn.addEventListener('click', () => {
                    this.toggleCategory(category);
                });
                
                selectedList.appendChild(tag);
            });
            
            container.appendChild(selectedList);
            
        } catch (error) {
            console.error('Error updating selected categories display:', error);
        }
    }

    // カテゴリ検索の設定
    setupCategorySearch() {
        try {
            const searchInput = document.getElementById('categorySearch');
            if (!searchInput) return;
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.filterCategories(query);
            });
            
        } catch (error) {
            console.error('Error setting up category search:', error);
        }
    }

    // カテゴリをフィルタリング
    filterCategories(query) {
        try {
            if (!query) {
                this.filteredCategories = [...this.allCategories];
            } else {
                this.filteredCategories = this.allCategories.filter(category =>
                    category.toLowerCase().includes(query)
                );
            }
            
            this.renderCategoryGroups();
        } catch (error) {
            console.error('Error filtering categories:', error);
        }
    }

    // カテゴリバリデーション
    validateCategories() {
        try {
            const errorElement = document.getElementById('categoriesError');
            if (!errorElement) return true;
            
            if (this.selectedCategories.length < this.minCategories) {
                this.showFieldError(null, errorElement, `最低${this.minCategories}個のカテゴリを選択してください`);
                return false;
            } else if (this.selectedCategories.length > this.maxCategories) {
                this.showFieldError(null, errorElement, `カテゴリは最大${this.maxCategories}個まで選択できます`);
                return false;
            } else {
                this.clearFieldErrors(null);
                errorElement.classList.add('hidden');
                return true;
            }
        } catch (error) {
            console.error('Error validating categories:', error);
            return false;
        }
    }

    // 選択されたカテゴリをクリア
    clearSelectedCategories() {
        try {
            this.selectedCategories = [];
            this.updateCategoryDisplay();
            this.updateSelectedCategoriesDisplay();
            this.validateCategories();
        } catch (error) {
            console.error('Error clearing selected categories:', error);
        }
    }

    // イベントバインディング
    bindEvents() {
        try {
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
        } catch (error) {
            console.error('Error binding events:', error);
        }
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

    // フォーム送信処理（AI判定を削除し、手動選択を使用）
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
            
            // カテゴリバリデーション
            if (!this.validateCategories()) {
                this.showMessage('カテゴリを正しく選択してください', 'error');
                return;
            }
            
            // 選択されたカテゴリを追加
            formData.categories = [...this.selectedCategories];
            
            // バリデーション
            const validation = this.validator.validateReview(formData);
            if (!validation.isValid) {
                console.log('Validation failed:', validation.errors);
                this.displayValidationErrors(validation.errors);
                return;
            }

            // 投稿頻度チェック
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
            }

            // サニタイゼーション
            const sanitizedData = this.validator.sanitizeReviewData ? 
                this.validator.sanitizeReviewData(formData) : formData;

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
            return true;
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
            content: '口コミ内容',
            categories: 'カテゴリ'
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
            
            // カテゴリ選択をクリア
            this.clearSelectedCategories();
            
            // 下書きクリア
            this.clearDraft();
        }
    }

    // 更新イベント発火
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
            ) || this.selectedCategories.length > 0;
            
            if (hasContent) {
                const draftData = {
                    ...formData,
                    categories: [...this.selectedCategories],
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

                        // カテゴリ選択を復元
                        if (draftData.categories && Array.isArray(draftData.categories)) {
                            this.selectedCategories = [...draftData.categories];
                            this.updateCategoryDisplay();
                            this.updateSelectedCategoriesDisplay();
                        }

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

    // デバッグ用メソッド
    debug() {
        return {
            formData: this.getFormData(),
            selectedCategories: this.selectedCategories,
            allCategories: this.allCategories.length,
            isSubmitting: this.isSubmitting,
            hasUnsavedChanges: this.hasUnsavedChanges,
            draftExists: !!localStorage.getItem('review_draft')
        };
    }
}