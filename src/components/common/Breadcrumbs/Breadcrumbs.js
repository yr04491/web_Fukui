// src/components/common/Breadcrumbs/Breadcrumbs.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ sectionNumber, sectionTitle }) => {
  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.link}>TOP</Link>
      <span className={styles.separator}> &gt; </span>
      <span className={styles.current}>{sectionNumber} {sectionTitle}</span>
    </nav>
  );
};

export default Breadcrumbs;
