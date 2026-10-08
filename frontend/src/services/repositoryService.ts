import type { RepositoryItem } from '../types/developer';

export class RepositoryService {
  public static auditRepositories(repos: Partial<RepositoryItem>[]): RepositoryItem[] {
    return repos.map((r, i) => {
      const stars = r.stars || (10 - i * 2 > 0 ? 10 - i * 2 : 1);
      const forks = r.forks || Math.round(stars * 0.3);
      const complexity = r.complexity || Math.min(98, Math.max(65, 94 - i * 5));

      let grade: 'A+' | 'A' | 'B+' | 'B' = 'A';
      if (complexity >= 90) grade = 'A+';
      else if (complexity >= 80) grade = 'A';
      else if (complexity >= 70) grade = 'B+';
      else grade = 'B';

      let status: 'ACTIVE' | 'RECENT' | 'LEGACY' = 'RECENT';
      if (i < 2) status = 'ACTIVE';
      else if (i < 4) status = 'RECENT';
      else status = 'LEGACY';

      return {
        id: r.id || `repo-${i}`,
        name: r.name || 'Repository',
        description: r.description || 'Open source engineering project built with modern technologies.',
        stars,
        forks,
        complexity,
        complexityGrade: grade,
        status,
        technologies: r.technologies || ['TypeScript', 'React', 'Python'],
        lastUpdated: r.lastUpdated || (i === 0 ? '2 days ago' : `${i * 2 + 1} weeks ago`),
        url: r.url || `https://github.com`
      };
    });
  }
}
