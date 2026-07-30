import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // 1. ReactDOMをインポート
import styles from './FilterModal.module.css';

/**
 * 時期フィルターのカテゴリ定義（タブが「時期で絞りこむ」の場合に使用）
 * 復元処理からも参照するため、コンポーネントの外に置いています。
 */
const periodCategories = [
  {
    title: '登校渋り期',
    key: 'reluctance',
    index: 100
  },
  {
    title: '混乱期',
    key: 'confusion',
    index: 101
  },
  {
    title: '安定期',
    key: 'stable',
    index: 102
  },
  {
    title: '回復期',
    key: 'recovery',
    index: 103
  }
];

/**
 * フィルターのキー → カテゴリインデックス
 * handleDecide の振り分け（index → キー）と対になる定義です。
 * 片方だけ変更すると復元できなくなるので、必ず両方を合わせてください。
 */
const FILTER_KEY_TO_CATEGORY_INDEX = {
  grade: 0,
  trigger: 1,
  support: 2,
  exam: 3,
  location: 4
};

/**
 * 親が持つフィルターオブジェクトを、内部で使う selectedTags 形式へ戻す
 * @param {object} filters - { grade: [...], trigger: [...], period: [...] } 形式
 * @return {Array<string>} - `${categoryIndex}_${tag}` の配列
 */
const buildSelectedTags = (filters) => {
  if (!filters) return [];

  const tags = [];

  Object.keys(filters).forEach(key => {
    const values = filters[key] || [];

    if (key === 'period') {
      values.forEach(value => {
        const category = periodCategories.find(c => c.title === value);
        if (category) tags.push(`${category.index}_${value}`);
      });
      return;
    }

    const categoryIndex = FILTER_KEY_TO_CATEGORY_INDEX[key];
    if (categoryIndex === undefined) return;

    values.forEach(value => tags.push(`${categoryIndex}_${value}`));
  });

  return tags;
};

const FilterModal = ({ isOpen, onClose, filterConfig, onApply, showPeriodTab = true, selectedFilters }) => {
  const [activeTab, setActiveTab] = useState('condition'); // 'condition' or 'period'
  const [selectedTags, setSelectedTags] = useState([]);

  // モーダルは閉じている間もマウントされたままなので、選択状態は勝手には消えません。
  // 親が「クリア」しても前回の選択が残ってしまうため、開くたびに親の条件へ合わせます。
  // selectedFilters を渡さない場合は従来どおり内部状態だけで動きます。
  const selectedFiltersRef = useRef(selectedFilters);
  selectedFiltersRef.current = selectedFilters;

  useEffect(() => {
    if (!isOpen) return;

    const filters = selectedFiltersRef.current;
    if (filters === undefined || filters === null) return;

    setSelectedTags(buildSelectedTags(filters));
    // 時期で絞り込んでいた場合は、その選択が見えるタブを開く
    const hasPeriod = (filters.period || []).length > 0;
    setActiveTab(hasPeriod && showPeriodTab ? 'period' : 'condition');
  }, [isOpen, showPeriodTab]);

  if (!isOpen) return null;

  // タブ切り替え時に他方のフィルターをクリア
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      // 切り替え前のタブの選択をクリア
      if (tab === 'condition') {
        // 時期フィルター（100番台）をクリア
        setSelectedTags(prev => prev.filter(tag => {
          const index = parseInt(tag.split('_')[0]);
          return index < 100;
        }));
      } else {
        // 条件フィルター（0-2番）をクリア
        setSelectedTags(prev => prev.filter(tag => {
          const index = parseInt(tag.split('_')[0]);
          return index >= 100;
        }));
      }
    }
    setActiveTab(tab);
  };

  const toggleTag = (tag, categoryIndex) => {
    const uniqueTag = `${categoryIndex}_${tag}`;
    
    setSelectedTags(prev => {
      // すでに選択されている場合は解除
      if (prev.includes(uniqueTag)) {
        return prev.filter(t => t !== uniqueTag);
      }
      
      // 同じカテゴリの他の選択を解除して、新しいものを選択（1つのみ選択可能）
      return [...prev.filter(t => {
        const index = parseInt(t.split('_')[0]);
        return index !== categoryIndex; // 同じカテゴリのものは削除
      }), uniqueTag];
    });
  };

  const getDisplayTag = (uniqueTag) => {
    return uniqueTag.split('_').slice(1).join('_');
  };

  const isTagSelected = (tag, categoryIndex) => {
    const uniqueTag = `${categoryIndex}_${tag}`;
    return selectedTags.includes(uniqueTag);
  };

  const handleDecide = () => {
    if (onApply) {
      // カテゴリごとにフィルターを整理
      const filters = {
        grade: [],      // index 0: 形態からさがす
        trigger: [],    // index 1: 授業スタイルからさがす
        support: [],    // index 2: 登校頻度からさがす
        exam: [],       // index 3: 入試の有無からさがす
        location: [],   // index 4: 本校所在地からさがす
        period: []      // index 100+: 時期で絞り込む
      };

      selectedTags.forEach(uniqueTag => {
        const [categoryIndex, ...tagParts] = uniqueTag.split('_');
        const tag = tagParts.join('_');
        const index = parseInt(categoryIndex);

        // カテゴリインデックスに基づいてフィルターを分類
        // （キー ⇄ インデックスの対応は FILTER_KEY_TO_CATEGORY_INDEX と共通）
        if (index >= 100) {
          filters.period.push(tag); // 時期フィルターは100番台
          return;
        }

        const key = Object.keys(FILTER_KEY_TO_CATEGORY_INDEX)
          .find(k => FILTER_KEY_TO_CATEGORY_INDEX[k] === index);
        if (key) filters[key].push(tag);
      });

      onApply(selectedTags.length, filters);
    }
    onClose();
  };

  // 2. モーダルの内容全体を ReactDOM.createPortal でラップし、document.body に描画する
  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <div className={styles.tagContainer}>
              {selectedTags.map(uniqueTag => (
                <span key={uniqueTag} className={styles.selectedTag}>
                  {getDisplayTag(uniqueTag)}
                  <button onClick={() => toggleTag(getDisplayTag(uniqueTag), parseInt(uniqueTag.split('_')[0]))} className={styles.tagRemove}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'condition' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('condition')}
          >
            条件で絞りこむ
          </button>
          {showPeriodTab && (
            <button
              className={`${styles.tab} ${activeTab === 'period' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('period')}
            >
              時期で絞りこむ
            </button>
          )}
        </div>

        <div className={styles.filterContent}>
          {activeTab === 'condition' ? (
            // 条件フィルター（既存の実装）
            filterConfig.categories.map((category, index) => (
              <div key={index} className={styles.filterCategory}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <div className={styles.buttonGroup}>
                  {category.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`${styles.filterButton} ${
                        isTagSelected(option, index) ? styles.selected : ''
                      }`}
                      style={{
                        backgroundColor: isTagSelected(option, index) 
                          ? filterConfig.selectedColor 
                          : '#FFFFFF',
                        color: isTagSelected(option, index) 
                          ? '#FFFFFF' 
                          : '#333333',
                        borderColor: isTagSelected(option, index)
                          ? filterConfig.selectedColor
                          : '#E0E0E0'
                      }}
                      onClick={() => toggleTag(option, index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // 時期フィルター（新規実装）
            <div className={styles.filterCategory}>
              <div className={styles.buttonGroup}>
                {periodCategories.map((category) => (
                  <button
                    key={category.key}
                    className={`${styles.filterButton} ${
                      isTagSelected(category.title, category.index) ? styles.selected : ''
                    }`}
                    style={{
                      backgroundColor: isTagSelected(category.title, category.index) 
                        ? filterConfig.selectedColor 
                        : '#FFFFFF',
                      color: isTagSelected(category.title, category.index) 
                        ? '#FFFFFF' 
                        : '#333333',
                      borderColor: isTagSelected(category.title, category.index)
                        ? filterConfig.selectedColor
                        : '#E0E0E0'
                    }}
                    onClick={() => toggleTag(category.title, category.index)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className={styles.decideButton}
          style={{ backgroundColor: filterConfig.buttonColor }}
          onClick={handleDecide}
        >
          決定
        </button>
      </div>
    </>,
    document.body // ポータルの描画先を指定
  );
};

export default FilterModal;