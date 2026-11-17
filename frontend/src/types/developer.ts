export interface Dimensions {
  technical_depth: number;
  technical_breadth: number;
  consistency: number;
  project_complexity: number;
  collaboration: number;
  adaptability: number;
  impact: number;
}

export interface DimensionMetric {
  id: string;
  name: string;
  score: number;
  weight?: number;
  trend: string;
  explanation: string;
  iconName: string;
  evidence?: string;
  formulaDescription?: string;
}

export interface TechnologyNode {
  id: string;
  name: string;
  type: 'primary' | 'framework' | 'secondary' | 'supporting';
  parent?: string;
  usage: number;
  projects: number;
  repositories: number;
  momentum: 'RISING' | 'NEW' | 'STABLE';
  activity: string;
  color?: string;
}

export interface CareerRole {
  role: string;
  fit: number;
  strengths: string[];
  gaps: string[];
}

export interface NextBestSkillRecommendation {
  skill: string;
  currentFit: number;
  potentialImprovement: number;
  explanation: string;
  roadmap: string[];
}

export interface RepositoryItem {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  complexity: number;
  complexityGrade: 'A+' | 'A' | 'B+' | 'B';
  status: 'ACTIVE' | 'RECENT' | 'LEGACY';
  technologies: string[];
  lastUpdated: string;
  url?: string;
  hasReadme?: boolean;
  hasLicense?: boolean;
  licenseName?: string;
  hasCi?: boolean;
  healthScore?: number;
  healthStatus?: 'HEALTHY' | 'FAIR' | 'ACTION_REQUIRED';
  isArchived?: boolean;
}

export type MilestoneType = 'score_snapshot' | 'repository_milestone';

export interface GrowthMilestone {
  year: string;
  score?: number; // Present ONLY when an authentic measurement or historical snapshot exists
  depth?: number;
  complexity?: number;
  hasScoreMeasurement: boolean;
  milestoneType: MilestoneType;
  milestone: string;
  technologies: string[];
  description: string;
  repoCount?: number;
  timestamp?: string;
}

export interface ScoreSnapshot {
  id: string; // Stable: snapshot_{username}_{date}
  username: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  score: number;
  depth: number;
  complexity: number;
  firstScannedAt?: string;
  scanCount?: number;
}

export type DataConfidenceTier = 'HIGH_CONFIDENCE' | 'MODERATE_CONFIDENCE' | 'PRELIMINARY_EVIDENCE' | 'INSUFFICIENT_EVIDENCE';

export interface DataQualityReport {
  tier: DataConfidenceTier;
  tierLabel: string;
  coveragePercent: number;
  isLive: boolean;
  sourceReliability: 'AUTHENTIC_GITHUB_API' | 'BENCHMARK_VERIFIED_RECORD' | 'CACHED_RECORD';
  scannedRepos: number;
  calendarCommits: number;
  rateLimitStatus: string;
  verifiedSignals: string[];
  unverifiedSignals?: string[];
  signalBreakdown: {
    identityVerified: boolean;
    repositoryEvidence: boolean;
    activitySpectrum: boolean;
    multiStackEvidence: boolean;
  };
  freshnessTimestamp?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  criteria: string;
  evidence: string;
  icon: string;
  unlocked: boolean;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress: number;
  category: 'habit' | 'skill' | 'open-source' | 'architecture';
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'bluesky' | 'mastodon' | 'website';
  name: string;
  url: string;
}

export interface DeveloperProfile {
  github_id?: number;
  node_id?: string;
  html_url?: string;
  is_demo?: boolean;
  verified_identity?: boolean;
  data_source?: 'live' | 'benchmark' | 'cached';
  fetched_at?: string;
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  tags: string[];
  social_links?: SocialLink[];
  stats: {
    repositories: number;
    contributions: number;
    week_streak: number;
    followers: number;
    following: number;
  };
  developer_score: number;
  score_change: number;
  percentile_rank: number;
  tier: string;
  archetype: {
    title: string;
    description: string;
    badge: string;
    skills: string[];
  };
  dimensions: Dimensions;
  dimensionMetrics: DimensionMetric[];
  tech_dna: TechnologyNode[];
  careers: CareerRole[];
  next_best_skill: NextBestSkillRecommendation;
  repositories: RepositoryItem[];
  growth_timeline: GrowthMilestone[];
  rhythm: {
    peak_time: string;
    most_active_day: string;
    current_streak_weeks: number;
    consistency_score: number;
    matrix: number[][]; // 7 days x 24 hours
  };
  contributionWeeks?: number[][]; // 30+ weeks x 7 days real contribution matrix
  weekDates?: string[]; // Date of Sunday for each week
  achievements: AchievementBadge[];
  motivationNotes: string[];
  dataQuality?: DataQualityReport;
}
