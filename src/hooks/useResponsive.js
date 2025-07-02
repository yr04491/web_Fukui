import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初期チェック
    checkScreenSize();

    // リサイズイベントリスナー
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return { isMobile };
};

export default useResponsive;
