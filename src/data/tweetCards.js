// ツイートカードのデータを一元管理
const tweetCards = [
  {
    id: 1,
    title: "急に布団から出てこなくなって、ここは30文字の表示指定をする・・・",
    text: "毎日学校の先生と、UNOや雑談をして30分すごしてます。",
    body: "多くの民間団体やソーシャルが、不登校の子どもたちや保護者の皆様の支援を行っていきます。様態のみなさんや、子どもたちにとって適切な支援を見つけてみてください。",
    tags: ['#小学生', '#学校活用術', '#学校活用術'],
    authorName: "ひろまま",
    authorInitial: "R",
    date: "2025.07.03",
    grade: "小学校2年生",
    family: "父・母・本人",
    image: require('../assets/images/AdobeStock_cat.png')
  },
  {
    id: 2,
    title: "急に布団から出てこなくなって、ここは30文字の表示指定をする・・・",
    text: "毎日学校の先生と、UNOや雑談をして30分すごしてます。",
    body: "多くの民間団体やソーシャルが、不登校の子どもたちや保護者の皆様の支援を行っていきます。様態のみなさんや、子どもたちにとって適切な支援を見つけてみてください。",
    tags: ['#小学生', '#学校活用術', '#学校活用術'],
    authorName: "ひろまみ2",
    authorInitial: "R",
    date: "2025.07.03",
    grade: "小学校3年生",
    family: "父・母・本人・妹",
    image: require('../assets/images/AdobeStock_school.png')
  },
  {
    id: 3,
    title: "急に布団から出てこなくなって、ここは30文字の表示指定をする・・・",
    text: "親も学校に相談するといいよ。先生たちは支援方法を知ってるから。",
    body: "多くの民間団体やソーシャルが、不登校の子どもたちや保護者の皆様の支援を行っていきます。様態のみなさんや、子どもたちにとって適切な支援を見つけてみてください。",
    tags: ['#中学生', '#保護者', '#学校連携'],
    authorName: "たかパパ",
    authorInitial: "T",
    date: "2025.06.28",
    grade: "中学校1年生",
    family: "父・母・本人",
    image: require('../assets/images/AdobeStock.png')
  },
  {
    id: 4,
    title: "急に布団から出てこなくなって、ここは30文字の表示指定をする・・・",
    text: "スクールカウンセラーさんに話を聞いてもらって少し気持ちが楽になりました。",
    body: "多くの民間団体やソーシャルが、不登校の子どもたちや保護者の皆様の支援を行っていきます。様態のみなさんや、子どもたちにとって適切な支援を見つけてみてください。",
    tags: ['#高校生', '#メンタルケア'],
    authorName: "みゆき",
    authorInitial: "M",
    date: "2025.07.01",
    grade: "高校1年生",
    family: "母・本人",
    image: require('../assets/images/AdobeStock_Preview.png')
  },
  {
    id: 5,
    title: "急に布団から出てこなくなって、ここは30文字の表示指定をする・・・",
    text: "公的支援を受けられるようになって、学習面のサポートが充実しました。",
    body: "多くの民間団体やソーシャルが、不登校の子どもたちや保護者の皆様の支援を行っていきます。様態のみなさんや、子どもたちにとって適切な支援を見つけてみてください。",
    tags: ['#小学生', '#公的支援', '#学習サポート'],
    authorName: "たろうママ",
    authorInitial: "K",
    date: "2025.06.25",
    grade: "小学校5年生",
    family: "父・母・本人・兄",
    image: require('../assets/images/AdobeStock_cat.png')
  },
  {
    id: 6,
    title: "急に布団から出てこなくなって、ここは30文字の表示指定をする・・・",
    text: "ソーシャルワーカーさんに家庭での対応方法を教えてもらいました。",
    body: "多くの民間団体やソーシャルが、不登校の子どもたちや保護者の皆様の支援を行っていきます。様態のみなさんや、子どもたちにとって適切な支援を見つけてみてください。",
    tags: ['#不登校', '#公的支援', '#家庭対応'],
    authorName: "さくら",
    authorInitial: "S",
    date: "2025.07.02",
    grade: "中学校2年生",
    family: "父・母・本人",
    image: require('../assets/images/AdobeStock_school.png')
  }
];

export default tweetCards;
