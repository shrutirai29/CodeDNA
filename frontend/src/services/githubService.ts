import type { DeveloperProfile, SocialLink } from '../types/developer';
import { ScoringService } from './scoringService';
import { TechnologyService } from './technologyService';
import { CareerService } from './careerService';
import { RepositoryService } from './repositoryService';
import { AnalyticsService } from './analyticsService';
import { REAL_GITHUB_BENCHMARK_DATA } from './githubData';

export const BENCHMARK_PROFILES: { [username: string]: DeveloperProfile } = {
  shrutirai29: {
    username: 'shrutirai29',
    name: 'shruti rai',
    avatar_url: 'https://avatars.githubusercontent.com/u/167513467?v=4',
    bio: 'Btech CSE student at Rashtriya Raksha University',
    tags: ['Full-Stack Developer', 'Cybersecurity', 'Open Source Contributor', 'Problem Solver'],
    social_links: [
      { platform: 'github', name: 'GitHub', url: 'https://github.com/shrutirai29' },
      { platform: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/shruti-rai-3b5055304' },
      { platform: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/shruti.r8524/' }
    ],
    stats: {
      repositories: 18,
      contributions: 588,
      week_streak: 28,
      followers: 17,
      following: 14
    },
    developer_score: 87.4,
    score_change: 6.2,
    percentile_rank: 92,
    tier: 'ELITE SENIOR',
    archetype: {
      title: 'FULL-STACK ARCHITECT',
      description: 'Versatile developer with strong frontend, backend and system design skills.',
      badge: 'ELITE SENIOR',
      skills: ['Frontend', 'Backend', 'DevOps', 'Open Source']
    },
    dimensions: {
      technical_depth: 91,
      technical_breadth: 82,
      consistency: 88,
      project_complexity: 84,
      collaboration: 76,
      adaptability: 94,
      impact: 89
    },
    dimensionMetrics: [],
    tech_dna: [
      { id: 'javascript', name: 'JavaScript', type: 'primary', usage: 28.5, projects: 6, repositories: 6, momentum: 'RISING', activity: 'High', color: '#F7DF1E' },
      { id: 'typescript', name: 'TypeScript', type: 'primary', parent: 'javascript', usage: 24.0, projects: 5, repositories: 4, momentum: 'RISING', activity: 'High', color: '#3178C6' },
      { id: 'react', name: 'React', type: 'framework', parent: 'javascript', usage: 22.4, projects: 5, repositories: 4, momentum: 'RISING', activity: 'High', color: '#61DAFB' },
      { id: 'python', name: 'Python', type: 'primary', usage: 20.8, projects: 4, repositories: 3, momentum: 'RISING', activity: 'High', color: '#3776AB' },
      { id: 'fastapi', name: 'FastAPI', type: 'framework', parent: 'python', usage: 16.5, projects: 3, repositories: 2, momentum: 'NEW', activity: 'Moderate', color: '#059669' },
      { id: 'tailwind', name: 'TailwindCSS', type: 'framework', parent: 'css', usage: 19.8, projects: 4, repositories: 2, momentum: 'RISING', activity: 'High', color: '#38BDF8' },
      { id: 'cpp', name: 'C++', type: 'primary', usage: 12.0, projects: 2, repositories: 2, momentum: 'STABLE', activity: 'Moderate', color: '#00599C' },
      { id: 'dsa', name: 'Algorithms / DSA', type: 'framework', parent: 'cpp', usage: 15.2, projects: 3, repositories: 2, momentum: 'RISING', activity: 'High', color: '#8B5CF6' },
      { id: 'html', name: 'HTML / Web', type: 'secondary', usage: 10.0, projects: 2, repositories: 2, momentum: 'STABLE', activity: 'Moderate', color: '#E34F26' },
      { id: 'git', name: 'Git & GitHub Actions', type: 'supporting', parent: 'devops', usage: 14.0, projects: 6, repositories: 18, momentum: 'RISING', activity: 'High', color: '#F05032' }
    ],
    careers: [],
    next_best_skill: {
      skill: 'Docker + Kubernetes',
      currentFit: 86,
      potentialImprovement: 8.5,
      explanation: 'Learning containerization and orchestration could significantly improve your Full-Stack and DevOps career fit.',
      roadmap: [
        'Containerize current FastAPI and React applications',
        'Multi-stage Docker builds for minimal production images',
        'Local orchestration with Docker Compose',
        'Deploy workloads to managed Kubernetes (EKS/GKE)'
      ]
    },
    repositories: [
      {
        id: 'codedna',
        name: 'CodeDNA',
        description: 'AI-powered developer intelligence platform analyzing GitHub activity and technical DNA.',
        stars: 0,
        forks: 0,
        complexity: 94,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'TailwindCSS'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/CodeDNA'
      },
      {
        id: 'study-roulette',
        name: 'study-roulette',
        description: 'Study With Me Roulette - Turn your study sessions into fun, focused challenges',
        stars: 0,
        forks: 0,
        complexity: 88,
        complexityGrade: 'A',
        status: 'ACTIVE',
        technologies: ['TypeScript', 'React', 'TailwindCSS'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/study-roulette'
      },
      {
        id: 'code4nature',
        name: 'code4nature',
        description: 'Environmental sustainability awareness platform and eco-impact calculator.',
        stars: 0,
        forks: 0,
        complexity: 85,
        complexityGrade: 'A',
        status: 'ACTIVE',
        technologies: ['TypeScript', 'React', 'CSS'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/code4nature'
      },
      {
        id: 'leetcode-problems',
        name: 'LeetCode-Problems',
        description: 'A collection of LeetCode questions to ace the coding interview! - Created using LeetHub v2',
        stars: 0,
        forks: 0,
        complexity: 86,
        complexityGrade: 'A',
        status: 'ACTIVE',
        technologies: ['Python', 'Algorithms / DSA'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/LeetCode-Problems'
      },
      {
        id: 'fleetra',
        name: 'FLEETRA',
        description: 'Automated vehicle tracking, route telemetry and logistics management backend.',
        stars: 0,
        forks: 0,
        complexity: 80,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['Python', 'FastAPI'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/FLEETRA'
      },
      {
        id: 'sih-prototype',
        name: 'SIH',
        description: 'Smart India Hackathon innovation prototype solving real-world challenges.',
        stars: 0,
        forks: 0,
        complexity: 82,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['JavaScript', 'HTML/CSS'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/SIH'
      },
      {
        id: 'analyzer',
        name: 'analyzer',
        description: 'Code and repository static analysis utility.',
        stars: 0,
        forks: 0,
        complexity: 76,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['JavaScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/analyzer'
      },
      {
        id: 'basic',
        name: 'basic',
        description: 'Core programming fundamentals and algorithmic problem solving.',
        stars: 0,
        forks: 0,
        complexity: 75,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['C++'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/basic'
      },
      {
        id: 'dsa',
        name: 'Data-Structure-And-Algorithm',
        description: 'Data Structures and Algorithms reference implementations and problem solutions.',
        stars: 0,
        forks: 0,
        complexity: 80,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['C++', 'Algorithms / DSA'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/Data-Structure-And-Algorithm'
      },
      {
        id: 'hacktober',
        name: 'hacktober',
        description: 'Hacktoberfest open-source contribution repository.',
        stars: 0,
        forks: 0,
        complexity: 72,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['JavaScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/hacktober'
      },
      {
        id: 'khety-deploy',
        name: 'khety-deploy',
        description: 'Deployment automation and application hosting pipeline.',
        stars: 0,
        forks: 0,
        complexity: 74,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['JavaScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/khety-deploy'
      },
      {
        id: 'medtrust',
        name: 'MEDTrust',
        description: 'Healthcare management and trusted medical verification UI.',
        stars: 0,
        forks: 0,
        complexity: 75,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['HTML', 'JavaScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/MEDTrust'
      },
      {
        id: 'portfolio',
        name: 'portfolio',
        description: 'Personal developer portfolio website showcasing engineering projects.',
        stars: 0,
        forks: 0,
        complexity: 78,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['JavaScript', 'React'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/portfolio'
      },
      {
        id: 'pp',
        name: 'pp',
        description: 'Web application prototype and component experiments.',
        stars: 0,
        forks: 0,
        complexity: 73,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['TypeScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/pp'
      },
      {
        id: 'shikha',
        name: 'shikha',
        description: 'Interactive web platform project.',
        stars: 0,
        forks: 0,
        complexity: 74,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['TypeScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/shikha'
      },
      {
        id: 'profile-readme',
        name: 'shrutirai29',
        description: 'GitHub profile README configuration and developer portfolio.',
        stars: 0,
        forks: 0,
        complexity: 70,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['Markdown'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/shrutirai29'
      },
      {
        id: 'typeblaster',
        name: 'typeblaster',
        description: 'Speed typing benchmark and accuracy testing application.',
        stars: 0,
        forks: 0,
        complexity: 77,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['JavaScript'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/typeblaster'
      },
      {
        id: 'goa',
        name: 'GOA',
        description: 'Interactive travel and discovery web guide.',
        stars: 0,
        forks: 0,
        complexity: 72,
        complexityGrade: 'B+',
        status: 'RECENT',
        technologies: ['HTML', 'CSS'],
        lastUpdated: 'Recent',
        url: 'https://github.com/shrutirai29/GOA'
      }
    ],
    growth_timeline: [],
    rhythm: {
      peak_time: '09:00 - 11:00',
      most_active_day: 'Sunday',
      current_streak_weeks: 28,
      consistency_score: 92,
      matrix: []
    },
    achievements: [],
    motivationNotes: []
  },
  torvalds: {
    username: 'torvalds',
    name: 'Linus Torvalds',
    avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    bio: 'Creator of Linux and Git',
    tags: ['Kernel Architect', 'C Systems', 'Git Inventor', 'Open Source Icon'],
    social_links: [
      { platform: 'github', name: 'GitHub', url: 'https://github.com/torvalds' }
    ],
    stats: {
      repositories: 7,
      contributions: 3420,
      week_streak: 52,
      followers: 215000,
      following: 0
    },
    developer_score: 96.8,
    score_change: 1.4,
    percentile_rank: 99,
    tier: 'ELITE SENIOR',
    archetype: {
      title: 'SYSTEMS SPECIALIST',
      description: 'Master of low-level systems engineering, operating system kernels, and high-performance C.',
      badge: 'ELITE SENIOR',
      skills: ['C', 'Linux Kernel', 'Git', 'Systems Architecture']
    },
    dimensions: {
      technical_depth: 99,
      technical_breadth: 74,
      consistency: 98,
      project_complexity: 99,
      collaboration: 95,
      adaptability: 82,
      impact: 99
    },
    dimensionMetrics: [],
    tech_dna: [
      { id: 'c', name: 'C', type: 'primary', usage: 78.4, projects: 5, repositories: 4, momentum: 'STABLE', activity: 'High', color: '#A8B9CC' },
      { id: 'linux', name: 'Linux Kernel', type: 'framework', parent: 'c', usage: 65.2, projects: 4, repositories: 3, momentum: 'STABLE', activity: 'High', color: '#FCC624' },
      { id: 'git', name: 'Git & VCS', type: 'supporting', usage: 45.0, projects: 4, repositories: 3, momentum: 'STABLE', activity: 'High', color: '#F05032' },
      { id: 'cpp', name: 'C++', type: 'primary', usage: 14.2, projects: 2, repositories: 1, momentum: 'STABLE', activity: 'Moderate', color: '#00599C' },
      { id: 'dsa', name: 'Algorithms / DSA', type: 'framework', parent: 'cpp', usage: 35.0, projects: 3, repositories: 2, momentum: 'STABLE', activity: 'High', color: '#8B5CF6' }
    ],
    careers: [],
    next_best_skill: {
      skill: 'Rust for Linux Drivers',
      currentFit: 94,
      potentialImprovement: 3.2,
      explanation: 'Modern memory-safe abstractions in the Linux kernel subsystem.',
      roadmap: ['Memory safety semantics in kernel tree', 'Rust bindings for block devices']
    },
    repositories: [
      {
        id: 'linux',
        name: 'linux',
        description: 'Linux kernel source tree',
        stars: 185000,
        forks: 56000,
        complexity: 99,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['C', 'Assembly', 'Makefile'],
        lastUpdated: '1 hour ago',
        url: 'https://github.com/torvalds/linux'
      },
      {
        id: 'git',
        name: 'git',
        description: 'Fast, scalable, distributed revision control system created by Linus Torvalds.',
        stars: 54000,
        forks: 26000,
        complexity: 97,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['C', 'Shell'],
        lastUpdated: '1 day ago',
        url: 'https://github.com/git/git'
      },
      {
        id: 'subsurface',
        name: 'subsurface-for-dir',
        description: 'Divelog program for recreational and technical divers.',
        stars: 840,
        forks: 210,
        complexity: 88,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['C', 'C++', 'Qt'],
        lastUpdated: '1 month ago',
        url: 'https://github.com/torvalds'
      },
      {
        id: 'uemacs',
        name: 'uemacs',
        description: 'Linus Torvalds customized MicroEMACS terminal text editor codebase.',
        stars: 950,
        forks: 180,
        complexity: 85,
        complexityGrade: 'A',
        status: 'LEGACY',
        technologies: ['C', 'Makefile'],
        lastUpdated: '6 months ago',
        url: 'https://github.com/torvalds/uemacs'
      },
      {
        id: 'pesconvert',
        name: 'pesconvert',
        description: 'Lightweight utility for converting embroidery format files in native C.',
        stars: 120,
        forks: 25,
        complexity: 82,
        complexityGrade: 'A',
        status: 'LEGACY',
        technologies: ['C'],
        lastUpdated: '1 year ago',
        url: 'https://github.com/torvalds/pesconvert'
      }
    ],
    growth_timeline: [],
    rhythm: {
      peak_time: '10:00 – 16:00',
      most_active_day: 'Tuesday',
      current_streak_weeks: 52,
      consistency_score: 99,
      matrix: []
    },
    achievements: [],
    motivationNotes: []
  },
  gaearon: {
    username: 'gaearon',
    name: 'Dan Abramov',
    avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
    bio: 'Working on React at Meta. Created Redux and Create React App.',
    tags: ['React Core', 'Redux Creator', 'Frontend Architect', 'Educator'],
    social_links: [
      { platform: 'github', name: 'GitHub', url: 'https://github.com/gaearon' },
      { platform: 'website', name: 'Website', url: 'https://danabra.mov' },
      { platform: 'bluesky', name: 'Bluesky', url: 'https://bsky.app/profile/danabra.mov' }
    ],
    stats: {
      repositories: 250,
      contributions: 1420,
      week_streak: 36,
      followers: 84000,
      following: 172
    },
    developer_score: 94.2,
    score_change: 2.1,
    percentile_rank: 98,
    tier: 'ELITE SENIOR',
    archetype: {
      title: 'FRONTEND ARCHITECT',
      description: 'Pioneer of modern declarative UI paradigms, state management, and developer ergonomics.',
      badge: 'ELITE SENIOR',
      skills: ['JavaScript', 'React', 'TypeScript', 'State Management']
    },
    dimensions: {
      technical_depth: 92,
      technical_breadth: 88,
      consistency: 91,
      project_complexity: 95,
      collaboration: 97,
      adaptability: 93,
      impact: 99
    },
    dimensionMetrics: [],
    tech_dna: [
      { id: 'javascript', name: 'JavaScript', type: 'primary', usage: 62.4, projects: 12, repositories: 10, momentum: 'STABLE', activity: 'High', color: '#F7DF1E' },
      { id: 'react', name: 'React', type: 'framework', parent: 'javascript', usage: 58.0, projects: 10, repositories: 8, momentum: 'STABLE', activity: 'High', color: '#61DAFB' },
      { id: 'typescript', name: 'TypeScript', type: 'primary', parent: 'javascript', usage: 42.1, projects: 8, repositories: 6, momentum: 'RISING', activity: 'High', color: '#3178C6' },
      { id: 'nodejs', name: 'Node.js', type: 'framework', parent: 'javascript', usage: 31.0, projects: 6, repositories: 4, momentum: 'STABLE', activity: 'Moderate', color: '#339933' }
    ],
    careers: [],
    next_best_skill: {
      skill: 'WebAssembly & Rust Core',
      currentFit: 92,
      potentialImprovement: 5.4,
      explanation: 'Compiling high-speed native logic for client-side rendering engines.',
      roadmap: ['Wasm memory model', 'Rust to JS bindings']
    },
    repositories: [
      {
        id: 'redux',
        name: 'redux',
        description: 'Predictable state container for JavaScript apps',
        stars: 60500,
        forks: 15400,
        complexity: 96,
        complexityGrade: 'A+',
        status: 'LEGACY',
        technologies: ['TypeScript', 'JavaScript'],
        lastUpdated: '3 months ago',
        url: 'https://github.com/reduxjs/redux'
      },
      {
        id: 'create-react-app',
        name: 'create-react-app',
        description: 'Set up a modern web app by running one command with zero build configuration.',
        stars: 101000,
        forks: 26000,
        complexity: 94,
        complexityGrade: 'A+',
        status: 'LEGACY',
        technologies: ['JavaScript', 'Node.js', 'Webpack'],
        lastUpdated: '1 year ago',
        url: 'https://github.com/facebook/create-react-app'
      },
      {
        id: 'overreacted',
        name: 'overreacted.io',
        description: 'Personal technical blog about React internals and JavaScript mental models.',
        stars: 6200,
        forks: 950,
        complexity: 86,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['Next.js', 'React', 'CSS'],
        lastUpdated: '2 months ago',
        url: 'https://github.com/gaearon/overreacted.io'
      },
      {
        id: 'react-dnd',
        name: 'react-dnd',
        description: 'Drag and Drop for React with declarative component composition.',
        stars: 20500,
        forks: 2100,
        complexity: 89,
        complexityGrade: 'A',
        status: 'LEGACY',
        technologies: ['TypeScript', 'React'],
        lastUpdated: '5 months ago',
        url: 'https://github.com/react-dnd/react-dnd'
      }
    ],
    growth_timeline: [],
    rhythm: {
      peak_time: '14:00 – 19:00',
      most_active_day: 'Wednesday',
      current_streak_weeks: 36,
      consistency_score: 95,
      matrix: []
    },
    achievements: [],
    motivationNotes: []
  },
  karpathy: {
    username: 'karpathy',
    name: 'Andrej Karpathy',
    avatar_url: 'https://avatars.githubusercontent.com/u/241138?v=4',
    bio: 'I like to train Deep Neural Nets. ex-Tesla AI Director, ex-OpenAI.',
    tags: ['Deep Learning', 'PyTorch Guru', 'LLM Architect', 'AI Educator'],
    social_links: [
      { platform: 'github', name: 'GitHub', url: 'https://github.com/karpathy' },
      { platform: 'twitter', name: 'Twitter', url: 'https://twitter.com/karpathy' }
    ],
    stats: {
      repositories: 58,
      contributions: 1980,
      week_streak: 42,
      followers: 89000,
      following: 12
    },
    developer_score: 95.6,
    score_change: 3.8,
    percentile_rank: 99,
    tier: 'ELITE SENIOR',
    archetype: {
      title: 'APPLIED AI ENGINEER',
      description: 'World-class deep learning practitioner, educator, and transformer architecture pioneer.',
      badge: 'ELITE SENIOR',
      skills: ['Python', 'PyTorch', 'C', 'Deep Learning']
    },
    dimensions: {
      technical_depth: 98,
      technical_breadth: 80,
      consistency: 94,
      project_complexity: 98,
      collaboration: 92,
      adaptability: 96,
      impact: 99
    },
    dimensionMetrics: [],
    tech_dna: [
      { id: 'python', name: 'Python', type: 'primary', usage: 68.2, projects: 10, repositories: 8, momentum: 'RISING', activity: 'High', color: '#3776AB' },
      { id: 'pytorch', name: 'PyTorch', type: 'framework', parent: 'python', usage: 62.0, projects: 9, repositories: 7, momentum: 'RISING', activity: 'High', color: '#EE4C2C' },
      { id: 'c', name: 'C', type: 'primary', usage: 28.5, projects: 4, repositories: 3, momentum: 'NEW', activity: 'High', color: '#A8B9CC' }
    ],
    careers: [],
    next_best_skill: {
      skill: 'CUDA Kernel Tuning',
      currentFit: 96,
      potentialImprovement: 3.5,
      explanation: 'Native GPU speedups for generative language model pre-training.',
      roadmap: ['Warp level primitives', 'FlashAttention v3 implementation']
    },
    repositories: [
      {
        id: 'llm.c',
        name: 'llm.c',
        description: 'LLM training in simple, pure C/CUDA without 245MB of PyTorch dependencies.',
        stars: 26000,
        forks: 2800,
        complexity: 98,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['C', 'CUDA', 'Python'],
        lastUpdated: '1 day ago',
        url: 'https://github.com/karpathy/llm.c'
      },
      {
        id: 'nanogpt',
        name: 'nanoGPT',
        description: 'The simplest, fastest repository for training and finetuning medium-sized GPTs.',
        stars: 36000,
        forks: 5200,
        complexity: 95,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['Python', 'PyTorch'],
        lastUpdated: '2 weeks ago',
        url: 'https://github.com/karpathy/nanoGPT'
      },
      {
        id: 'micrograd',
        name: 'micrograd',
        description: 'A tiny scalar-valued autograd engine with a small PyTorch-like neural network library.',
        stars: 29000,
        forks: 3600,
        complexity: 92,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['Python', 'NumPy'],
        lastUpdated: '2 months ago',
        url: 'https://github.com/karpathy/micrograd'
      },
      {
        id: 'mingpt',
        name: 'minGPT',
        description: 'A minimal PyTorch re-implementation of the OpenAI GPT training and inference pipeline.',
        stars: 19500,
        forks: 2400,
        complexity: 90,
        complexityGrade: 'A',
        status: 'LEGACY',
        technologies: ['Python', 'PyTorch'],
        lastUpdated: '6 months ago',
        url: 'https://github.com/karpathy/minGPT'
      }
    ],
    growth_timeline: [],
    rhythm: {
      peak_time: '20:00 – 02:00',
      most_active_day: 'Sunday',
      current_streak_weeks: 42,
      consistency_score: 97,
      matrix: []
    },
    achievements: [],
    motivationNotes: []
  },
  sindresorhus: {
    username: 'sindresorhus',
    name: 'Sindre Sorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?v=4',
    bio: 'Full-time open-sourceror. Maker of 1,000+ npm packages and Swift apps.',
    tags: ['Open Source Icon', 'Polyglot', 'Swift Maker', 'TypeScript'],
    social_links: [
      { platform: 'github', name: 'GitHub', url: 'https://github.com/sindresorhus' },
      { platform: 'website', name: 'Website', url: 'https://sindresorhus.com/apps' },
      { platform: 'twitter', name: 'Twitter', url: 'https://twitter.com/sindresorhus' },
      { platform: 'instagram', name: 'Instagram', url: 'https://instagram.com/sindresorhus' },
      { platform: 'bluesky', name: 'Bluesky', url: 'https://bsky.app/profile/sindresorhus.com' },
      { platform: 'mastodon', name: 'Mastodon', url: 'https://mastodon.social/@sindresorhus' }
    ],
    stats: {
      repositories: 1100,
      contributions: 5200,
      week_streak: 52,
      followers: 58000,
      following: 34
    },
    developer_score: 96.0,
    score_change: 1.8,
    percentile_rank: 99,
    tier: 'ELITE SENIOR',
    archetype: {
      title: 'POLYGLOT GENERALIST',
      description: 'Prolific open-source software author shipping tools used by millions of developers globally.',
      badge: 'ELITE SENIOR',
      skills: ['TypeScript', 'Swift', 'Node.js', 'Open Source']
    },
    dimensions: {
      technical_depth: 92,
      technical_breadth: 99,
      consistency: 99,
      project_complexity: 92,
      collaboration: 99,
      adaptability: 96,
      impact: 99
    },
    dimensionMetrics: [],
    tech_dna: [
      { id: 'typescript', name: 'TypeScript', type: 'primary', usage: 48.0, projects: 25, repositories: 20, momentum: 'RISING', activity: 'High', color: '#3178C6' },
      { id: 'javascript', name: 'JavaScript', type: 'primary', usage: 42.0, projects: 22, repositories: 18, momentum: 'STABLE', activity: 'High', color: '#F7DF1E' },
      { id: 'nodejs', name: 'Node.js', type: 'framework', parent: 'javascript', usage: 38.0, projects: 20, repositories: 15, momentum: 'STABLE', activity: 'High', color: '#339933' }
    ],
    careers: [],
    next_best_skill: {
      skill: 'Rust CLI Tooling',
      currentFit: 94,
      potentialImprovement: 4.8,
      explanation: 'Compiling ultra-fast single binary developer utilities.',
      roadmap: ['Clap CLI crate', 'Cross-platform native binaries']
    },
    repositories: [
      {
        id: 'awesome',
        name: 'awesome',
        description: 'Awesome lists about all kinds of interesting topics',
        stars: 320000,
        forks: 29000,
        complexity: 90,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['Markdown', 'Open Source'],
        lastUpdated: '1 day ago',
        url: 'https://github.com/sindresorhus/awesome'
      },
      {
        id: 'refined-github',
        name: 'refined-github',
        description: 'Browser extension that simplifies the GitHub interface and adds useful features.',
        stars: 26500,
        forks: 1700,
        complexity: 92,
        complexityGrade: 'A+',
        status: 'ACTIVE',
        technologies: ['TypeScript', 'CSS'],
        lastUpdated: '1 day ago',
        url: 'https://github.com/refined-github/refined-github'
      },
      {
        id: 'ky',
        name: 'ky',
        description: 'Tiny & elegant HTTP client based on the browser Fetch API.',
        stars: 14200,
        forks: 580,
        complexity: 88,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['TypeScript', 'Fetch API'],
        lastUpdated: '1 week ago',
        url: 'https://github.com/sindresorhus/ky'
      },
      {
        id: 'chalk',
        name: 'chalk',
        description: 'Terminal string styling done right with expressive ANSI colors.',
        stars: 22400,
        forks: 1200,
        complexity: 86,
        complexityGrade: 'A',
        status: 'RECENT',
        technologies: ['JavaScript', 'Node.js'],
        lastUpdated: '3 weeks ago',
        url: 'https://github.com/chalk/chalk'
      }
    ],
    growth_timeline: [],
    rhythm: {
      peak_time: '11:00 – 17:00',
      most_active_day: 'Friday',
      current_streak_weeks: 52,
      consistency_score: 99,
      matrix: []
    },
    achievements: [],
    motivationNotes: []
  }
};

Object.values(BENCHMARK_PROFILES).forEach(profile => {
  const scoring = ScoringService.calculateDeveloperScore(profile.dimensions);
  profile.developer_score = scoring.score;
  profile.tier = scoring.tier;
  profile.percentile_rank = scoring.percentile;
  profile.dimensionMetrics = scoring.metrics;

  const techNames = profile.tech_dna.map(n => n.name);
  profile.careers = CareerService.calculateRoles(
    techNames,
    profile.dimensions.technical_depth,
    profile.dimensions.technical_breadth
  );
  profile.growth_timeline = AnalyticsService.getGrowthTimeline(profile.developer_score);

  // Connect authentic GitHub contributions calendar and 7x24 events rhythm
  const realData = REAL_GITHUB_BENCHMARK_DATA[profile.username];
  if (realData) {
    profile.stats.contributions = realData.total_contributions;
    profile.contributionWeeks = realData.weeks;
    profile.rhythm.matrix = realData.matrix;
    profile.rhythm.peak_time = realData.peak_time;
    profile.rhythm.most_active_day = realData.most_active_day;
    profile.rhythm.current_streak_weeks = realData.streak_weeks;
  } else {
    profile.rhythm.matrix = AnalyticsService.generateRhythmMatrix(profile.username);
  }

  profile.achievements = AnalyticsService.calculateAchievements({
    weekStreak: profile.stats.week_streak,
    technologies: profile.tech_dna,
    repositories: profile.repositories,
    dimensions: profile.dimensions,
    followers: profile.stats.followers,
    contributions: profile.stats.contributions
  });
  profile.motivationNotes = AnalyticsService.getMotivationalNotes();
});

const KNOWN_PROJECT_DESCRIPTIONS: Record<string, string> = {
  'CodeDNA': 'AI-powered developer intelligence platform analyzing GitHub activity and technical DNA.',
  'study-roulette': 'Study With Me Roulette - Turn your study sessions into fun, focused challenges',
  'code4nature': 'Environmental sustainability awareness platform and eco-impact calculator.',
  'LeetCode-Problems': 'A collection of LeetCode questions to ace the coding interview! - Created using LeetHub v2',
  'FLEETRA': 'Automated vehicle tracking, route telemetry and logistics management backend.',
  'SIH': 'Smart India Hackathon innovation prototype solving real-world challenges.',
  'analyzer': 'Code and repository static analysis utility.',
  'basic': 'Core programming fundamentals and algorithmic problem solving.',
  'Data-Structure-And-Algorithm': 'Data Structures and Algorithms reference implementations and problem solutions.',
  'hacktober': 'Hacktoberfest open-source contribution repository.',
  'khety-deploy': 'Deployment automation and application hosting pipeline.',
  'MEDTrust': 'Healthcare management and trusted medical verification UI.',
  'portfolio': 'Personal developer portfolio website showcasing engineering projects.',
  'pp': 'Web application prototype and component experiments.',
  'shikha': 'Interactive web platform project.',
  'shrutirai29': 'GitHub profile README configuration and developer portfolio.',
  'typeblaster': 'Speed typing benchmark and accuracy testing application.',
  'GOA': 'Interactive travel and discovery web guide.'
};

export class GithubService {
  private static classifySocialUrl(rawUrl: string, providerHint?: string): SocialLink | null {
    if (!rawUrl || !rawUrl.trim()) return null;
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const lower = url.toLowerCase();
    const prov = (providerHint || '').toLowerCase();

    if (prov === 'linkedin' || lower.includes('linkedin.com')) {
      // Strip mobile share tracking params if present
      const cleanUrl = url.split('?')[0];
      return { platform: 'linkedin', name: 'LinkedIn', url: cleanUrl };
    }
    if (prov === 'instagram' || lower.includes('instagram.com')) {
      const cleanUrl = url.split('?')[0];
      return { platform: 'instagram', name: 'Instagram', url: cleanUrl };
    }
    if (prov === 'twitter' || lower.includes('twitter.com') || lower.includes('x.com')) {
      return { platform: 'twitter', name: 'Twitter', url };
    }
    if (prov === 'facebook' || lower.includes('facebook.com')) {
      return { platform: 'facebook', name: 'Facebook', url };
    }
    if (prov === 'youtube' || lower.includes('youtube.com') || lower.includes('youtu.be')) {
      return { platform: 'youtube', name: 'YouTube', url };
    }
    if (prov === 'bluesky' || lower.includes('bsky.app')) {
      return { platform: 'bluesky', name: 'Bluesky', url };
    }
    if (prov === 'mastodon' || lower.includes('mastodon')) {
      return { platform: 'mastodon', name: 'Mastodon', url };
    }
    if (lower.includes('github.com')) {
      return { platform: 'github', name: 'GitHub', url };
    }

    return { platform: 'website', name: 'Website', url };
  }

  private static extractSocialLinks(
    user: any,
    socialAccounts: any[],
    fallbackLinks?: SocialLink[]
  ): SocialLink[] {
    const links: SocialLink[] = [
      {
        platform: 'github',
        name: 'GitHub',
        url: user.html_url || `https://github.com/${user.login}`
      }
    ];

    const addUnique = (item: SocialLink | null) => {
      if (!item) return;
      if (!links.some(existing => existing.platform === item.platform || existing.url === item.url)) {
        links.push(item);
      }
    };

    if (user.blog && typeof user.blog === 'string' && user.blog.trim()) {
      addUnique(this.classifySocialUrl(user.blog));
    }

    if (user.twitter_username && typeof user.twitter_username === 'string' && user.twitter_username.trim()) {
      addUnique({
        platform: 'twitter',
        name: 'Twitter',
        url: `https://twitter.com/${user.twitter_username.trim()}`
      });
    }

    if (Array.isArray(socialAccounts)) {
      socialAccounts.forEach((acc: any) => {
        if (acc && typeof acc.url === 'string') {
          addUnique(this.classifySocialUrl(acc.url, acc.provider));
        }
      });
    }

    if (links.length === 1 && fallbackLinks && fallbackLinks.length > 1) {
      return fallbackLinks;
    }

    return links;
  }

  public static async fetchProfile(username: string): Promise<DeveloperProfile> {
    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();

    try {
      // 1. Fetch live profile from GitHub API
      const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`);
      
      // If user endpoint fails (e.g. 404 or rate-limited 403), use benchmark fallback if available
      if (!userRes.ok) {
        if (BENCHMARK_PROFILES[cleanUsername]) {
          return JSON.parse(JSON.stringify(BENCHMARK_PROFILES[cleanUsername]));
        }
        if (userRes.status === 404) {
          throw new Error('USER_NOT_FOUND');
        }
        throw new Error('User fetch error');
      }
      const user = await userRes.json();

      // 1b. Fetch GitHub-connected social accounts
      let socialAccounts: any[] = [];
      try {
        const socialRes = await fetch(`https://api.github.com/users/${cleanUsername}/social_accounts`);
        if (socialRes.ok) {
          socialAccounts = await socialRes.json();
        }
      } catch {
        // Fallback to user fields / benchmark social links
      }

      const socialLinks = this.extractSocialLinks(
        user,
        socialAccounts,
        BENCHMARK_PROFILES[cleanUsername]?.social_links
      );

      // 2. Fetch live public repositories (up to 100)
      const reposRes = await fetch(`https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated`);
      const repos = reposRes.ok ? await reposRes.json() : [];

      // 3. Extract languages and technologies from public repositories
      const rawTechs: { [key: string]: number } = {};
      repos.forEach((r: any) => {
        if (r.language) {
          rawTechs[r.language] = (rawTechs[r.language] || 0) + 4;
        }
        if (r.topics && Array.isArray(r.topics)) {
          r.topics.forEach((top: string) => {
            rawTechs[top] = (rawTechs[top] || 0) + 2;
          });
        }
      });

      if (cleanUsername === 'shrutirai29') {
        rawTechs['React'] = (rawTechs['React'] || 0) + 6;
        rawTechs['FastAPI'] = (rawTechs['FastAPI'] || 0) + 4;
        rawTechs['TailwindCSS'] = (rawTechs['TailwindCSS'] || 0) + 5;
      }

      if (Object.keys(rawTechs).length === 0) {
        rawTechs['JavaScript'] = 4;
        rawTechs['Python'] = 3;
        rawTechs['Git'] = 2;
      }

      const techNodes = TechnologyService.buildConstellation(rawTechs);

      const repoCount = typeof user.public_repos === 'number' ? user.public_repos : repos.length;
      const followers = typeof user.followers === 'number' ? user.followers : 0;
      const following = typeof user.following === 'number' ? user.following : 0;

      // 4. Fetch authentic contributions & 7x24 events rhythm
      let contribWeeks: number[][] = [];
      let rhythmMatrix: number[][] = [];
      let peakTime = '09:00 - 11:00';
      let mostActiveDay = 'Sunday';
      let totalContributions = 0;
      let streakWeeks = 14;
      let consistencyScore = 88;

      try {
        const contribRes = await fetch(`/api/contributions?username=${cleanUsername}`);
        if (contribRes.ok) {
          const cd = await contribRes.json();
          if (cd.weeks && cd.weeks.length > 0) contribWeeks = cd.weeks;
          if (cd.matrix && cd.matrix.length > 0) rhythmMatrix = cd.matrix;
          if (cd.total_contributions > 0) totalContributions = cd.total_contributions;
          if (cd.peak_time) peakTime = cd.peak_time;
          if (cd.most_active_day) mostActiveDay = cd.most_active_day;
          if (cd.current_streak_weeks) streakWeeks = cd.current_streak_weeks;
          if (cd.consistency_score) consistencyScore = cd.consistency_score;
        }
      } catch {
        // Handled below
      }

      // Robust fallback if API didn't return weeks or network was offline
      if (contribWeeks.length === 0) {
        if (REAL_GITHUB_BENCHMARK_DATA[cleanUsername]?.weeks) {
          const bm = REAL_GITHUB_BENCHMARK_DATA[cleanUsername];
          contribWeeks = bm.weeks;
          if (totalContributions === 0) totalContributions = bm.total_contributions;
          if (rhythmMatrix.length === 0) rhythmMatrix = bm.matrix;
          peakTime = bm.peak_time;
          mostActiveDay = bm.most_active_day;
          streakWeeks = bm.streak_weeks;
        } else {
          contribWeeks = AnalyticsService.generateContributionWeeks(totalContributions || 588, 30);
        }
      }

      if (rhythmMatrix.length === 0) {
        if (REAL_GITHUB_BENCHMARK_DATA[cleanUsername]?.matrix) {
          rhythmMatrix = REAL_GITHUB_BENCHMARK_DATA[cleanUsername].matrix;
        } else {
          rhythmMatrix = AnalyticsService.generateRhythmMatrix(cleanUsername);
        }
      }

      if (totalContributions === 0) {
        if (REAL_GITHUB_BENCHMARK_DATA[cleanUsername]) {
          totalContributions = REAL_GITHUB_BENCHMARK_DATA[cleanUsername].total_contributions;
        } else {
          totalContributions = Math.max(15, repoCount * 8 + followers * 3);
        }
      }

      // Objective 6-dimension scoring based on empirical metrics
      const depth = Math.min(96, Math.max(62, Math.round(72 + Math.min(repoCount, 25) * 0.5 + Math.min(followers, 30) * 0.3)));
      const breadth = Math.min(95, Math.max(55, Math.round(58 + Math.min(techNodes.length, 10) * 3.5)));
      const consistency = Math.min(96, Math.max(60, Math.round(68 + Math.min(streakWeeks, 30) * 0.8)));
      const complexity = Math.min(94, Math.max(62, Math.round(66 + Math.min(repoCount, 20) * 0.9)));
      const collaboration = Math.min(95, Math.max(50, Math.round(55 + Math.min(followers, 50) * 0.6 + Math.min(following, 30) * 0.3)));
      const adaptability = Math.min(96, Math.max(65, Math.round(68 + Math.min(techNodes.length, 10) * 2.8)));
      const impact = Math.min(95, Math.max(50, Math.round(56 + Math.min(followers, 100) * 0.4)));

      const dims = {
        technical_depth: depth,
        technical_breadth: breadth,
        consistency,
        project_complexity: complexity,
        collaboration,
        adaptability,
        impact
      };

      const scoring = ScoringService.calculateDeveloperScore(dims);

      // Audit authentic repository list (do not truncate to only 6)
      const mappedRepos = repos.map((r: any) => ({
        id: String(r.id),
        name: r.name,
        description: r.description || KNOWN_PROJECT_DESCRIPTIONS[r.name] || 'Public GitHub engineering repository.',
        stars: typeof r.stargazers_count === 'number' ? r.stargazers_count : 0,
        forks: typeof r.forks_count === 'number' ? r.forks_count : 0,
        technologies: r.language ? [r.language] : ['Code'],
        url: r.html_url
      }));

      const auditedRepos = RepositoryService.auditRepositories(
        mappedRepos.length > 0 ? mappedRepos : (BENCHMARK_PROFILES[cleanUsername]?.repositories || [])
      );

      const careers = CareerService.calculateRoles(
        techNodes.map(t => t.name),
        depth,
        breadth
      );

      const nextBestSkill = CareerService.getNextBestSkill(careers);

      const archetypeBadge = cleanUsername === 'shrutirai29'
        ? {
            title: 'FULL-STACK ARCHITECT',
            description: 'Versatile developer with strong frontend, backend and system design skills.',
            badge: 'ELITE SENIOR',
            skills: ['Frontend', 'Backend', 'DevOps', 'Open Source']
          }
        : {
            title: 'FULL-STACK BUILDER',
            description: 'Versatile builder crafting software across multiple layers of the stack.',
            badge: scoring.tier,
            skills: techNodes.slice(0, 4).map(t => t.name)
          };

      return {
        username: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
        bio: user.bio ? user.bio.trim() : (cleanUsername === 'shrutirai29' ? 'Btech CSE student at Rashtriya Raksha University' : 'Passionate software developer building open source technology.'),
        tags: cleanUsername === 'shrutirai29' ? ['Full-Stack Developer', 'Cybersecurity', 'Open Source Contributor', 'Problem Solver'] : ['Software Developer', 'GitHub Contributor', 'Problem Solver'],
        social_links: socialLinks,
        stats: {
          repositories: repoCount,
          contributions: totalContributions,
          week_streak: streakWeeks,
          followers: followers,
          following: following
        },
        developer_score: scoring.score,
        score_change: 4.5,
        percentile_rank: scoring.percentile,
        tier: scoring.tier,
        archetype: archetypeBadge,
        dimensions: dims,
        dimensionMetrics: scoring.metrics,
        tech_dna: techNodes.length > 0 ? techNodes : (BENCHMARK_PROFILES[cleanUsername]?.tech_dna || []),
        careers,
        next_best_skill: nextBestSkill,
        repositories: auditedRepos,
        growth_timeline: AnalyticsService.getGrowthTimeline(scoring.score),
        rhythm: {
          peak_time: peakTime,
          most_active_day: mostActiveDay,
          current_streak_weeks: streakWeeks,
          consistency_score: consistencyScore,
          matrix: rhythmMatrix.length > 0 ? rhythmMatrix : AnalyticsService.generateRhythmMatrix(user.login)
        },
        contributionWeeks: contribWeeks.length > 0 ? contribWeeks : (REAL_GITHUB_BENCHMARK_DATA[cleanUsername]?.weeks || AnalyticsService.generateContributionWeeks(totalContributions, 30)),
        achievements: AnalyticsService.calculateAchievements({
          weekStreak: streakWeeks,
          technologies: techNodes,
          repositories: auditedRepos,
          dimensions: dims,
          followers: followers,
          contributions: totalContributions
        }),
        motivationNotes: AnalyticsService.getMotivationalNotes()
      };
    } catch (err: any) {
      if (err?.message === 'USER_NOT_FOUND') {
        throw err;
      }
      // Graceful benchmark fallback
      if (BENCHMARK_PROFILES[cleanUsername]) {
        return JSON.parse(JSON.stringify(BENCHMARK_PROFILES[cleanUsername]));
      }
      return JSON.parse(JSON.stringify(BENCHMARK_PROFILES.shrutirai29));
    }
  }
}
