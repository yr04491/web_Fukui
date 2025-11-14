import { 
  Section00Content, 
  Section01Content, 
  Section02Content,
  Section03Content,
  Section04Content, // 
  Section05Content  // 
} from '../components/MainContent';

/**
 * ナビゲーション項目データ
 * デスクトップナビゲーションとハンバーガーメニューで共通使用
 */
export const navigationItems = [
  {
    title: 'まずは、どうする？',
    subItems: ['慌てず情報収集。'],
    path: '/section00', 
    component: Section00Content 
  },
  {
    title: '学校に相談してみよう',
    subItems: ['学校にある支援の種類'],
    path: '/section01', 
    component: Section01Content 
  },
  {
    title: '行政が行う公的支援',
    subItems: ['公的機関の支援の種類'],
    path: '/section02', 
    component: Section02Content 
  },
  {
    title: 'まだまだある！\nみんなの居場所',
    subItems: ['こどもの居場所', '保護者の居場所'],
    path: '/section03', 
    component: Section03Content 
  },
  {
    title: 'インタビュー\n不登校とぼくら',
    subItems: ['当事者の声を聞いてみよう'],
    path: '/section04', // 
    component: Section04Content // 
  },
  {
    title: '中学卒業のこと',
    subItems: ['義務教育後の選択肢'],
    path: '/section05', // 
    component: Section05Content // 
  }
];

/**
 * 「探してみよう」セクションの項目
 */
export const searchItems = [
  '◯体験談を探す',
  '◯居場所を探す',
  '◯卒業後の進路を探す',
  '◯学校・行政・医療情報の一覧'
];