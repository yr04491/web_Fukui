// プレイスカードのデータを一元管理
const placeCards = [
  {
    id: 1,
    title: "コドモノイバショ",
    description: "福井市内にあるフリースクール。学習支援や居場所提供を行っています。",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#高校生", "#小学生", "#中学生", "#フリースクール"]
  },
  {
    id: 2,
    title: "フリースクール「まなびの森」",
    description: "自分のペースで学べる環境を提供。週3日開校しています。",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#小学生", "#中学生", "#不登校支援"]
  },
  {
    id: 3,
    title: "放課後等デイサービス",
    description: "発達障害のあるお子さんの学校終了後の活動をサポート。",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#高校生", "#発達障害", "#小学生"]
  },
  {
    id: 4,
    title: "おやこカフェ",
    description: "保護者同士が気軽に相談できる場所。専門家も参加します。",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#保護者向け", "#相談", "#交流会"]
  },
  {
    id: 5,
    title: "保護者のつどい",
    description: "月に一度の保護者向け情報交換会。共に考え、支え合う場です。",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#保護者向け", "#情報交換", "#専門家相談"]
  },
  {
    id: 6,
    title: "不登校親の会",
    description: "不登校のお子さんを持つ親同士の交流の場。経験者の話が聞けます。",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#保護者向け", "#不登校", "#ピアサポート"]
  },
  {
    id: 7,
    title: "〇〇オンラインスクール",
    description: "不登校のお子さんを持つ親同士の交流の場。経験者の話が聞けます。",
    image: require('../assets/images/AdobeStock_school.png'),
    tags: ["#高校生", "#小学生", "#中学生", "#フリースクール"]
  }
];

export default placeCards;
