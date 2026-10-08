import type { TechnologyNode } from '../types/developer';

export interface TechDefinition {
  id: string;
  name: string;
  type: 'primary' | 'framework' | 'secondary' | 'supporting';
  parent?: string;
  category: 'frontend' | 'backend' | 'devops' | 'data' | 'system' | 'mobile';
  keywords: string[];
  color: string;
}

export const TECH_CATALOG: TechDefinition[] = [
  // Primary Languages
  { id: 'javascript', name: 'JavaScript', type: 'primary', category: 'frontend', keywords: ['javascript', 'js'], color: '#F7DF1E' },
  { id: 'typescript', name: 'TypeScript', type: 'primary', parent: 'javascript', category: 'frontend', keywords: ['typescript', 'ts'], color: '#3178C6' },
  { id: 'python', name: 'Python', type: 'primary', category: 'backend', keywords: ['python', 'py'], color: '#3776AB' },
  { id: 'cpp', name: 'C++', type: 'primary', category: 'system', keywords: ['c++', 'cpp'], color: '#00599C' },
  { id: 'c', name: 'C', type: 'primary', category: 'system', keywords: ['c'], color: '#A8B9CC' },
  { id: 'rust', name: 'Rust', type: 'primary', category: 'system', keywords: ['rust', 'rs'], color: '#DEA584' },
  { id: 'go', name: 'Go', type: 'primary', category: 'backend', keywords: ['go', 'golang'], color: '#00ADD8' },
  { id: 'java', name: 'Java', type: 'primary', category: 'backend', keywords: ['java'], color: '#ED8B00' },
  { id: 'css', name: 'CSS / Styling', type: 'primary', category: 'frontend', keywords: ['css', 'scss', 'sass'], color: '#1572B6' },
  { id: 'sql', name: 'SQL', type: 'primary', category: 'backend', keywords: ['sql', 'rdbms'], color: '#CC292B' },
  { id: 'devops', name: 'DevOps / Cloud', type: 'primary', category: 'devops', keywords: ['devops', 'cloud', 'infra'], color: '#2496ED' },

  // Frameworks & Libraries
  { id: 'react', name: 'React', type: 'framework', parent: 'javascript', category: 'frontend', keywords: ['react', 'reactjs'], color: '#61DAFB' },
  { id: 'nextjs', name: 'Next.js', type: 'framework', parent: 'react', category: 'frontend', keywords: ['nextjs', 'next.js', 'next'], color: '#000000' },
  { id: 'vue', name: 'Vue.js', type: 'framework', parent: 'javascript', category: 'frontend', keywords: ['vue', 'vuejs'], color: '#42B883' },
  { id: 'fastapi', name: 'FastAPI', type: 'framework', parent: 'python', category: 'backend', keywords: ['fastapi'], color: '#059669' },
  { id: 'django', name: 'Django', type: 'framework', parent: 'python', category: 'backend', keywords: ['django'], color: '#092E20' },
  { id: 'flask', name: 'Flask', type: 'framework', parent: 'python', category: 'backend', keywords: ['flask'], color: '#000000' },
  { id: 'nodejs', name: 'Node.js', type: 'framework', parent: 'javascript', category: 'backend', keywords: ['node', 'nodejs', 'express'], color: '#339933' },
  { id: 'tailwind', name: 'TailwindCSS', type: 'framework', parent: 'css', category: 'frontend', keywords: ['tailwind', 'tailwindcss'], color: '#38BDF8' },
  { id: 'pytorch', name: 'PyTorch', type: 'framework', parent: 'python', category: 'data', keywords: ['pytorch', 'torch', 'deep-learning'], color: '#EE4C2C' },
  { id: 'tensorflow', name: 'TensorFlow', type: 'framework', parent: 'python', category: 'data', keywords: ['tensorflow', 'keras'], color: '#FF6F00' },
  { id: 'pandas', name: 'Pandas / NumPy', type: 'framework', parent: 'python', category: 'data', keywords: ['pandas', 'numpy', 'scipy'], color: '#150458' },
  { id: 'docker', name: 'Docker', type: 'framework', parent: 'devops', category: 'devops', keywords: ['docker', 'container', 'dockerfile'], color: '#2496ED' },
  { id: 'kubernetes', name: 'Kubernetes', type: 'framework', parent: 'docker', category: 'devops', keywords: ['kubernetes', 'k8s'], color: '#326CE5' },
  { id: 'postgresql', name: 'PostgreSQL', type: 'framework', parent: 'sql', category: 'backend', keywords: ['postgres', 'postgresql', 'psql'], color: '#4169E1' },
  { id: 'mongodb', name: 'MongoDB', type: 'framework', parent: 'sql', category: 'backend', keywords: ['mongo', 'mongodb', 'mongoose'], color: '#47A248' },
  { id: 'redis', name: 'Redis', type: 'framework', parent: 'devops', category: 'backend', keywords: ['redis', 'caching'], color: '#DC382D' },
  { id: 'git', name: 'Git & GitHub Actions', type: 'supporting', parent: 'devops', category: 'devops', keywords: ['git', 'github-actions', 'ci-cd'], color: '#F05032' },
  { id: 'linux', name: 'Linux / Systems', type: 'supporting', parent: 'system', category: 'system', keywords: ['linux', 'bash', 'shell'], color: '#FCC624' },
  { id: 'flutter', name: 'Flutter', type: 'framework', parent: 'javascript', category: 'mobile', keywords: ['flutter', 'dart'], color: '#02569B' },
  { id: 'dsa', name: 'Algorithms / DSA', type: 'framework', parent: 'cpp', category: 'system', keywords: ['dsa', 'leetcode', 'algorithms', 'competitive-programming'], color: '#8B5CF6' }
];

export class TechnologyService {
  public static buildConstellation(rawUsage: { [key: string]: number }): TechnologyNode[] {
    const nodes: TechnologyNode[] = [];
    const totalUsage = Object.values(rawUsage).reduce((a, b) => a + b, 0) || 1;

    for (const [key, val] of Object.entries(rawUsage)) {
      const match = TECH_CATALOG.find(t => 
        t.name.toLowerCase() === key.toLowerCase() || 
        t.id.toLowerCase() === key.toLowerCase() ||
        t.keywords.includes(key.toLowerCase())
      );

      const usagePct = Number(((val / totalUsage) * 100).toFixed(1));
      if (match) {
        nodes.push({
          id: match.id,
          name: match.name,
          type: match.type,
          parent: match.parent,
          usage: usagePct,
          projects: Math.max(1, Math.round((val / totalUsage) * 12)),
          repositories: Math.max(1, Math.round((val / totalUsage) * 8)),
          momentum: usagePct > 20 ? 'RISING' : (usagePct > 10 ? 'NEW' : 'STABLE'),
          activity: usagePct > 18 ? 'High' : 'Moderate',
          color: match.color
        });
      }
    }

    return nodes;
  }
}
