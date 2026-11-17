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
      contributions: 637,
      week_streak: 14,
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

  // Feature F: Profile Confidence & Data Quality Provenance
  profile.dataQuality = AnalyticsService.calculateDataQuality({
    repoCount: profile.stats.repositories,
    hasCalendar: true,
    hasEvents: true,
    hasLanguages: profile.tech_dna.length > 0,
    isLive: false,
    sourceType: 'BENCHMARK_VERIFIED_RECORD',
    rateLimitStatus: 'Verified Benchmark Persona & Live Sync Ready',
    calendarCommits: profile.stats.contributions
  });

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

export const KNOWN_PROJECT_DESCRIPTIONS: Record<string, string> = {
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

  // Client-side isolated TTL cache (15 minutes)
  private static profileCache: Map<string, { profile: DeveloperProfile; timestamp: number }> = new Map();
  private static CACHE_TTL_MS = 15 * 60 * 1000;

  public static async fetchProfile(username: string, isBenchmarkExplicit: boolean = false, bypassCache: boolean = false): Promise<DeveloperProfile> {
    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();
    if (!cleanUsername) {
      throw new Error('INVALID_USERNAME');
    }

    // Check client-side isolated cache
    if (!bypassCache) {
      const cached = this.profileCache.get(cleanUsername);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
        return JSON.parse(JSON.stringify(cached.profile));
      }
    }

    // If explicit benchmark profile requested and available
    if (isBenchmarkExplicit && BENCHMARK_PROFILES[cleanUsername]) {
      const bm = JSON.parse(JSON.stringify(BENCHMARK_PROFILES[cleanUsername]));
      bm.data_source = 'benchmark';
      bm.is_demo = true;
      bm.verified_identity = true;
      return bm;
    }

    // 1. Primary: Unified server-side ingestion API (supports GITHUB_TOKEN & server cache)
    try {
      const apiRes = await fetch(`/api/profile?username=${encodeURIComponent(cleanUsername)}${isBenchmarkExplicit ? '&benchmark=true' : ''}${bypassCache ? '&refresh=true' : ''}`);
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (apiData && apiData.username && apiData.username.toLowerCase() === cleanUsername) {
          const profile = this.normalizeApiProfile(apiData, cleanUsername);
          this.profileCache.set(cleanUsername, { profile, timestamp: Date.now() });
          return profile;
        }
      } else if (apiRes.status === 404) {
        throw new Error('USER_NOT_FOUND');
      } else if (apiRes.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
    } catch (apiErr: any) {
      if (apiErr?.message === 'USER_NOT_FOUND' || apiErr?.message === 'RATE_LIMIT_EXCEEDED') {
        throw apiErr;
      }
      // If server-side proxy is unavailable or errored, proceed to direct GitHub client-side fetch
    }

    try {
      // 2. Direct GitHub API client-side fallback
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
      
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error('USER_NOT_FOUND');
        }
        if (userRes.status === 403) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
        throw new Error(`GITHUB_API_ERROR_${userRes.status}`);
      }
      const user = await userRes.json();

      // Ensure returned username matches requested identity
      if (user.login.toLowerCase() !== cleanUsername) {
        throw new Error('IDENTITY_MISMATCH');
      }

      // Fetch GitHub-connected social accounts
      let socialAccounts: any[] = [];
      try {
        const socialRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/social_accounts`);
        if (socialRes.ok) {
          socialAccounts = await socialRes.json();
        }
      } catch {
        // Fallback
      }

      const socialLinks = this.extractSocialLinks(
        user,
        socialAccounts,
        BENCHMARK_PROFILES[cleanUsername]?.social_links
      );

      // Fetch live public repositories (up to 100, paginated if public_repos > 100)
      let repos: any[] = [];
      try {
        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`);
        if (reposRes.ok) {
          const firstPage = await reposRes.json();
          if (Array.isArray(firstPage)) {
            repos = firstPage;
            if (firstPage.length === 100 && (user.public_repos || 0) > 100) {
              try {
                const p2Res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&page=2&sort=updated`);
                if (p2Res.ok) {
                  const p2Data = await p2Res.json();
                  if (Array.isArray(p2Data)) repos = repos.concat(p2Data);
                }
              } catch {
                // Keep first page
              }
            }
          }
        }
      } catch {
        // Fallback
      }

      // Extract languages and technologies strictly from public repositories (no fake languages)
      const rawTechs: { [key: string]: number } = {};
      repos.forEach((r: any) => {
        if (r.language) {
          rawTechs[r.language] = (rawTechs[r.language] || 0) + 4;
        }
        if (r.topics && Array.isArray(r.topics)) {
          r.topics.forEach((top: string) => {
            if (typeof top === 'string') {
              rawTechs[top] = (rawTechs[top] || 0) + 2;
            }
          });
        }
      });

      const techNodes = TechnologyService.buildConstellation(rawTechs);

      const repoCount = typeof user.public_repos === 'number' ? user.public_repos : repos.length;
      const followers = typeof user.followers === 'number' ? user.followers : 0;
      const following = typeof user.following === 'number' ? user.following : 0;

      // Fetch authentic contributions & 7x24 events rhythm
      let contribWeeks: number[][] = [];
      let weekDates: string[] = [];
      let rhythmMatrix: number[][] = [];
      let peakTime = 'Not recorded';
      let mostActiveDay = 'Not recorded';
      let totalContributions = 0;
      let streakWeeks = 0;
      let consistencyScore = 10;

      try {
        const contribRes = await fetch(`/api/contributions?username=${encodeURIComponent(cleanUsername)}`);
        if (contribRes.ok) {
          const cd = await contribRes.json();
          if (cd.weeks && cd.weeks.length > 0) contribWeeks = cd.weeks;
          if (cd.week_dates && cd.week_dates.length > 0) weekDates = cd.week_dates;
          if (cd.matrix && cd.matrix.length > 0) rhythmMatrix = cd.matrix;
          if (typeof cd.total_contributions === 'number') totalContributions = cd.total_contributions;
          if (cd.peak_time) peakTime = cd.peak_time;
          if (cd.most_active_day) mostActiveDay = cd.most_active_day;
          if (typeof cd.current_streak_weeks === 'number') streakWeeks = cd.current_streak_weeks;
          if (typeof cd.consistency_score === 'number') consistencyScore = cd.consistency_score;
        }
      } catch {
        // Authentic 0 metrics maintained
      }

      // Objective 6-dimension scoring based on empirical metrics
      const depth = repoCount === 0 && followers === 0 ? 10 : Math.min(96, Math.max(10, Math.round(10 + Math.min(repoCount, 25) * 2.5 + Math.min(followers, 30) * 0.5)));
      const breadth = techNodes.length === 0 ? 10 : Math.min(95, Math.max(10, Math.round(10 + Math.min(techNodes.length, 10) * 8.0)));
      const consistency = streakWeeks === 0 ? 10 : Math.min(96, Math.max(10, Math.round(10 + Math.min(streakWeeks, 30) * 2.8)));
      const complexity = repoCount === 0 ? 10 : Math.min(94, Math.max(10, Math.round(10 + Math.min(repoCount, 20) * 4.0)));
      const collaboration = followers === 0 && following === 0 ? 10 : Math.min(95, Math.max(10, Math.round(10 + Math.min(followers, 50) * 1.2 + Math.min(following, 30) * 0.5)));
      const adaptability = techNodes.length === 0 && repoCount === 0 ? 10 : Math.min(96, Math.max(10, Math.round(10 + Math.min(techNodes.length, 10) * 7.5 + Math.min(repoCount, 5) * 1.5)));
      const impact = followers === 0 ? 10 : Math.min(95, Math.max(10, Math.round(10 + Math.min(followers, 100) * 0.8)));

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

      const auditedRepos = RepositoryService.auditRepositories(repos);

      const careers = CareerService.calculateRoles(
        techNodes.map(t => t.name),
        depth,
        breadth
      );

      const nextBestSkill = CareerService.getNextBestSkill(careers, techNodes.map(t => t.name));

      AnalyticsService.recordProfileSnapshot(cleanUsername, scoring.score, depth, complexity);

      const growthTimeline = AnalyticsService.getEmpiricalGrowthTimeline(
        cleanUsername,
        repos,
        scoring.score,
        depth,
        complexity
      );

      const dataQuality = AnalyticsService.calculateDataQuality({
        repoCount,
        hasCalendar: contribWeeks.length > 0,
        hasEvents: rhythmMatrix.length > 0,
        hasLanguages: techNodes.length > 0,
        isLive: true,
        calendarCommits: totalContributions
      });

      const archetypeBadge = {
        title: depth >= 80 ? 'SYSTEM ARCHITECT' : (breadth >= 75 ? 'POLYGLOT EXPLORER' : 'SOFTWARE BUILDER'),
        description: 'Verified GitHub engineer evaluated through empirical codebase activity.',
        badge: scoring.tier,
        skills: techNodes.slice(0, 4).map(t => t.name)
      };

      const resultProfile: DeveloperProfile = {
        github_id: typeof user.id === 'number' ? user.id : undefined,
        node_id: user.node_id,
        html_url: user.html_url,
        is_demo: false,
        verified_identity: true,
        data_source: 'live',
        fetched_at: new Date().toISOString(),
        username: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
        bio: user.bio ? user.bio.trim() : `Public GitHub developer with ${repoCount} public repositories across ${techNodes.length} detected technologies.`,
        tags: techNodes.length > 0 ? techNodes.slice(0, 4).map(t => t.name) : ['Software Developer', 'GitHub Contributor'],
        social_links: socialLinks,
        stats: {
          repositories: repoCount,
          contributions: totalContributions,
          week_streak: streakWeeks,
          followers: followers,
          following: following
        },
        developer_score: scoring.score,
        score_change: 0,
        percentile_rank: scoring.percentile,
        tier: scoring.tier,
        archetype: archetypeBadge,
        dimensions: dims,
        dimensionMetrics: scoring.metrics,
        tech_dna: techNodes,
        careers,
        next_best_skill: nextBestSkill,
        repositories: auditedRepos,
        growth_timeline: growthTimeline,
        rhythm: {
          peak_time: peakTime,
          most_active_day: mostActiveDay,
          current_streak_weeks: streakWeeks,
          consistency_score: consistencyScore,
          matrix: rhythmMatrix
        },
        contributionWeeks: contribWeeks,
        weekDates: weekDates.length > 0 ? weekDates : undefined,
        dataQuality,
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

      this.profileCache.set(cleanUsername, { profile: resultProfile, timestamp: Date.now() });
      return resultProfile;

    } catch (err: any) {
      // Re-throw explicit identity errors
      if (err?.message === 'USER_NOT_FOUND' || err?.message === 'RATE_LIMIT_EXCEEDED' || err?.message === 'INVALID_USERNAME') {
        throw err;
      }
      // If it is a known benchmark username and was requested, return that benchmark only
      if (isBenchmarkExplicit && BENCHMARK_PROFILES[cleanUsername]) {
        return JSON.parse(JSON.stringify(BENCHMARK_PROFILES[cleanUsername]));
      }
      // NEVER silently substitute another user's profile!
      throw new Error(`Failed to load GitHub profile for "${username}": ${err?.message || 'Network error'}`);
    }
  }

  /**
   * Normalizes server-side API profile response into DeveloperProfile
   */
  private static normalizeApiProfile(apiData: any, _username: string): DeveloperProfile {
    const rawDims = apiData.dimensions || {};
    const dims = {
      technical_depth: typeof rawDims.technical_depth === 'number' ? rawDims.technical_depth : 10,
      technical_breadth: typeof rawDims.technical_breadth === 'number' ? rawDims.technical_breadth : 10,
      consistency: typeof rawDims.consistency === 'number' ? rawDims.consistency : 10,
      project_complexity: typeof rawDims.project_complexity === 'number' ? rawDims.project_complexity : 10,
      collaboration: typeof rawDims.collaboration === 'number' ? rawDims.collaboration : 10,
      adaptability: typeof rawDims.adaptability === 'number' ? rawDims.adaptability : 10,
      impact: typeof rawDims.impact === 'number' ? rawDims.impact : 10
    };

    const scoring = ScoringService.calculateDeveloperScore(dims);

    const techNodes: any[] = (apiData.dna_nodes || []).map((t: any) => ({
      id: t.id || t.name.toLowerCase(),
      name: t.name,
      type: t.type || 'primary',
      parent: t.parent,
      usage: t.usage || 20,
      projects: t.projects || 1,
      repositories: t.projects || 1,
      momentum: t.momentum || 'STABLE',
      activity: t.activity || 'Moderate',
      color: t.color || '#6366F1'
    }));

    const repos: any[] = (apiData.projects || []).map((p: any) => ({
      id: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: p.name,
      description: p.description || '',
      stars: p.stars || 0,
      forks: p.forks || 0,
      complexity: p.complexity === 'VERY HIGH' ? 95 : (p.complexity === 'HIGH' ? 82 : 65),
      complexityGrade: p.complexity === 'VERY HIGH' ? 'A+' : (p.complexity === 'HIGH' ? 'A' : 'B'),
      status: p.activity || 'ACTIVE',
      technologies: p.tech ? p.tech.split(' • ') : ['Codebase'],
      lastUpdated: p.age || 'Recent',
      isArchived: Boolean(p.is_archived)
    }));

    const careers: any[] = (apiData.careers || []).map((c: any) => ({
      role: c.role,
      fit: c.fit,
      strengths: c.strengths || [],
      gaps: c.gaps || []
    }));

    const nbs = apiData.next_best_skill || {
      skill: 'Docker + Kubernetes',
      currentFit: 85,
      potentialImprovement: 8.0,
      explanation: 'Learning containerization and modern cloud deployment enhances career fit.',
      roadmap: ['Docker containerization', 'CI/CD pipeline integration', 'Managed cloud orchestration']
    };

    const growthTimeline: any[] = (apiData.growth_timeline || []).map((m: any) => ({
      year: String(m.year),
      score: typeof m.score === 'number' ? m.score : undefined,
      depth: m.depth,
      complexity: m.complexity,
      hasScoreMeasurement: Boolean(m.has_score_measurement),
      milestoneType: m.milestone_type || (m.has_score_measurement ? 'score_snapshot' : 'repository_milestone'),
      milestone: m.milestone || `${m.year} Milestones`,
      technologies: m.technologies || [],
      description: m.description || m.note || ''
    }));

    const dq = apiData.data_quality || {};

    return {
      github_id: apiData.github_id,
      node_id: apiData.node_id,
      html_url: apiData.html_url || `https://github.com/${apiData.username}`,
      is_demo: Boolean(apiData.is_demo),
      verified_identity: true,
      data_source: apiData.data_source || 'live',
      fetched_at: apiData.fetched_at || new Date().toISOString(),
      username: apiData.username,
      name: apiData.name || apiData.username,
      avatar_url: apiData.avatar_url || `https://github.com/${apiData.username}.png`,
      bio: apiData.bio || '',
      tags: apiData.tags || (techNodes.length > 0 ? techNodes.slice(0, 4).map(t => t.name) : ['Software Developer']),
      social_links: [
        { platform: 'github', name: 'GitHub', url: `https://github.com/${apiData.username}` }
      ],
      stats: {
        repositories: apiData.public_repos ?? repos.length,
        contributions: apiData.total_contributions ?? 0,
        week_streak: apiData.rhythm?.current_streak_weeks ?? 0,
        followers: apiData.followers ?? 0,
        following: apiData.following ?? 0
      },
      developer_score: apiData.score || scoring.score,
      score_change: 0,
      percentile_rank: scoring.percentile,
      tier: scoring.tier,
      archetype: {
        title: apiData.archetype || 'SOFTWARE BUILDER',
        description: apiData.archetype_tagline || 'Verified developer profile analyzed from GitHub repository footprints.',
        badge: apiData.archetype_badge || scoring.tier,
        skills: techNodes.slice(0, 4).map(t => t.name)
      },
      dimensions: dims,
      dimensionMetrics: scoring.metrics,
      tech_dna: techNodes,
      careers,
      next_best_skill: {
        skill: nbs.skill,
        currentFit: nbs.currentFit || 80,
        potentialImprovement: nbs.potentialImprovement || 8.0,
        explanation: nbs.why || nbs.explanation || 'Accelerates systems engineering and technical versatility.',
        roadmap: nbs.roadmap || ['Phase 1: Core Fundamentals', 'Phase 2: Project Architecture', 'Phase 3: Production Deployment']
      },
      repositories: repos,
      growth_timeline: growthTimeline,
      rhythm: {
        peak_time: apiData.rhythm?.peak_time || '14:00 - 18:00',
        most_active_day: apiData.rhythm?.most_active_day || 'Wednesday',
        current_streak_weeks: apiData.rhythm?.current_streak_weeks || 0,
        consistency_score: dims.consistency,
        matrix: apiData.rhythm?.matrix || []
      },
      contributionWeeks: apiData.contributionWeeks || [],
      achievements: AnalyticsService.calculateAchievements({
        weekStreak: apiData.rhythm?.current_streak_weeks || 0,
        technologies: techNodes,
        repositories: repos,
        dimensions: dims,
        followers: apiData.followers || 0,
        contributions: apiData.total_contributions || 0
      }),
      motivationNotes: AnalyticsService.getMotivationalNotes(),
      dataQuality: {
        tier: dq.tier?.includes('High') ? 'HIGH_CONFIDENCE' : (dq.tier?.includes('Moderate') ? 'MODERATE_CONFIDENCE' : 'PRELIMINARY_EVIDENCE'),
        tierLabel: dq.tier || 'Preliminary Evidence',
        coveragePercent: dq.coverage_percent || 50,
        isLive: Boolean(dq.is_live),
        sourceReliability: 'AUTHENTIC_GITHUB_API',
        scannedRepos: dq.scanned_repos ?? repos.length,
        calendarCommits: dq.total_stars ?? 0,
        rateLimitStatus: dq.rate_limit_status || 'Live API Synchronized',
        verifiedSignals: dq.verified_signals || [`Authentic GitHub Identity Verified (@${apiData.username})`],
        unverifiedSignals: dq.unverified_signals || undefined,
        signalBreakdown: {
          identityVerified: true,
          repositoryEvidence: repos.length > 0,
          activitySpectrum: (apiData.total_contributions || 0) > 0,
          multiStackEvidence: techNodes.length > 1
        },
        freshnessTimestamp: apiData.fetched_at
      }
    };
  }
}
