import type { Dimensions, DimensionMetric } from '../types/developer';

export class ScoringService {
  public static calculateDeveloperScore(dimensions: Dimensions): {
    score: number;
    tier: string;
    percentile: number;
    metrics: DimensionMetric[];
  } {
    const depth = dimensions.technical_depth;
    const quality = dimensions.project_complexity;
    const habit = dimensions.consistency;
    const variety = dimensions.technical_breadth;
    const teamwork = dimensions.collaboration;
    const impact = dimensions.impact;

    const weightedScore = Number((
      depth * 0.20 +
      quality * 0.20 +
      habit * 0.15 +
      variety * 0.15 +
      teamwork * 0.10 +
      impact * 0.10
    ).toFixed(1));

    let tier = 'CORE BUILDER';
    if (weightedScore >= 85) tier = 'ELITE SENIOR';
    else if (weightedScore < 70) tier = 'EMERGING SPECIALIST';

    const percentile = Math.min(99, Math.max(50, Math.round(50 + (weightedScore - 50) * 0.98)));

    const metrics: DimensionMetric[] = [
      {
        id: 'depth',
        name: 'CODE DEPTH',
        score: Math.round(depth),
        trend: '+4.2%',
        explanation: 'Strong algorithmic and architectural complexity.',
        iconName: 'Code'
      },
      {
        id: 'quality',
        name: 'CODE QUALITY',
        score: Math.round(quality),
        trend: '+2.1%',
        explanation: 'Clean repository structure, documentation, and automated tests.',
        iconName: 'ShieldCheck'
      },
      {
        id: 'habit',
        name: 'WEEKLY HABIT',
        score: Math.round(habit),
        trend: '+5.0%',
        explanation: 'High consistency with anti-burstiness discounts applied.',
        iconName: 'Flame'
      },
      {
        id: 'variety',
        name: 'SKILL VARIETY',
        score: Math.round(variety),
        trend: '+3.4%',
        explanation: 'Multi-stack versatility across frontend, backend, and tools.',
        iconName: 'Layers'
      },
      {
        id: 'teamwork',
        name: 'TEAMWORK',
        score: Math.round(teamwork),
        trend: '+0.8%',
        explanation: 'Pull requests, peer reviews, and open-source collaboration.',
        iconName: 'Users'
      },
      {
        id: 'impact',
        name: 'PROJECT IMPACT',
        score: Math.round(impact),
        trend: '+6.1%',
        explanation: 'High real-world utility, repository stars, and completeness.',
        iconName: 'Sparkles'
      }
    ];

    return {
      score: weightedScore,
      tier,
      percentile,
      metrics
    };
  }
}
