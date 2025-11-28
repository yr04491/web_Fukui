import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // 1. ReactDOMをインポート
import styles from './FilterModal.module.css';

const FilterModal = ({ isOpen, onClose, filterConfig, onApply }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  if (!isOpen) return null;

  const toggleTag = (tag, categoryIndex) => {
    const uniqueTag = `${categoryIndex}_${tag}`;
    setSelectedTags(prev => 
      prev.includes(uniqueTag) 
        ? prev.filter(t => t !== uniqueTag)
        : [...prev, uniqueTag]
    );
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
        grade: [],
        trigger: [],
        situation: [],
        support: []
      };

      selectedTags.forEach(uniqueTag => {
        const [categoryIndex, ...tagParts] = uniqueTag.split('_');
        const tag = tagParts.join('_');
        const index = parseInt(categoryIndex);

        // カテゴリインデックスに基づいてフィルターを分類
        if (index === 0) filters.grade.push(tag);
        else if (index === 1) filters.trigger.push(tag);
        else if (index === 2) filters.situation.push(tag);
        else if (index === 3) filters.support.push(tag);
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

        <div className={styles.filterContent}>
          {filterConfig.categories.map((category, index) => (
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
          ))}
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