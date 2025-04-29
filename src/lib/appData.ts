
export type AppStore = 'Apple App Store' | 'Google Play' | 'Both';

export type DrugRating = 
  | 'Tool' 
  | 'Sugar'
  | 'Coffee'
  | 'Alcohol'
  | 'Drug';

export type BusinessModel =
  | 'Pay Once'
  | 'Subscription'
  | 'Freemium'
  | 'Advertising'
  | 'In-App Purchases'
  | 'Unknown';

export interface DrugFactor {
  name: string;
  description: string;
  present: boolean;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  store: AppStore;
  rating: DrugRating;
  description: string;
  category: string;
  developer: string;
  businessModel?: BusinessModel;
  factors: DrugFactor[];
  lastUpdated?: Date;
}

export const drugFactors = [
  {
    name: "Infinite Scroll",
    description: "Content that loads endlessly as you scroll, eliminating natural stopping points."
  },
  {
    name: "Variable Rewards",
    description: "Unpredictable rewards (likes, matches, etc.) that create addiction through anticipation."
  },
  {
    name: "Social Validation",
    description: "Features that tie self-worth to social approval metrics like likes and followers."
  },
  {
    name: "FOMO Triggers",
    description: "Elements that create Fear Of Missing Out, causing anxiety about not using the app."
  },
  {
    name: "Artificial Urgency",
    description: "Countdowns, limited-time offers, and other time pressures that force quick decisions."
  },
  {
    name: "Autoplay",
    description: "Content that automatically plays the next item without user action."
  },
  {
    name: "Push Notifications",
    description: "Excessive alerts that pull users back into the app repeatedly."
  },
  {
    name: "Gamification Elements",
    description: "Points, badges, and streaks that create compulsive engagement loops."
  },
  {
    name: "Business Model: Advertising",
    description: "App makes money by showing ads, incentivizing longer usage times to increase ad impressions."
  },
  {
    name: "Business Model: In-App Purchases",
    description: "App uses psychological triggers to encourage impulse purchases."
  }
];

export const sampleApps: App[] = [
  {
    id: "1",
    name: "Instagram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1024px-Instagram_logo_2022.svg.png",
    store: "Both",
    rating: "Drug",
    description: "Photo and video sharing social networking service",
    category: "Social",
    developer: "Meta",
    businessModel: "Advertising",
    factors: [
      { name: "Infinite Scroll", description: drugFactors[0].description, present: true },
      { name: "Variable Rewards", description: drugFactors[1].description, present: true },
      { name: "Social Validation", description: drugFactors[2].description, present: true },
      { name: "FOMO Triggers", description: drugFactors[3].description, present: true },
      { name: "Autoplay", description: drugFactors[5].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Gamification Elements", description: drugFactors[7].description, present: false },
      { name: "Business Model: Advertising", description: drugFactors[8].description, present: true }
    ]
  },
  {
    id: "2",
    name: "Notion",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    store: "Both",
    rating: "Tool",
    description: "All-in-one workspace for notes, tasks, wikis, and databases",
    category: "Productivity",
    developer: "Notion Labs",
    businessModel: "Subscription",
    factors: [
      { name: "Infinite Scroll", description: drugFactors[0].description, present: false },
      { name: "Variable Rewards", description: drugFactors[1].description, present: false },
      { name: "Social Validation", description: drugFactors[2].description, present: false },
      { name: "FOMO Triggers", description: drugFactors[3].description, present: false },
      { name: "Artificial Urgency", description: drugFactors[4].description, present: false },
      { name: "Autoplay", description: drugFactors[5].description, present: false },
      { name: "Push Notifications", description: drugFactors[6].description, present: false },
      { name: "Business Model: Advertising", description: drugFactors[8].description, present: false }
    ]
  },
  {
    id: "3",
    name: "TikTok",
    icon: "https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png",
    store: "Both",
    rating: "Drug",
    description: "Short-form, video-sharing app for entertainment",
    category: "Entertainment",
    developer: "ByteDance",
    businessModel: "Advertising",
    factors: [
      { name: "Infinite Scroll", description: drugFactors[0].description, present: true },
      { name: "Variable Rewards", description: drugFactors[1].description, present: true },
      { name: "Social Validation", description: drugFactors[2].description, present: true },
      { name: "Autoplay", description: drugFactors[5].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Business Model: Advertising", description: drugFactors[8].description, present: true }
    ]
  },
  {
    id: "4",
    name: "Duolingo",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Duolingo_logo.svg/1200px-Duolingo_logo.svg.png",
    store: "Both",
    rating: "Sugar",
    description: "Language learning platform",
    category: "Education",
    developer: "Duolingo, Inc.",
    businessModel: "Freemium",
    factors: [
      { name: "Variable Rewards", description: drugFactors[1].description, present: true },
      { name: "Artificial Urgency", description: drugFactors[4].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Gamification Elements", description: drugFactors[7].description, present: true },
      { name: "Business Model: In-App Purchases", description: drugFactors[9].description, present: true }
    ]
  },
  {
    id: "5",
    name: "Headspace",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Headspace_logo.svg",
    store: "Both",
    rating: "Tool",
    description: "Meditation and mindfulness app",
    category: "Health & Fitness",
    developer: "Headspace Inc.",
    businessModel: "Subscription",
    factors: [
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Gamification Elements", description: drugFactors[7].description, present: true }
    ]
  },
  {
    id: "6",
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png",
    store: "Both",
    rating: "Alcohol",
    description: "Video sharing platform",
    category: "Entertainment",
    developer: "Google LLC",
    businessModel: "Advertising",
    factors: [
      { name: "Infinite Scroll", description: drugFactors[0].description, present: true },
      { name: "Variable Rewards", description: drugFactors[1].description, present: true },
      { name: "Autoplay", description: drugFactors[5].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Business Model: Advertising", description: drugFactors[8].description, present: true }
    ]
  },
  {
    id: "7",
    name: "Apple Calendar",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Calendar_App_from_iOS_13.png",
    store: "Apple App Store",
    rating: "Tool",
    description: "Calendar and scheduling app",
    category: "Productivity",
    developer: "Apple Inc.",
    businessModel: "Pay Once",
    factors: [
      { name: "Push Notifications", description: drugFactors[6].description, present: true }
    ]
  },
  {
    id: "8",
    name: "Candy Crush Saga",
    icon: "https://upload.wikimedia.org/wikipedia/en/3/36/Candy_Crush_logo.png",
    store: "Both",
    rating: "Drug",
    description: "Match-three puzzle game",
    category: "Games",
    developer: "King",
    businessModel: "In-App Purchases",
    factors: [
      { name: "Variable Rewards", description: drugFactors[1].description, present: true },
      { name: "Artificial Urgency", description: drugFactors[4].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Gamification Elements", description: drugFactors[7].description, present: true },
      { name: "Business Model: In-App Purchases", description: drugFactors[9].description, present: true }
    ]
  },
  {
    id: "9",
    name: "Gmail",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
    store: "Both",
    rating: "Sugar",
    description: "Email service developed by Google",
    category: "Productivity",
    developer: "Google LLC",
    businessModel: "Advertising",
    factors: [
      { name: "Push Notifications", description: drugFactors[6].description, present: true },
      { name: "Business Model: Advertising", description: drugFactors[8].description, present: true }
    ]
  },
  {
    id: "10",
    name: "Slack",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
    store: "Both",
    rating: "Coffee",
    description: "Business communication platform",
    category: "Business",
    developer: "Slack Technologies",
    businessModel: "Subscription",
    factors: [
      { name: "FOMO Triggers", description: drugFactors[3].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true }
    ]
  },
  {
    id: "11",
    name: "Netflix",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
    store: "Both",
    rating: "Alcohol",
    description: "Subscription-based streaming service",
    category: "Entertainment",
    developer: "Netflix, Inc.",
    businessModel: "Subscription",
    factors: [
      { name: "Autoplay", description: drugFactors[5].description, present: true },
      { name: "Infinite Scroll", description: drugFactors[0].description, present: true },
      { name: "Push Notifications", description: drugFactors[6].description, present: true }
    ]
  },
  {
    id: "12",
    name: "Forest",
    icon: "https://play-lh.googleusercontent.com/l4maMYOgJGZO2TD6ltclHJaM-ZWdfA8xQo40ZK-YYtN0yEqlgClCG0uVpgk6I1JqbcgL=w240-h480-rw",
    store: "Both",
    rating: "Tool",
    description: "Stay focused, be present",
    category: "Productivity",
    developer: "Seekrtech",
    businessModel: "Pay Once",
    factors: [
      { name: "Gamification Elements", description: drugFactors[7].description, present: true }
    ]
  }
];
