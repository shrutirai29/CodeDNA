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
  trend: string;
  explanation: string;
  iconName: string;
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
}

export interface GrowthMilestone {
  year: string;
  score: number;
  depth: number;
  complexity: number;
  milestone: string;
  technologies: string[];
  description: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  category: 'habit' | 'skill' | 'open-source' | 'architecture';
}

export interface DeveloperProfile {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  tags: string[];
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
    matrix: number[][]; // 7 days x 24 hours (or 7 x 7 buckets)
  };
  achievements: AchievementBadge[];
  motivationNotes: string[];
}
