import type { CareerRole, NextBestSkillRecommendation } from '../types/developer';

export class CareerService {
  public static calculateRoles(technologies: string[], depth: number, breadth: number): CareerRole[] {
    const techLower = technologies.map(t => t.toLowerCase());

    const hasWeb = techLower.some(t => ['javascript', 'typescript', 'react', 'next.js', 'vue', 'html', 'css', 'tailwind'].some(k => t.includes(k)));
    const hasBackend = techLower.some(t => ['python', 'node', 'fastapi', 'django', 'express', 'sql', 'postgresql', 'mongodb'].some(k => t.includes(k)));
    const hasData = techLower.some(t => ['python', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'scikit'].some(k => t.includes(k)));
    const hasSystems = techLower.some(t => ['c', 'c++', 'rust', 'go', 'dsa', 'algorithms'].some(k => t.includes(k)));
    const hasDevOps = techLower.some(t => ['docker', 'kubernetes', 'linux', 'ci/cd', 'github actions', 'cloud'].some(k => t.includes(k)));
    const hasMobile = techLower.some(t => ['flutter', 'react native', 'dart', 'kotlin', 'swift'].some(k => t.includes(k)));

    return [
      {
        role: 'Full-Stack Developer',
        fit: hasWeb && hasBackend ? Math.min(96, Math.round(75 + breadth * 0.2)) : 68,
        strengths: ['JavaScript / TypeScript', 'React / UI Architecture', 'REST APIs & Full-Stack Flow'],
        gaps: ['Containerized Staging (Docker)', 'End-to-End Testing (Playwright)']
      },
      {
        role: 'Backend Engineer',
        fit: hasBackend ? Math.min(92, Math.round(70 + depth * 0.2)) : 62,
        strengths: ['Python Architecture', 'FastAPI & Microservices', 'Relational Schemas'],
        gaps: ['Distributed Caching (Redis)', 'Message Queues (Kafka)']
      },
      {
        role: 'Frontend Engineer',
        fit: hasWeb ? Math.min(90, Math.round(72 + breadth * 0.18)) : 58,
        strengths: ['Modern Component Composition', 'TailwindCSS Styling', 'Interactive UX & State'],
        gaps: ['Micro-frontends', 'Advanced Canvas Performance']
      },
      {
        role: 'Data Scientist / ML Engineer',
        fit: hasData ? Math.min(88, Math.round(65 + depth * 0.2)) : 48,
        strengths: ['Python Numerical Tooling', 'Model Prototyping', 'Exploratory Data Analysis'],
        gaps: ['Distributed Training', 'Feature Stores / MLOps']
      },
      {
        role: 'Systems & Software Engineer',
        fit: hasSystems ? Math.min(89, Math.round(62 + depth * 0.25)) : 54,
        strengths: ['Algorithmic Efficiency', 'Data Structures (DSA)', 'Memory Hierarchy Basics'],
        gaps: ['Low-level Concurrency', 'Kernel Internals']
      },
      {
        role: 'DevOps & Cloud Engineer',
        fit: hasDevOps ? Math.min(85, Math.round(60 + breadth * 0.22)) : 46,
        strengths: ['Git Automation', 'Linux Command Line', 'Cloud Deployments'],
        gaps: ['Kubernetes Helm Charts', 'Terraform Infrastructure as Code']
      },
      {
        role: 'Mobile Application Developer',
        fit: hasMobile ? Math.min(82, Math.round(58 + breadth * 0.2)) : 42,
        strengths: ['Component Reusability', 'Responsive Touch Interfaces'],
        gaps: ['Native iOS/Android SDKs', 'Offline SQLite Sync']
      }
    ].sort((a, b) => b.fit - a.fit);
  }

  public static getNextBestSkill(roles: CareerRole[]): NextBestSkillRecommendation {
    const topRole = roles[0];
    return {
      skill: 'Docker + Kubernetes',
      currentFit: topRole ? topRole.fit : 86,
      potentialImprovement: 8.5,
      explanation: 'Learning containerization and orchestration could significantly improve your Full-Stack and DevOps career fit.',
      roadmap: [
        'Containerize current FastAPI and React applications',
        'Multi-stage Docker builds for minimal production images',
        'Local orchestration with Docker Compose',
        'Deploy workloads to managed Kubernetes (EKS/GKE)'
      ]
    };
  }
}
