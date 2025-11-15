// src/components/common/Breadcrumbs/Breadcrumbs.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ sectionNumber, sectionTitle, items }) => {
  // itemsが渡された場合は汎用的なパンくずリスト
  if (items && items.length > 0) {
    return (
      <nav className={styles.breadcrumbs}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className={styles.separator}> &gt; </span>}
            {index === items.length - 1 ? (
              <span className={styles.current}>{item.label}</span>
            ) : (
              <Link to={item.path} className={styles.link}>{item.label}</Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // 従来のセクション番号とタイトルを使用するパターン
  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.link}>TOP</Link>
      <span className={styles.separator}> &gt; </span>
      <span className={styles.current}>{sectionNumber} {sectionTitle}</span>
    </nav>
  );
};

export default Breadcrumbs;
