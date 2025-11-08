// Local emotion analysis engine - no external APIs required
export interface EmotionScore {
  sentiment: "positive" | "neutral" | "negative"
  intensity: number
  emotions: {
    joy: number
    trust: number
    fear: number
    surprise: number
    sadness: number
    disgust: number
    anger: number
    anticipation: number
  }
}

// Enhanced emotion keywords database with extensive vocabulary
const emotionKeywords: { [key: string]: string } = {
  // Joy/Positive - Expanded
  happy: "joy",
  happiness: "joy",
  joyful: "joy",
  joy: "joy",
  great: "joy",
  awesome: "joy",
  excellent: "joy",
  wonderful: "joy",
  love: "joy",
  fantastic: "joy",
  amazing: "joy",
  perfect: "joy",
  brilliant: "joy",
  superb: "joy",
  marvelous: "joy",
  delightful: "joy",
  ecstatic: "joy",
  elated: "joy",
  thrilled: "joy",
  overjoyed: "joy",
  cheerful: "joy",
  glad: "joy",
  pleased: "joy",
  content: "joy",
  satisfied: "joy",
  grateful: "joy",
  blessed: "joy",
  lucky: "joy",
  fortunate: "joy",
  proud: "joy",
  accomplished: "joy",
  successful: "joy",
  victorious: "joy",
  winning: "joy",
  celebration: "joy",
  celebrate: "joy",
  smile: "joy",
  laughing: "joy",
  laugh: "joy",
  fun: "joy",
  enjoyable: "joy",
  pleasure: "joy",
  bliss: "joy",
  euphoria: "joy",
  jubilant: "joy",
  radiant: "joy",
  beaming: "joy",
  glowing: "joy",

  // Trust - Expanded
  confident: "trust",
  confidence: "trust",
  believe: "trust",
  believing: "trust",
  sure: "trust",
  certain: "trust",
  positive: "trust",
  reliable: "trust",
  trustworthy: "trust",
  trust: "trust",
  trusted: "trust",
  faith: "trust",
  faithful: "trust",
  loyal: "trust",
  loyalty: "trust",
  dependable: "trust",
  secure: "trust",
  security: "trust",
  safe: "trust",
  reassured: "trust",
  comfort: "trust",
  comfortable: "trust",
  stable: "trust",
  stability: "trust",
  steady: "trust",
  solid: "trust",
  firm: "trust",
  convinced: "trust",
  assured: "trust",
  guaranteed: "trust",

  // Fear/Worry - Expanded
  worried: "fear",
  worry: "fear",
  anxious: "fear",
  anxiety: "fear",
  nervous: "fear",
  nervousness: "fear",
  scared: "fear",
  afraid: "fear",
  fear: "fear",
  fearful: "fear",
  concerned: "fear",
  concern: "fear",
  panic: "fear",
  panicked: "fear",
  terrified: "fear",
  terror: "fear",
  horrified: "fear",
  horror: "fear",
  dread: "fear",
  dreadful: "fear",
  frightened: "fear",
  intimidated: "fear",
  insecure: "fear",
  uncertain: "fear",
  unsure: "fear",
  hesitant: "fear",
  apprehensive: "fear",
  uneasy: "fear",
  restless: "fear",
  tense: "fear",
  tension: "fear",
  stressed: "fear",
  stress: "fear",
  overwhelmed: "fear",
  pressured: "fear",
  pressure: "fear",
  threatened: "fear",
  threat: "fear",
  danger: "fear",
  dangerous: "fear",
  risky: "fear",
  risk: "fear",
  vulnerable: "fear",
  helpless: "fear",
  powerless: "fear",

  // Sadness - Expanded
  sad: "sadness",
  sadness: "sadness",
  unhappy: "sadness",
  depressed: "sadness",
  depression: "sadness",
  down: "sadness",
  disappointed: "sadness",
  disappointment: "sadness",
  sorrow: "sadness",
  sorrowful: "sadness",
  grief: "sadness",
  grieving: "sadness",
  mournful: "sadness",
  melancholy: "sadness",
  gloomy: "sadness",
  glum: "sadness",
  dejected: "sadness",
  despondent: "sadness",
  hopeless: "sadness",
  hopelessness: "sadness",
  despair: "sadness",
  desperate: "sadness",
  miserable: "sadness",
  misery: "sadness",
  wretched: "sadness",
  heartbroken: "sadness",
  broken: "sadness",
  crushed: "sadness",
  devastated: "sadness",
  defeated: "sadness",
  failure: "sadness",
  failed: "sadness",
  loss: "sadness",
  lost: "sadness",
  lonely: "sadness",
  loneliness: "sadness",
  isolated: "sadness",
  isolation: "sadness",
  empty: "sadness",
  emptiness: "sadness",
  void: "sadness",
  numb: "sadness",
  apathetic: "sadness",
  apathy: "sadness",
  tearful: "sadness",
  crying: "sadness",
  cry: "sadness",
  tears: "sadness",
  weep: "sadness",
  weeping: "sadness",

  // Anger - Expanded
  angry: "anger",
  anger: "anger",
  furious: "anger",
  fury: "anger",
  mad: "anger",
  enraged: "anger",
  rage: "anger",
  raging: "anger",
  frustrated: "anger",
  frustration: "anger",
  annoyed: "anger",
  annoyance: "anger",
  irritated: "anger",
  irritation: "anger",
  aggravated: "anger",
  aggravation: "anger",
  infuriated: "anger",
  livid: "anger",
  fuming: "anger",
  seething: "anger",
  boiling: "anger",
  heated: "anger",
  hostile: "anger",
  hostility: "anger",
  resentful: "anger",
  resentment: "anger",
  bitter: "anger",
  bitterness: "anger",
  spiteful: "anger",
  spite: "anger",
  vengeful: "anger",
  vengeance: "anger",
  revenge: "anger",
  outraged: "anger",
  outrage: "anger",
  offended: "anger",
  offense: "anger",
  insulted: "anger",
  insult: "anger",
  betrayed: "anger",
  betrayal: "anger",
  violated: "anger",
  violation: "anger",
  provoked: "anger",
  provoke: "anger",
  triggered: "anger",
  trigger: "anger",
  pissed: "anger",
  pissed_off: "anger",

  // Disgust - Expanded
  disgusted: "disgust",
  disgust: "disgust",
  hate: "disgust",
  hatred: "disgust",
  dislike: "disgust",
  repulsed: "disgust",
  repulsive: "disgust",
  repugnant: "disgust",
  revolted: "disgust",
  revolting: "disgust",
  appalled: "disgust",
  appalling: "disgust",
  sickened: "disgust",
  sickening: "disgust",
  nauseated: "disgust",
  nauseating: "disgust",
  loathsome: "disgust",
  loathing: "disgust",
  abhorrent: "disgust",
  abhor: "disgust",
  detest: "disgust",
  detestable: "disgust",
  despise: "disgust",
  despicable: "disgust",
  contempt: "disgust",
  contemptible: "disgust",
  vile: "disgust",
  repugnance: "disgust",
  revulsion: "disgust",
  aversion: "disgust",
  distaste: "disgust",
  distasteful: "disgust",

  // Surprise - Expanded
  surprised: "surprise",
  surprise: "surprise",
  shocked: "surprise",
  shock: "surprise",
  amazed: "surprise",
  astonishment: "surprise",
  astonished: "surprise",
  astounded: "surprise",
  astound: "surprise",
  stunned: "surprise",
  stun: "surprise",
  startled: "surprise",
  startle: "surprise",
  bewildered: "surprise",
  bewilderment: "surprise",
  confused: "surprise",
  confusion: "surprise",
  puzzled: "surprise",
  puzzle: "surprise",
  perplexed: "surprise",
  perplexity: "surprise",
  baffled: "surprise",
  baffling: "surprise",
  flabbergasted: "surprise",
  dumbfounded: "surprise",
  speechless: "surprise",
  incredulous: "surprise",
  disbelief: "surprise",
  unbelievable: "surprise",
  unexpected: "surprise",
  sudden: "surprise",
  abrupt: "surprise",
  out_of_the_blue: "surprise",
  caught_off_guard: "surprise",

  // Anticipation - Expanded
  excited: "anticipation",
  excitement: "anticipation",
  looking_forward: "anticipation",
  hopeful: "anticipation",
  hope: "anticipation",
  eager: "anticipation",
  eagerness: "anticipation",
  anticipation: "anticipation",
  anticipating: "anticipation",
  expectant: "anticipation",
  expectation: "anticipation",
  expecting: "anticipation",
  waiting: "anticipation",
  wait: "anticipation",
  prepared: "anticipation",
  preparing: "anticipation",
  preparation: "anticipation",
  ready: "anticipation",
  readiness: "anticipation",
  enthusiastic: "anticipation",
  enthusiasm: "anticipation",
  optimistic: "anticipation",
  optimism: "anticipation",
  curious: "anticipation",
  curiosity: "anticipation",
  interested: "anticipation",
  interest: "anticipation",
  intrigued: "anticipation",
  intrigue: "anticipation",
  motivated: "anticipation",
  motivation: "anticipation",
  inspired: "anticipation",
  inspiration: "anticipation",
  energized: "anticipation",
  energy: "anticipation",
  pumped: "anticipation",
  hyped: "anticipation",
  keen: "anticipation",
}

export function analyzeEmotion(text: string): EmotionScore {
  const lowerText = text.toLowerCase()
  
  // Sentence-level analysis - split into sentences first
  const sentences = lowerText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  
  // Better word extraction - handle contractions, punctuation, etc.
  const words = lowerText
    .replace(/[.,!?;:'"()\[\]{}]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0)

  const emotions = {
    joy: 0,
    trust: 0,
    fear: 0,
    surprise: 0,
    sadness: 0,
    disgust: 0,
    anger: 0,
    anticipation: 0,
  }

  let intensity = 50
  let emotionCount = 0

  // Sentence-level context analysis
  sentences.forEach((sentence) => {
    const sentenceWords = sentence.split(/\s+/).filter(w => w.length > 0)
    let sentenceEmotionScore = 0
    
    // Analyze each word in sentence context
    sentenceWords.forEach((word, wordIndex) => {
      const cleanWord = word.trim()
      if (!cleanWord) return

      // Check single word
      if (emotionKeywords[cleanWord]) {
        const emotion = emotionKeywords[cleanWord]
        emotions[emotion as keyof typeof emotions]++
        emotionCount++
        sentenceEmotionScore++
      }

      // Check two-word phrases
      if (wordIndex < sentenceWords.length - 1) {
        const twoWord = `${cleanWord}_${sentenceWords[wordIndex + 1]}`
        if (emotionKeywords[twoWord]) {
          const emotion = emotionKeywords[twoWord]
          emotions[emotion as keyof typeof emotions]++
          emotionCount++
          sentenceEmotionScore++
        }
      }

      // Check three-word phrases
      if (wordIndex < sentenceWords.length - 2) {
        const threeWord = `${cleanWord}_${sentenceWords[wordIndex + 1]}_${sentenceWords[wordIndex + 2]}`
        if (emotionKeywords[threeWord]) {
          const emotion = emotionKeywords[threeWord]
          emotions[emotion as keyof typeof emotions]++
          emotionCount++
          sentenceEmotionScore++
        }
      }
    })
    
    // Boost emotions if sentence has multiple emotion words (contextual intensity)
    if (sentenceEmotionScore > 1) {
      Object.keys(emotions).forEach((key) => {
        if (emotions[key as keyof typeof emotions] > 0) {
          emotions[key as keyof typeof emotions] += Math.floor(sentenceEmotionScore * 0.5)
        }
      })
    }
  })

  // Also do word-level analysis for comprehensive coverage
  words.forEach((word, index) => {
    const cleanWord = word.trim()
    if (!cleanWord) return

    // Check single word (avoid double counting)
    if (emotionKeywords[cleanWord] && !words.slice(0, index).includes(cleanWord)) {
      const emotion = emotionKeywords[cleanWord]
      // Only add if not already counted in sentence analysis
      if (emotions[emotion as keyof typeof emotions] === 0) {
        emotions[emotion as keyof typeof emotions]++
        emotionCount++
      }
    }

    // Detect intensity modifiers
    const intensityBoosters = [
      "very",
      "extremely",
      "absolutely",
      "so",
      "really",
      "incredibly",
      "totally",
      "completely",
      "utterly",
      "absolutely",
      "highly",
      "deeply",
      "intensely",
      "profoundly",
      "immensely",
      "tremendously",
      "exceptionally",
      "remarkably",
      "unbelievably",
      "extraordinarily",
    ]
    const intensityReducers = [
      "slightly",
      "somewhat",
      "kind_of",
      "maybe",
      "perhaps",
      "possibly",
      "a_bit",
      "a_little",
      "rather",
      "quite",
      "fairly",
      "moderately",
      "somewhat",
      "mildly",
    ]

    if (intensityBoosters.includes(cleanWord)) {
      intensity = Math.min(100, intensity + 15)
    }
    if (intensityReducers.includes(cleanWord)) {
      intensity = Math.max(20, intensity - 10)
    }

    // Exclamation marks increase intensity
    if (text[index] === "!") {
      intensity = Math.min(100, intensity + 5)
    }
  })

  // If no emotions detected, analyze text patterns
  if (emotionCount === 0) {
    // Check for emotional patterns
    const positivePatterns = [
      /\b(good|nice|okay|ok|fine|alright|well)\b/gi,
      /\b(thank|thanks|appreciate)\b/gi,
      /\b(please|kindly)\b/gi,
    ]
    const negativePatterns = [
      /\b(bad|terrible|awful|horrible|worst)\b/gi,
      /\b(no|not|never|can't|cannot|won't|don't)\b/gi,
      /\b(problem|issue|trouble|difficulty|challenge)\b/gi,
    ]

    positivePatterns.forEach((pattern) => {
      if (pattern.test(text)) {
        emotions.trust += 1
        emotionCount++
      }
    })

    negativePatterns.forEach((pattern) => {
      if (pattern.test(text)) {
        emotions.fear += 1
        emotionCount++
      }
    })
  }

  // Normalize emotion scores with better algorithm
  const totalEmotionScore = Object.values(emotions).reduce((sum, val) => sum + val, 0)
  const maxEmotion = Math.max(...Object.values(emotions), 1)
  
  if (totalEmotionScore > 0) {
    // Normalize to percentages based on max emotion (better visualization)
    Object.keys(emotions).forEach((key) => {
      const rawScore = emotions[key as keyof typeof emotions]
      if (maxEmotion > 0) {
        // Scale based on max emotion, ensuring at least 10% visibility if detected
        const percentage = (rawScore / maxEmotion) * 100
        emotions[key as keyof typeof emotions] = Math.min(100, Math.max(percentage, rawScore > 0 ? 10 : 0))
      } else {
        emotions[key as keyof typeof emotions] = rawScore > 0 ? 10 : 0
      }
    })
  } else {
    // If no emotions detected, use pattern matching results or set minimal values
    if (emotionCount === 0) {
      // Set all to 0 for truly neutral text
      Object.keys(emotions).forEach((key) => {
        emotions[key as keyof typeof emotions] = 0
      })
      intensity = 30
    }
  }
  
  // Ensure intensity is reasonable
  if (intensity < 20) intensity = 20
  if (intensity > 100) intensity = 100

  // Determine overall sentiment
  const positiveScore = emotions.joy + emotions.trust + emotions.anticipation
  const negativeScore = emotions.fear + emotions.sadness + emotions.disgust + emotions.anger
  const neutralBase = emotions.surprise

  let sentiment: "positive" | "neutral" | "negative" = "neutral"
  if (positiveScore > negativeScore + 10) sentiment = "positive"
  else if (negativeScore > positiveScore + 10) sentiment = "negative"

  return {
    sentiment,
    intensity,
    emotions,
  }
}

export function getMoodRecommendation(score: EmotionScore): string {
  if (score.sentiment === "positive") {
    return "You're in a great mindset! This is an excellent time to tackle challenging tasks or have important meetings."
  } else if (score.sentiment === "negative") {
    if (score.emotions.fear > 60) {
      return "Try taking a short break, deep breathing, or a quick walk to ease your anxiety."
    } else if (score.emotions.sadness > 60) {
      return "Consider reaching out to someone you trust or engaging in an activity you enjoy."
    }
    return "Take a moment for self-care. Consider meditation or a relaxing activity."
  }
  return "You seem balanced. Great time to focus on regular tasks or learning something new."
}
