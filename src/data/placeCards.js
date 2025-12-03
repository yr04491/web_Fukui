// プレイスカードのデータを一元管理
const placeCards = [
  {
    id: 1,
    title: "オルタナティブスクール\nちいさな学校ヒトツナガリ",
    description: "福井市内にあるフリースクール。学習支援や居場所提供を行っています。",
    body: "福井市で不登校のお子さんを持つお母さん向けに座談会をしています。私自身中学校不登校だった息子の経験から同じような立場で気軽に話せる場が欲しかったことから始めました。少しでも心が軽くなってもらえたら嬉しいです。",
    address: "福井市中央1-1-1",
    hours: "月・水・金10:00-16:00",
    contact: "0776-XX-XXXX",
    detailInfo: {
      location: "福井市",
      phone: "0000-00-0000",
      email: "000@00000.00",
      website: "00000.00",
      target: "あああああ,aaaaa,",
      recommended: "あああああ,aaaaa,",
      suggestion: "",
      schedule: "主に第三か第四日曜日 場所はインスタグラムにて",
      fee: "学習２０円、１月1800円です。通塾は別途ご相談ください。",
      other: "学習スペースは半日1000円、１日1800円です。通塾は別途ご相談ください。"
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
      require('../assets/images/AdobeStock_school.png'),
      require('../assets/images/AdobeStock_cat.png'),
      require('../assets/images/AdobeStock2.png')
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["不登校児の親のおしゃべり会", "不登校生の保護者"]
  },
  {
    id: 2,
    title: "フリースクール「まなびの森」",
    description: "自分のペースで学べる環境を提供。週3日開校しています。",
    body: "自分のペースで学べる環境を提供。週3日開校しています。一人一人の個性を尊重し、学びの楽しさを体験できる場所です。",
    address: "福井市大手2-2-2",
    hours: "火・木・土10:00-15:00",
    contact: "0776-YY-YYYY",
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["#小学生", "#中学生", "#不登校支援"]
  },
  {
    id: 3,
    title: "放課後等デイサービス",
    description: "発達障害のあるお子さんの学校終了後の活動をサポート。",
    body: "発達障害のあるお子さんの学校終了後の活動をサポート。個別のニーズに対応したプログラムを提供しています。",
    address: "福井市花場3-3-3",
    hours: "月〜金13:00-18:00",
    contact: "0776-ZZ-ZZZZ",
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
  },
  {
    id: 8,
    title: "〇〇オンラインスクール",
    description: "オンラインで学習できる環境を提供。自分のペースで進められます。",
    image: require('../assets/images/AdobeStock_school.png'),
    tags: ["#高校生", "#小学生", "#中学生", "#オンライン"]
  }
];

export default placeCards;
