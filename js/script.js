// ======================
// 基本設定・初期化
// ======================
document.addEventListener('DOMContentLoaded', function() {
    console.log('不登校情報サイトが読み込まれました');
    initializePageEffects();
});

// ======================
// ボタンクリック処理
// ======================

/**
 * プロジェクトについてボタンのクリック処理
 */
function openProject() {
    console.log('プロジェクトについてがクリックされました');
    
    // アラート表示（後で詳細ページに変更予定）
    alert('プロジェクトについて\n\n当サイトは元不登校生やその保護者達が作成した情報サイトです。\n\n（ここに詳細ページへのリンク機能を実装予定）');
    
    // 今後の実装例：
    // window.open('about.html', '_blank');
    // または
    // location.href = 'about.html';
}

/**
 * セクションボタンのクリック処理
 * @param {string} sectionId - セクションID（'00', '01', '02'）
 */
function openSection(sectionId) {
    console.log(`セクション${sectionId}がクリックされました`);
    
    // セクションごとの処理分岐
    switch(sectionId) {
        case '00':
            alert('まずどうする\n\n心を落ち着ける情報ページを開きます。\n\n（詳細ページを実装予定）');
            // 今後の実装: location.href = 'mindset.html';
            break;
            
        case '01':
            alert('学校に相談\n\n学校のサポート制度について詳しく説明します。\n\n（詳細ページを実装予定）');
            // 今後の実装: location.href = 'school-support.html';
            break;
            
        case '02':
            alert('行政が行う公的支援\n\n公的支援窓口の情報を表示します。\n\n（詳細ページを実装予定）');
            // 今後の実装: location.href = 'public-support.html';
            break;
            
        default:
            console.error('不正なセクションIDです:', sectionId);
    }
}

// ======================
// ページ効果・アニメーション
// ======================

/**
 * ページの初期化効果
 */
function initializePageEffects() {
    // スムーズスクロール効果
    addSmoothScrolling();
    
    // セクションの表示アニメーション
    addSectionAnimations();
    
    // カラーナビの動的効果
    addColorNaviEffects();
}

/**
 * スムーズスクロール機能
 */
function addSmoothScrolling() {
    // 将来的にアンカーリンクを追加する際に使用
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * セクションの表示アニメーション
 */
function addSectionAnimations() {
    // Intersection Observer for fade-in effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // セクションにアニメーション効果を適用
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/**
 * カラーナビの動的効果
 */
function addColorNaviEffects() {
    // カラーバーにホバー効果を追加
    document.querySelectorAll('.color-bar').forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ======================
// ユーティリティ関数
// ======================

/**
 * 指定した時間後に関数を実行
 * @param {Function} func - 実行する関数
 * @param {number} delay - 遅延時間（ミリ秒）
 */
function delay(func, delay) {
    setTimeout(func, delay);
}

/**
 * ローカルストレージにデータを保存
 * @param {string} key - キー
 * @param {any} value - 値
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('ローカルストレージへの保存に失敗しました:', error);
    }
}

/**
 * ローカルストレージからデータを取得
 * @param {string} key - キー
 * @returns {any} 保存されたデータ
 */
function loadFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('ローカルストレージからの読み込みに失敗しました:', error);
        return null;
    }
}

// ======================
// 今後の拡張機能用の関数（コメントアウト）
// ======================

/*
// お気に入り機能
function toggleFavorite(sectionId) {
    const favorites = loadFromLocalStorage('favorites') || [];
    const index = favorites.indexOf(sectionId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        console.log(`セクション${sectionId}をお気に入りから削除しました`);
    } else {
        favorites.push(sectionId);
        console.log(`セクション${sectionId}をお気に入りに追加しました`);
    }
    
    saveToLocalStorage('favorites', favorites);
}

// 進捗管理機能
function markAsCompleted(sectionId) {
    const completed = loadFromLocalStorage('completed') || [];
    if (!completed.includes(sectionId)) {
        completed.push(sectionId);
        saveToLocalStorage('completed', completed);
        console.log(`セクション${sectionId}を完了としてマークしました`);
    }
}

// 検索機能
function searchContent(query) {
    const sections = document.querySelectorAll('.content-section');
    query = query.toLowerCase();
    
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(query)) {
            section.style.display = 'flex';
            section.style.backgroundColor = '#fffacd'; // ハイライト
        } else {
            section.style.display = 'none';
        }
    });
}

// ダークモード切り替え
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    saveToLocalStorage('darkMode', isDarkMode);
}

// フォント サイズ調整
function adjustFontSize(increase) {
    const currentSize = parseInt(getComputedStyle(document.body).fontSize);
    const newSize = increase ? currentSize + 2 : Math.max(currentSize - 2, 12);
    document.body.style.fontSize = newSize + 'px';
    saveToLocalStorage('fontSize', newSize);
}
*/

// ======================
// エラーハンドリング
// ======================
window.addEventListener('error', function(e) {
    console.error('JavaScriptエラーが発生しました:', e.error);
    // 今後、エラー報告機能を追加可能
});

// デバッグ用の情報出力
console.log('script.js が正常に読み込まれました');
console.log('利用可能な関数: openProject(), openSection()');
console.log('開発者向け: initializePageEffects(), saveToLocalStorage(), loadFromLocalStorage()');