import React from 'react';

const NavIcon = ({ index }) => {
  // 簡易的なアイコン表現として黒い矩形を使用
  return (
    <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="13" height="20" fill="black" />
      <rect x="13" width="13" height="20" fill="black" />
    </svg>
  );
};

export default NavIcon;
