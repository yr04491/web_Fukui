import React from 'react';
import vector0Image from './vector0.png';
import vector1Image from './vector1.png';
import vector2Image from './vector2.png';
import vector3Image from './vector3.png';
import vector4Image from './vector4.png';
import vector5Image from './vector5.png';

const NavIcon = ({ index }) => {
  // 「まずどうする」（index=0）だけvector0.pngを横に2個表示
  if (index === 0) {
    return (
      <div style={{
        width: '26px',
        height: '20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {/* 1つ目のvector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* 2つ目のvector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    );
  }
   // (index=1)
  if (index === 1) {
    return (
      <div style={{
        width: '26px',
        height: '20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {/* vector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* vector1.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector1Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    );
  }
   // (index=2)
  if (index === 2) {
    return (
      <div style={{
        width: '26px',
        height: '20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {/* vector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* vector2.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector2Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    );
  }
  // (index=3)
  if (index === 3) {
    return (
      <div style={{
        width: '26px',
        height: '20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {/* vector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* vector3.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector3Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    );
  }
  // (index=4)
  if (index === 4) {
    return (
      <div style={{
        width: '26px',
        height: '20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {/* vector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* vector4.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector4Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    );
  }
  // (index=5)
  if (index === 5) {
    return (
      <div style={{
        width: '26px',
        height: '20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {/* vector0.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector0Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* vector5.png */}
        <div style={{
          width: '13px',
          height: '20px',
          backgroundImage: `url(${vector5Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    );
  }
  // それ以外のアイテムは従来の黒い矩形を使用
  return (
    <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="13" height="20" fill="black" />
      <rect x="13" width="13" height="20" fill="black" />
    </svg>
  );
};

export default NavIcon;
