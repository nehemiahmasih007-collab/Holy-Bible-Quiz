import { Category, Question } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Scripture',
    description: 'Questions from across both the Old and New Testaments',
    iconName: 'BookOpen',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'old_testament',
    name: 'Old Testament',
    description: 'Genesis, Exodus, Kings, and Historical Books',
    iconName: 'Scroll',
    color: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'gospels',
    name: 'The Gospels',
    description: 'Matthew, Mark, Luke, and John',
    iconName: 'Cross',
    color: 'from-blue-700 to-cyan-800',
  },
  {
    id: 'wisdom_psalms',
    name: 'Wisdom & Psalms',
    description: 'Psalms, Proverbs, Job, and Ecclesiastes',
    iconName: 'Sparkles',
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 'prophets',
    name: 'Major & Minor Prophets',
    description: 'Isaiah, Jeremiah, Daniel, Jonah, and others',
    iconName: 'Flame',
    color: 'from-orange-600 to-red-700',
  },
  {
    id: 'epistles',
    name: 'Epistles & Acts',
    description: 'Acts of the Apostles and Epistles of Paul and others',
    iconName: 'Mail',
    color: 'from-indigo-600 to-purple-800',
  },
  {
    id: 'miracles_parables',
    name: 'Miracles & Parables',
    description: 'The teachings and miracles of Jesus',
    iconName: 'Sun',
    color: 'from-emerald-600 to-teal-800',
  },
];

export const QUESTIONS: Question[] = [
  // --- OLD TESTAMENT & HISTORICAL ---
  {
    id: 'q1',
    question: 'Which king in the Old Testament ruled for only seven days?',
    options: ['Omri', 'Zimri', 'Elah', 'Tibni'],
    correctOptionIndex: 1, // Corrected position (Zimri)
    category: 'old_testament',
    hintReference: '1 Kings 16:15–20',
    explanationHint: '1 Kings 16:15–20',
    difficulty: 'medium',
  },
  {
    id: 'q2',
    question: 'In how many days did God create the universe before resting on the seventh day?',
    options: ['7 days', '40 days', '6 days', '12 days'],
    correctOptionIndex: 2, // Corrected position (6 days)
    category: 'old_testament',
    hintReference: 'Genesis 1:1–2:3',
    explanationHint: 'Genesis 1:1–2:3',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    question: 'On which mountain did Moses receive the Ten Commandments from God?',
    options: ['Mount Carmel', 'Mount Ararat', 'Mount Nebo', 'Mount Sinai'],
    correctOptionIndex: 3, // Corrected position (Mount Sinai)
    category: 'old_testament',
    hintReference: 'Exodus 20:1–17',
    explanationHint: 'Exodus 20:1–17',
    difficulty: 'easy',
  },
  {
    id: 'q4',
    question: 'What giant Philistine warrior did young David defeat with a sling and a stone?',
    options: ['Og', 'Goliath', 'Sihon', 'Ishbi-Benob'],
    correctOptionIndex: 1, // Corrected position (Goliath)
    category: 'old_testament',
    hintReference: '1 Samuel 17:1–58',
    explanationHint: '1 Samuel 17:1–58',
    difficulty: 'easy',
  },
  {
    id: 'q5',
    question: 'Which sea did God miraculously part through Moses so the Israelites could escape Egypt on dry land?',
    options: ['Dead Sea', 'Sea of Galilee', 'Red Sea', 'Mediterranean Sea'],
    correctOptionIndex: 2, // Corrected position (Red Sea)
    category: 'old_testament',
    hintReference: 'Exodus 14:1–31',
    explanationHint: 'Exodus 14:1–31',
    difficulty: 'easy',
  },
  {
    id: 'q6',
    question: 'Which prophet was saved from hungry lions after remaining faithful in prayer to God?',
    options: ['Ezekiel', 'Jeremiah', 'Isaiah', 'Daniel'],
    correctOptionIndex: 3, // Corrected position (Daniel)
    category: 'prophets',
    hintReference: 'Daniel 6:1–28',
    explanationHint: 'Daniel 6:1–28',
    difficulty: 'easy',
  },
  {
    id: 'q7',
    question: 'Which prophet called down fire from heaven in a dramatic showdown on Mount Carmel?',
    options: ['Elijah', 'Elisha', 'Samuel', 'Nathan'],
    correctOptionIndex: 0,
    category: 'old_testament',
    hintReference: '1 Kings 18:20–40',
    explanationHint: '1 Kings 18:20–40',
    difficulty: 'medium',
  },
  {
    id: 'q8',
    question: 'Which courageous queen approached King Ahasuerus uninvited to save her Jewish people?',
    options: ['Ruth', 'Deborah', 'Esther', 'Hannah'],
    correctOptionIndex: 2, // Corrected position (Esther)
    category: 'old_testament',
    hintReference: 'Esther 4:10–5:8',
    explanationHint: 'Esther 4:10–5:8',
    difficulty: 'medium',
  },

  // --- WISDOM & PSALMS ---
  {
    id: 'q9',
    question: 'Which Psalm famously opens with "The LORD is my shepherd; I shall not want"?',
    options: ['Psalm 91', 'Psalm 23', 'Psalm 121', 'Psalm 100'],
    correctOptionIndex: 1, // Corrected position (Psalm 23)
    category: 'wisdom_psalms',
    hintReference: 'Psalm 23:1–6',
    explanationHint: 'Psalm 23:1–6',
    difficulty: 'easy',
  },
  {
    id: 'q10',
    question: 'According to Proverbs 3:5, with what should believers trust in the LORD?',
    options: ['Half your strength', 'All your wealth', 'Your own wisdom', 'All your heart'],
    correctOptionIndex: 3, // Corrected position (All your heart)
    category: 'wisdom_psalms',
    hintReference: 'Proverbs 3:5–6',
    explanationHint: 'Proverbs 3:5–6',
    difficulty: 'easy',
  },
  {
    id: 'q11',
    question: 'According to Ecclesiastes chapter 3, for what is there an appointed time under heaven?',
    options: ['For harvest only', 'For everything', 'For sorrow only', 'For kings only'],
    correctOptionIndex: 1, // Corrected position (For everything)
    category: 'wisdom_psalms',
    hintReference: 'Ecclesiastes 3:1–8',
    explanationHint: 'Ecclesiastes 3:1–8',
    difficulty: 'medium',
  },

  // --- PROPHETS ---
  {
    id: 'q12',
    question: 'Which prophet prophesied that Messiah would be "pierced for our transgressions"?',
    options: ['Jeremiah', 'Amos', 'Isaiah', 'Micah'],
    correctOptionIndex: 2, // Corrected position (Isaiah)
    category: 'prophets',
    hintReference: 'Isaiah 53:1–12',
    explanationHint: 'Isaiah 53:1–12',
    difficulty: 'medium',
  },
  {
    id: 'q13',
    question: 'Which prophet was swallowed by a great fish after trying to flee from God’s call to Nineveh?',
    options: ['Jonah', 'Nahum', 'Hosea', 'Habakkuk'],
    correctOptionIndex: 0,
    category: 'prophets',
    hintReference: 'Jonah 1:1–2:10',
    explanationHint: 'Jonah 1:1–2:10',
    difficulty: 'easy',
  },

  // --- THE GOSPELS ---
  {
    id: 'q14',
    question: 'In which town was Jesus Christ born, as proclaimed by angels to local shepherds?',
    options: ['Nazareth', 'Jerusalem', 'Capernaum', 'Bethlehem'],
    correctOptionIndex: 3, // Corrected position (Bethlehem)
    category: 'gospels',
    hintReference: 'Luke 2:1–20',
    explanationHint: 'Luke 2:1–20',
    difficulty: 'easy',
  },
  {
    id: 'q15',
    question: 'Where did Jesus deliver the famous Beatitudes ("Blessed are the poor in spirit...")?',
    options: ['Mount of Olives', 'Sermon on the Mount', 'Mount Tabor', 'Mount Sinai'],
    correctOptionIndex: 1,
    category: 'gospels',
    hintReference: 'Matthew 5:1–12',
    explanationHint: 'Matthew 5:1–12',
    difficulty: 'easy',
  },
  {
    id: 'q16',
    question: 'In John 3:16, what did God give to the world because He loved us so deeply?',
    options: ['The Law of Moses', 'His only begotten Son', 'Earthly riches', 'A giant temple'],
    correctOptionIndex: 1, // Corrected position (His only begotten Son)
    category: 'gospels',
    hintReference: 'John 3:16',
    explanationHint: 'John 3:16',
    difficulty: 'easy',
  },

  // --- MIRACLES & PARABLES ---
  {
    id: 'q17',
    question: 'In Jesus’ parable of the Prodigal Son, who welcomed back the lost son with open arms?',
    options: ['His Elder Brother', 'The Town Mayor', 'His Father', 'The Hired Servants'],
    correctOptionIndex: 2, // Corrected position (His Father)
    category: 'miracles_parables',
    hintReference: 'Luke 15:11–32',
    explanationHint: 'Luke 15:11–32',
    difficulty: 'easy',
  },
  {
    id: 'q18',
    question: 'What was Jesus’ first miracle performed during a wedding feast in Cana of Galilee?',
    options: ['Calming the stormy sea', 'Walking on water', 'Healing a paralytic', 'Turning water into wine'],
    correctOptionIndex: 3, // Corrected position (Turning water into wine)
    category: 'miracles_parables',
    hintReference: 'John 2:1–11',
    explanationHint: 'John 2:1–11',
    difficulty: 'easy',
  },
  {
    id: 'q19',
    question: 'With how many loaves and fish did Jesus miraculously feed 5,000 men?',
    options: ['7 loaves and 3 fish', '5 loaves and 2 fish', '10 loaves and 5 fish', '2 loaves and 1 fish'],
    correctOptionIndex: 1, // Corrected position (5 loaves and 2 fish)
    category: 'miracles_parables',
    hintReference: 'Matthew 14:13–21',
    explanationHint: 'Matthew 14:13–21',
    difficulty: 'easy',
  },

  // --- EPISTLES & ACTS ---
  {
    id: 'q20',
    question: 'On which feast day did the Holy Spirit descend upon the apostles as tongues of fire?',
    options: ['Passover', 'Feast of Tabernacles', 'Day of Pentecost', 'Day of Atonement'],
    correctOptionIndex: 2, // Corrected position (Day of Pentecost)
    category: 'epistles',
    hintReference: 'Acts 2:1–13',
    explanationHint: 'Acts 2:1–13',
    difficulty: 'medium',
  },
  {
    id: 'q21',
    question: 'On the road to which city was Saul confronted by a blinding light and the voice of Jesus?',
    options: ['Damascus', 'Antioch', 'Rome', 'Corinth'],
    correctOptionIndex: 0,
    category: 'epistles',
    hintReference: 'Acts 9:1–19',
    explanationHint: 'Acts 9:1–19',
    difficulty: 'easy',
  },
  {
    id: 'q22',
    question: 'In 1 Corinthians 13:13, which virtue is declared to be the greatest of faith, hope, and love?',
    options: ['Faith', 'Hope', 'Love', 'Knowledge'],
    correctOptionIndex: 2, // Corrected position (Love)
    category: 'epistles',
    hintReference: '1 Corinthians 13:13',
    explanationHint: '1 Corinthians 13:13',
    difficulty: 'easy',
  },
];