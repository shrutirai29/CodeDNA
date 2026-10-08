import type { GrowthMilestone, AchievementBadge } from '../types/developer';

export class AnalyticsService {
  public static getGrowthTimeline(baseScore: number): GrowthMilestone[] {
    return [
      {
        year: '2022',
        score: Math.max(45, Math.round(baseScore - 26)),
        depth: 52,
        complexity: 48,
        milestone: 'First Major Project',
        technologies: ['C++', 'Python', 'Algorithms'],
        description: 'Began building core data structures, algorithms, and fundamental computer science applications.'
      },
      {
        year: '2023',
        score: Math.max(58, Math.round(baseScore - 18)),
        depth: 64,
        complexity: 62,
        milestone: 'Backend Stack Expanded',
        technologies: ['Python', 'FastAPI', 'PostgreSQL'],
        description: 'Architected first microservice APIs, database relational schemas, and backend automation scripts.'
      },
      {
        year: '2024',
        score: Math.max(68, Math.round(baseScore - 10)),
        depth: 74,
        complexity: 76,
        milestone: 'Open-Source Contribution',
        technologies: ['JavaScript', 'React', 'TailwindCSS'],
        description: 'Delivered Smart India Hackathon civic platform prototypes and joined collaborative open-source repositories.'
      },
      {
        year: '2025',
        score: Math.max(78, Math.round(baseScore - 4)),
        depth: 82,
        complexity: 84,
        milestone: 'Multi-Stack Developer',
        technologies: ['TypeScript', 'Next.js', 'Docker'],
        description: 'Transitioned to TypeScript strict typing, full-stack microservices, and gamified web platforms.'
      },
      {
        year: '2026',
        score: baseScore,
        depth: 91,
        complexity: 89,
        milestone: 'AI Platform Architect',
        technologies: ['Python', 'FastAPI', 'Gemini AI', 'PyTorch'],
        description: 'Shipped CodeDNA analytics platform with dual-engine AI copilot and developer intelligence algorithms.'
      }
    ];
  }

  public static generateRhythmMatrix(): number[][] {
    const matrix: number[][] = [];
    for (let day = 0; day < 7; day++) {
      const row: number[] = [];
      for (let hour = 0; hour < 24; hour++) {
        let intensity = 0;
        const isPeakHour = (hour >= 18 && hour <= 23);
        const isMidday = (hour >= 10 && hour <= 14);

        if (day === 3) {
          if (isPeakHour) intensity = Math.random() > 0.2 ? 4 : 3;
          else if (isMidday) intensity = Math.random() > 0.4 ? 3 : 2;
          else intensity = Math.random() > 0.7 ? 1 : 0;
        } else if (day < 5) {
          if (isPeakHour) intensity = Math.random() > 0.3 ? 3 : 2;
          else if (isMidday) intensity = Math.random() > 0.5 ? 2 : 1;
          else intensity = Math.random() > 0.8 ? 1 : 0;
        } else {
          if (hour >= 14 && hour <= 20) intensity = Math.random() > 0.4 ? 3 : 1;
          else intensity = Math.random() > 0.85 ? 1 : 0;
        }
        row.push(intensity);
      }
      matrix.push(row);
    }
    return matrix;
  }

  public static getAchievements(): AchievementBadge[] {
    return [
      {
        id: 'consistency-builder',
        title: 'Consistency Builder',
        description: 'Coded continuously across 12+ consecutive weeks without hiatus.',
        icon: 'Flame',
        unlocked: true,
        progress: 100,
        category: 'habit'
      },
      {
        id: 'fullstack-builder',
        title: 'Full-Stack Builder',
        description: 'Merged production repositories containing frontend, backend, and database tiers.',
        icon: 'Layers',
        unlocked: true,
        progress: 100,
        category: 'skill'
      },
      {
        id: 'open-source-contributor',
        title: 'Open Source Contributor',
        description: 'Collaborated on civic hackathon prototypes and shared public modules.',
        icon: 'GitPullRequest',
        unlocked: true,
        progress: 100,
        category: 'open-source'
      },
      {
        id: 'systems-thinker',
        title: 'Systems Thinker',
        description: 'Solved high-complexity algorithmic challenges and architectural patterns.',
        icon: 'Cpu',
        unlocked: true,
        progress: 88,
        category: 'architecture'
      },
      {
        id: 'rapid-learner',
        title: 'Rapid Learner',
        description: 'Adopted 3+ brand new frameworks in the past 6 months.',
        icon: 'Zap',
        unlocked: true,
        progress: 100,
        category: 'skill'
      },
      {
        id: 'project-shipper',
        title: 'Project Shipper',
        description: 'Shipped and deployed 5+ live applications with verified GitHub commits.',
        icon: 'Rocket',
        unlocked: true,
        progress: 92,
        category: 'architecture'
      }
    ];
  }

  public static getMotivationalNotes(): string[] {
    return [
      'Your consistency is improving.',
      '3 more weeks to beat your all-time coding streak.',
      'You unlocked a new technology cluster: Applied AI & Cloud.',
      "You're stronger in backend architectures than 82% of your peers.",
      'Your portfolio complexity increased 14% this quarter.',
      '1 skill away from reaching the next career tier.'
    ];
  }
}
