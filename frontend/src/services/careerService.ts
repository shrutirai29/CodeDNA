import type { CareerRole, NextBestSkillRecommendation } from '../types/developer';

export interface CareerRoadmapMilestone {
  step: number;
  title: string;
  description: string;
  estimatedHours: number;
  practiceExercise: string;
  deliverable: string;
  completed?: boolean;
}

export interface DetailedSkillRoadmap {
  skill: string;
  targetRole: string;
  currentFit: number;
  potentialImprovement: number;
  explanation: string;
  estimatedTotalWeeks: number;
  milestones: CareerRoadmapMilestone[];
}

export interface CareerMatchResult {
  analysis_id?: number;
  job_title: string;
  match_score: number;
  technical_alignment: number;
  experience_score: number;
  domain_relevance: number;
  keyword_coverage: number;
  found_skills: string[];
  missing_skills: string[];
  actionable_tips: string[];
  recommended_courses: Array<{
    title: string;
    provider: string;
    url: string;
    level: string;
    duration: string;
    rating: number;
    skill: string;
  }>;
  created_at?: string;
}

export interface RejectionEmailResult {
  analysis_id?: number;
  category: string;
  confidence: number;
  sentiment: string;
  reasons: string[];
  next_steps: string[];
  created_at?: string;
}

export interface CourseItem {
  id?: number;
  course_id?: number;
  title: string;
  course_title?: string;
  provider: string;
  url?: string;
  course_url?: string;
  level: string;
  duration: string;
  rating: number;
  skill: string;
  skill_name?: string;
  is_completed?: boolean;
}


export interface CareerIntelligenceMetadata {
  report_version: string;
  scoring_methodology: string;
  analyzed_at: string;
  evidence_sources: {
    github_connected: boolean;
    repositories_inspected: number;
    resume_provided: boolean;
    preferences_configured: boolean;
  };
  overall_confidence: number;
  target_direction_id: string;
  target_direction_title: string;
  saved_report_id?: number;
}

export interface ExecutiveSummary {
  headline: string;
  narrative: string;
  confidence_note: string;
  key_strengths_summary: string[];
  key_priorities_summary: string[];
  recommended_next_action: string;
}

export interface DeveloperIdentity {
  archetype: string;
  primary_specialization: string;
  technical_breadth_summary: string;
  technical_depth_summary: string;
  observed_facts: string[];
  inferred_characteristics: string[];
}

export interface StrengthItem {
  title: string;
  explanation: string;
  evidence_citation: string;
  provenance: string;
  impact: string;
  relevant_directions: string[];
  confidence: number;
}

export interface WeaknessItem {
  title: string;
  gap: string;
  evidence_citation: string;
  provenance: string;
  why_it_matters: string;
  affected_directions: string[];
  remediation_step: string;
  how_to_demonstrate: string;
}

export interface CareerDirectionItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  current_fit: {
    score: number;
    status: string;
    breakdown: {
      demonstrated_technical_skills: number;
      project_experience: number;
      problem_solving_depth: number;
      practical_implementation: number;
      learning_velocity: number;
      stated_interest_alignment: number;
    };
  };
  growth_potential: {
    score: number;
    label: string;
    rationale: string;
  };
  career_readiness: {
    score: number;
    tier: string;
    production_signals_detected: {
      automated_tests: boolean;
      containerization: boolean;
      ci_cd_workflows: boolean;
    };
  };
  evidence_confidence: {
    score: number;
    rating: string;
    provenance_summary: string;
    limitations: string[];
  };
  supporting_skills: string[];
  missing_skills: string[];
  transferable_skills: string[];
  relevant_projects: string[];
  archetype_recommendations: string[];
}

export interface CareerComparisonItem {
  direction_id: string;
  title: string;
  current_fit_score: number;
  growth_potential_score: number;
  career_readiness_score: number;
  readiness_tier: string;
  evidence_confidence: number;
  missing_skills_count: number;
  key_missing_skills: string[];
  supporting_projects_count: number;
}

export interface SkillGapItem {
  skill: string;
  importance: string;
  difficulty: string;
  prerequisites: string[];
  expected_career_roi: string;
  estimated_learning_time: string;
  provenance: string;
  remediation_summary: string;
}

export interface LearningRoadmap {
  target_role: string;
  recommended_courses: Record<string, CourseItem[]>;
  structured_milestones: Array<{
    phase: string;
    timeline: string;
    focus: string;
    practical_exercise: string;
    measurement: string;
  }>;
  evidence_collection_guide: string[];
}

export interface ProjectRecommendation {
  title: string;
  problem_solved: string;
  why_it_fits: string;
  skills_developed: string[];
  difficulty_tiers: {
    MVP: string;
    Intermediate: string;
    Advanced: string;
  };
  what_it_demonstrates: string;
}

export interface ActionPlanItem {
  step_number: number;
  title: string;
  priority: string;
  action: string;
  why_it_matters: string;
  how_to_measure: string;
}

export interface CareerIntelligenceReport {
  metadata: CareerIntelligenceMetadata;
  section_1_executive_summary: ExecutiveSummary;
  section_2_developer_identity: DeveloperIdentity;
  section_3_strengths_with_evidence: StrengthItem[];
  section_4_weaknesses_and_gaps: WeaknessItem[];
  section_5_career_directions: CareerDirectionItem[];
  section_6_career_comparison: {
    directions_compared: CareerComparisonItem[];
    comparison_summary: string;
  };
  section_7_skill_gap_analysis: SkillGapItem[];
  section_8_personalized_learning_roadmap: LearningRoadmap;
  section_9_personalized_project_recommendations: ProjectRecommendation[];
  section_10_final_action_plan: ActionPlanItem[];
  evidence_provenance_ledger: Array<{
    skill: string;
    provenance: string;
    detail: string;
    confidence: number;
  }>;
}

export interface IntelligenceExplanationResult {
  question: string;
  answer: string;
  evidence_citations: string[];
  related_section: string;
}

export class CareerService {
  public static readonly ROLE_DEFINITIONS = [
    {
      role: 'Full-Stack Developer',
      coreSkills: ['javascript', 'typescript', 'react', 'node', 'fastapi', 'python', 'html', 'css', 'sql'],
      advancedSkills: ['docker', 'kubernetes', 'ci/cd', 'testing'],
      strengthsPool: ['JavaScript / TypeScript', 'React / UI Architecture', 'REST APIs & Full-Stack Flow'],
      gapsPool: ['Docker & Containerization', 'Automated Testing (Playwright)', 'Kubernetes Orchestration']
    },
    {
      role: 'Backend Engineer',
      coreSkills: ['python', 'fastapi', 'django', 'node', 'express', 'sql', 'postgresql', 'mongodb'],
      advancedSkills: ['redis', 'kafka', 'docker', 'microservices'],
      strengthsPool: ['Python Architecture', 'FastAPI & Microservices', 'Relational Schemas'],
      gapsPool: ['Redis & Distributed Caching', 'Message Queues (Kafka)', 'High-Concurrency Scaling']
    },
    {
      role: 'Frontend Engineer',
      coreSkills: ['javascript', 'typescript', 'react', 'next.js', 'vue', 'tailwind', 'html', 'css'],
      advancedSkills: ['testing', 'webgl', 'three.js', 'accessibility'],
      strengthsPool: ['Modern Component Composition', 'TailwindCSS Styling', 'Interactive UX & State'],
      gapsPool: ['Automated Testing (Jest / Cypress)', 'Micro-Frontends Architecture', 'Canvas & WebGL Performance']
    },
    {
      role: 'Data Scientist / ML Engineer',
      coreSkills: ['python', 'pandas', 'numpy', 'scikit', 'jupyter', 'sql', 'statistics'],
      advancedSkills: ['pytorch', 'tensorflow', 'docker', 'fastapi', 'mlflow'],
      strengthsPool: ['Python Numerical Tooling', 'Model Prototyping', 'Exploratory Data Analysis'],
      gapsPool: ['PyTorch & Deep Learning Serving', 'MLOps & Feature Stores (MLflow)', 'Distributed Model Training']
    },
    {
      role: 'Systems & Software Engineer',
      coreSkills: ['c', 'c++', 'dsa', 'algorithms', 'linux', 'git'],
      advancedSkills: ['rust', 'concurrency', 'networking', 'operating systems'],
      strengthsPool: ['Algorithmic Efficiency', 'Data Structures (DSA)', 'Memory Hierarchy Basics'],
      gapsPool: ['Rust Memory Safety', 'Low-Latency Concurrency', 'Linux Systems Programming']
    },
    {
      role: 'DevOps & Cloud Engineer',
      coreSkills: ['git', 'linux', 'bash', 'shell', 'docker', 'ci/cd'],
      advancedSkills: ['kubernetes', 'terraform', 'aws', 'helm', 'monitoring'],
      strengthsPool: ['Git Automation', 'Linux Command Line', 'Containerized Workflows'],
      gapsPool: ['Kubernetes Helm Charts', 'Terraform Infrastructure as Code', 'Cloud Architecture (AWS/GCP)']
    },
    {
      role: 'Mobile Application Developer',
      coreSkills: ['javascript', 'typescript', 'react', 'react native', 'mobile'],
      advancedSkills: ['flutter', 'dart', 'ios', 'android', 'sqlite'],
      strengthsPool: ['Component Reusability', 'Responsive Touch Interfaces', 'Cross-Platform Patterns'],
      gapsPool: ['Native iOS/Android Bridge APIs', 'Offline SQLite Sync', 'App Store Automated CI/CD']
    }
  ];

  public static calculateRoles(technologies: string[], depth: number, breadth: number): CareerRole[] {
    const techLower = technologies.map(t => t.toLowerCase());

    return this.ROLE_DEFINITIONS.map(def => {
      const matchedCore = def.coreSkills.filter(s => techLower.some(t => t.includes(s)));
      const matchedAdv = def.advancedSkills.filter(s => techLower.some(t => t.includes(s)));

      const coreRatio = matchedCore.length / Math.max(1, def.coreSkills.length);
      const advRatio = matchedAdv.length / Math.max(1, def.advancedSkills.length);

      // Objective fit: scales proportionally with verified core & advanced skill matches
      // Zero matching skills starts at baseline 10%, avoiding false 42% credit
      const matchScore = coreRatio * 55.0 + advRatio * 25.0;
      const depthBonus = Math.min(10.0, ((depth || 10) / 100) * 10.0);
      const breadthBonus = Math.min(10.0, ((breadth || 10) / 100) * 10.0);

      const fitScore = Math.min(
        96.0,
        Math.max(
          10.0,
          Math.round((matchScore > 0 ? 15.0 : 5.0) + matchScore + depthBonus + breadthBonus)
        )
      );

      // Dynamic gaps: filter out gaps that match user's known technologies
      const activeGaps = def.gapsPool.filter(gap => {
        const gapKey = gap.toLowerCase();
        return !techLower.some(t => gapKey.includes(t));
      });

      return {
        role: def.role,
        fit: fitScore,
        strengths: def.strengthsPool.slice(0, 3),
        gaps: activeGaps.length > 0 ? activeGaps.slice(0, 2) : ['Production Observability & Telemetry']
      };
    }).sort((a, b) => b.fit - a.fit);
  }

  public static getNextBestSkill(roles: CareerRole[], technologies: string[] = []): NextBestSkillRecommendation {
    const topRole = roles[0] || { role: 'Full-Stack Developer', fit: 88, gaps: ['Docker & Containerization'] };
    const techLower = technologies.map(t => t.toLowerCase());

    const hasDocker = techLower.some(t => t.includes('docker'));
    const hasTypeScript = techLower.some(t => t.includes('typescript'));
    const hasTesting = techLower.some(t => t.includes('test') || t.includes('jest') || t.includes('pytest'));

    let skillName = 'Docker + Kubernetes';
    let potentialGain = 8.5;
    let explanation = 'Learning containerization and cloud orchestration creates immediate staging symmetry and unlocks production DevOps readiness.';
    let roadmap = [
      'Containerize current FastAPI and React applications with multi-stage Dockerfiles',
      'Optimize build layers and enforce non-root security contexts in production images',
      'Orchestrate local multi-service testing with Docker Compose & networked volumes',
      'Deploy workloads to managed cloud clusters (EKS/GKE) with declarative Kubernetes manifests'
    ];

    if (topRole.role.includes('Backend') && hasDocker) {
      skillName = 'Redis + Distributed Caching';
      potentialGain = 7.4;
      explanation = 'Adding in-memory caching and message pub/sub drastically optimizes database query throughput for high-concurrency backend services.';
      roadmap = [
        'Implement Redis write-through caching on high-frequency FastAPI REST endpoints',
        'Configure key TTL policies and cache invalidation strategies',
        'Build real-time notification streams using Redis Pub/Sub',
        'Benchmark database load reduction under simulated 1,000 req/sec stress tests'
      ];
    } else if (topRole.role.includes('Data') || topRole.role.includes('ML')) {
      skillName = 'PyTorch + Model Serving';
      potentialGain = 9.2;
      explanation = 'Mastering deep learning inference architectures and FastAPI model serving bridges experimental models into reliable production endpoints.';
      roadmap = [
        'Train and evaluate fine-tuned PyTorch neural classification models',
        'Optimize model weights using ONNX runtime and TensorRT quantizations',
        'Containerize FastAPI model inference pipelines with batching logic',
        'Track experiments and model artifacts using MLflow and automated evaluations'
      ];
    } else if (topRole.role.includes('Systems')) {
      skillName = 'Rust Systems Engineering';
      potentialGain = 8.8;
      explanation = 'Transitioning algorithms to memory-safe Rust with zero-cost abstractions demonstrates high-performance engineering discipline.';
      roadmap = [
        'Master the borrow checker, ownership semantics, and lifetimes',
        'Implement concurrent multi-threaded worker pools with Tokio async runtime',
        'Write zero-allocation data parsing engines for high-throughput I/O',
        'Expose high-performance Rust dynamic modules to Python via PyO3'
      ];
    } else if (!hasTypeScript && (topRole.role.includes('Full-Stack') || topRole.role.includes('Frontend'))) {
      skillName = 'TypeScript & Strict Type Safety';
      potentialGain = 7.8;
      explanation = 'Eliminating implicit any types and adding strict compile-time contracts improves code maintainability and team scalability.';
      roadmap = [
        'Convert core JavaScript modules to strictly typed TypeScript interfaces',
        'Implement generic constraint utilities and discriminated unions',
        'Enforce strict tsconfig compiler options and zero-any lint policies',
        'Publish typed reusable SDK client libraries with auto-generated d.ts files'
      ];
    } else if (!hasTesting) {
      skillName = 'Automated Testing & CI/CD Pipelines';
      potentialGain = 6.9;
      explanation = 'Building robust unit and integration test suites with automated GitHub Actions validates architectural reliability to employers.';
      roadmap = [
        'Write unit tests achieving 80%+ branch coverage using PyTest / Vitest',
        'Implement automated end-to-end user journey tests with Playwright',
        'Create GitHub Actions workflows running linting, type checks, and tests on every PR',
        'Add branch protection rules requiring passing CI checks before merging'
      ];
    }

    return {
      skill: skillName,
      currentFit: topRole.fit,
      potentialImprovement: potentialGain,
      explanation,
      roadmap
    };
  }

  public static getDetailedRoadmap(skillName: string, targetRole: string, currentFit: number): DetailedSkillRoadmap {
    const isRedis = skillName.toLowerCase().includes('redis');
    const isML = skillName.toLowerCase().includes('pytorch') || skillName.toLowerCase().includes('model');

    if (isRedis) {
      return {
        skill: skillName,
        targetRole,
        currentFit,
        potentialImprovement: 7.4,
        explanation: 'In-memory caching and distributed key-value storage for ultra-low latency response times.',
        estimatedTotalWeeks: 3,
        milestones: [
          {
            step: 1,
            title: 'Foundations & Key-Value Architectures',
            description: 'Learn Redis data structures: Strings, Hashes, Lists, Sets, and Sorted Sets.',
            estimatedHours: 6,
            practiceExercise: 'Run a local Redis container and build a session store storing user tokens with 15-minute TTL expiration.',
            deliverable: 'A working Redis session authentication middleware in FastAPI or Express.'
          },
          {
            step: 2,
            title: 'Caching Strategies & Invalidation Patterns',
            description: 'Implement Cache-Aside, Write-Through, and Cache-Breakdown mitigations.',
            estimatedHours: 8,
            practiceExercise: 'Wrap database queries in a cache-aside decorator with automatic stale-while-revalidate fallback.',
            deliverable: 'Benchmarked endpoint showing 90%+ p99 latency reduction under load.'
          },
          {
            step: 3,
            title: 'Pub/Sub & Event-Driven Messaging',
            description: 'Use Redis streams and Pub/Sub for real-time WebSocket broadcasting.',
            estimatedHours: 8,
            practiceExercise: 'Implement a real-time event broadcaster publishing status notifications to connected clients.',
            deliverable: 'Multi-worker broadcast service verified with integration tests.'
          }
        ]
      };
    }

    if (isML) {
      return {
        skill: skillName,
        targetRole,
        currentFit,
        potentialImprovement: 9.2,
        explanation: 'Deep learning inference pipelines, ONNX quantization, and production model serving.',
        estimatedTotalWeeks: 4,
        milestones: [
          {
            step: 1,
            title: 'Neural Network Architecture & Training',
            description: 'Construct PyTorch Dataset, DataLoader, and neural classifier modules.',
            estimatedHours: 10,
            practiceExercise: 'Train a text embedding classifier on domain documents with early stopping and loss logging.',
            deliverable: 'Trained model weights achieving >= 90% validation accuracy.'
          },
          {
            step: 2,
            title: 'Inference Optimization & Quantization',
            description: 'Convert PyTorch weights to ONNX format and apply dynamic FP16 / INT8 quantization.',
            estimatedHours: 8,
            practiceExercise: 'Benchmark CPU inference throughput before and after ONNX runtime optimization.',
            deliverable: '2x to 4x throughput speedup with negligible accuracy degradation.'
          },
          {
            step: 3,
            title: 'Containerized Production API Serving',
            description: 'Package the model into a FastAPI microservice with concurrent worker batching.',
            estimatedHours: 8,
            practiceExercise: 'Build a Dockerized inference API with health checks, Prometheus metrics, and input sanitization.',
            deliverable: 'Production Docker container passing automated load tests.'
          }
        ]
      };
    }

    // Default: Docker & Containerization
    return {
      skill: skillName,
      targetRole,
      currentFit,
      potentialImprovement: 8.5,
      explanation: 'Container packaging, minimal production images, local orchestration, and cloud deployments.',
      estimatedTotalWeeks: 3,
      milestones: [
        {
          step: 1,
          title: 'Container Basics & Multi-Stage Dockerfiles',
          description: 'Package applications into lightweight, secure container images using multi-stage builds.',
          estimatedHours: 6,
          practiceExercise: 'Write an optimized Dockerfile for a React + Vite frontend that compiles static assets and serves them via an alpine Nginx image (< 25MB).',
          deliverable: 'A minimal, production-grade Docker image running non-root.'
        },
        {
          step: 2,
          title: 'Multi-Service Orchestration with Docker Compose',
          description: 'Orchestrate application frontend, backend API, and database in isolated bridged networks.',
          estimatedHours: 8,
          practiceExercise: 'Create a docker-compose.yml declaring backend API, frontend SPA, and PostgreSQL with health checks, persistent volumes, and environment variables.',
          deliverable: 'A single-command `docker compose up` spinning up the complete local environment.'
        },
        {
          step: 3,
          title: 'CI/CD Container Registry & Deployment Pipeline',
          description: 'Automate build, vulnerability scanning, and image publishing to GitHub Packages / Docker Hub.',
          estimatedHours: 8,
          practiceExercise: 'Configure a GitHub Actions workflow that builds multi-architecture images (amd64/arm64) on tag pushes and scans for CVE vulnerabilities using Trivy.',
          deliverable: 'Automated CI/CD pipeline running on every repository release tag.'
        }
      ]
    };
  }
// --- API Client Methods for SkillBridge / Career Analyzer ---

  public static async analyzeResumeMatch(params: {
    resumeText?: string;
    file?: File;
    jobDescription: string;
    jobTitle: string;
    userId: string;
  }): Promise<CareerMatchResult> {
    try {
      if (params.file) {
        const formData = new FormData();
        formData.append('resume_file', params.file);
        formData.append('file', params.file);
        formData.append('job_description', params.jobDescription);
        formData.append('target_role', params.jobTitle || 'Software Engineer');
        formData.append('job_title', params.jobTitle || 'Software Engineer');
        formData.append('guest_token', params.userId);
        formData.append('user_id', params.userId);

        const res = await fetch('/api/career/analyze-match', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const raw = await res.json();
          return {
            analysis_id: raw.analysis_id || raw.saved_id,
            job_title: raw.job_title || raw.target_role || params.jobTitle || 'Software Engineer',
            match_score: raw.match_score || 50,
            technical_alignment: raw.technical_alignment || raw.dimension_scores?.technical || 50,
            experience_score: raw.experience_score || raw.dimension_scores?.experience || 50,
            domain_relevance: raw.domain_relevance || raw.dimension_scores?.soft_skills || 50,
            keyword_coverage: raw.keyword_coverage || raw.dimension_scores?.education || 50,
            found_skills: raw.found_skills || [],
            missing_skills: raw.missing_skills || [],
            actionable_tips: raw.actionable_tips || raw.tips || [],
            recommended_courses: raw.recommended_courses || raw.course_recommendations || [],
            created_at: raw.created_at || new Date().toISOString()
          };
        }
      } else {
        const res = await fetch('/api/career/analyze-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: params.resumeText || '',
            job_description: params.jobDescription,
            target_role: params.jobTitle || 'Software Engineer',
            job_title: params.jobTitle || 'Software Engineer',
            guest_token: params.userId,
            user_id: params.userId
          })
        });
        if (res.ok) {
          const raw = await res.json();
          return {
            analysis_id: raw.analysis_id || raw.saved_id,
            job_title: raw.job_title || raw.target_role || params.jobTitle || 'Software Engineer',
            match_score: raw.match_score || 50,
            technical_alignment: raw.technical_alignment || raw.dimension_scores?.technical || 50,
            experience_score: raw.experience_score || raw.dimension_scores?.experience || 50,
            domain_relevance: raw.domain_relevance || raw.dimension_scores?.soft_skills || 50,
            keyword_coverage: raw.keyword_coverage || raw.dimension_scores?.education || 50,
            found_skills: raw.found_skills || [],
            missing_skills: raw.missing_skills || [],
            actionable_tips: raw.actionable_tips || raw.tips || [],
            recommended_courses: raw.recommended_courses || raw.course_recommendations || [],
            created_at: raw.created_at || new Date().toISOString()
          };
        }
      }
    } catch {
      // Backend unavailable, fallback to offline calculation
    }

    const resumeWords = (params.resumeText || '').toLowerCase();
    const jobWords = params.jobDescription.toLowerCase();

    const techCatalog = [
      'python', 'javascript', 'typescript', 'react', 'fastapi', 'docker',
      'kubernetes', 'sql', 'postgresql', 'mongodb', 'redis', 'aws', 'git',
      'node', 'linux', 'ci/cd', 'tailwind', 'graphql', 'rest', 'pandas', 'numpy'
    ];

    const requiredSkills = techCatalog.filter(skill => jobWords.includes(skill));
    const defaultRequired = requiredSkills.length > 0 ? requiredSkills : ['javascript', 'react', 'python', 'git'];

    const foundSkills = defaultRequired.filter(s => resumeWords.includes(s));
    const missingSkills = defaultRequired.filter(s => !resumeWords.includes(s));

    const skillRatio = defaultRequired.length > 0 ? foundSkills.length / defaultRequired.length : 0.5;
    const matchScore = Math.min(95, Math.max(20, Math.round(skillRatio * 75 + 18)));

    return {
      job_title: params.jobTitle || 'Software Engineer',
      match_score: matchScore,
      technical_alignment: Math.min(98, Math.max(25, Math.round(matchScore * 1.02))),
      experience_score: Math.min(95, Math.max(30, Math.round(matchScore * 0.95))),
      domain_relevance: Math.min(96, Math.max(20, Math.round(matchScore * 0.98))),
      keyword_coverage: Math.min(98, Math.max(15, Math.round(skillRatio * 90 + 10))),
      found_skills: foundSkills.length > 0 ? foundSkills : ['git', 'software development'],
      missing_skills: missingSkills.length > 0 ? missingSkills : ['docker', 'kubernetes', 'ci/cd'],
      actionable_tips: [
        missingSkills.length > 0
          ? 'Add concrete projects featuring ' + missingSkills.slice(0, 2).join(' and ') + ' to your portfolio.'
          : 'Quantify your impact using metrics (e.g. reduced load time by 30%).',
        'Mirror critical keywords from the job description directly in your experience bullet points.',
        'Include links to live deployed applications and GitHub repositories.'
      ],
      recommended_courses: [
        {
          title: 'Docker & Kubernetes: The Practical Guide',
          provider: 'Udemy',
          url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/',
          level: 'Intermediate',
          duration: '23 hours',
          rating: 4.8,
          skill: 'docker'
        },
        {
          title: 'FastAPI - The Complete Course',
          provider: 'freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=7t2alSnE2-I',
          level: 'Beginner to Advanced',
          duration: '8 hours',
          rating: 4.9,
          skill: 'fastapi'
        }
      ],
      created_at: new Date().toISOString()
    };
  }

  public static async analyzeRejectionEmail(
    emailText: string,
    userId: string
  ): Promise<RejectionEmailResult> {
    try {
      const res = await fetch('/api/career/rejection-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_text: emailText,
          user_id: userId,
          guest_token: userId
        })
      });
      if (res.ok) {
        const raw = await res.json();
        return {
          analysis_id: raw.analysis_id || raw.saved_id,
          category: raw.category || raw.decision || 'Rejection',
          confidence: typeof raw.confidence === 'number' ? (raw.confidence > 1 ? raw.confidence / 100 : raw.confidence) : 0.85,
          sentiment: raw.sentiment || 'Formal & Professional',
          reasons: raw.reasons || raw.possible_reasons || [],
          next_steps: raw.next_steps || [],
          created_at: raw.created_at || new Date().toISOString()
        };
      }
    } catch {
      // Fallback
    }

    const lower = emailText.toLowerCase();
    let category = 'Polite Rejection';
    let confidence = 0.82;
    const reasons = [
      'High volume of qualified applicants',
      'Candidate with closer tech stack match selected'
    ];

    if (lower.includes('technical') || lower.includes('assessment') || lower.includes('coding task')) {
      category = 'Technical Rejection';
      confidence = 0.88;
      reasons[0] = 'Performance on technical screening or take-home benchmark';
    } else if (lower.includes('experience') || lower.includes('senior') || lower.includes('years')) {
      category = 'Experience / Seniority Mismatch';
      confidence = 0.85;
      reasons[0] = 'Role required more production tenure or specific architecture experience';
    } else if (lower.includes('pause') || lower.includes('cancel') || lower.includes('headcount') || lower.includes('freeze')) {
      category = 'Pipeline Closure / Headcount Freeze';
      confidence = 0.94;
      reasons[0] = 'Hiring priorities shifted or position placed on hold';
    }

    return {
      category,
      confidence,
      sentiment: 'Polite / Professional',
      reasons,
      next_steps: [
        'Send a courteous thank-you reply acknowledging the update and requesting to stay in touch.',
        'Request brief feedback on 1-2 specific competencies that would strengthen future applications.',
        'Update your resume with new project metrics and re-apply to similar open positions.'
      ],
      created_at: new Date().toISOString()
    };
  }

  public static async fetchCourses(skill?: string, role?: string): Promise<CourseItem[]> {
    try {
      const params = new URLSearchParams();
      if (skill) params.append('skill', skill);
      if (role) params.append('role', role);

      const res = await fetch('/api/career/courses?' + params.toString());
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.courses || []);
        return list;
      }
    } catch {
      // Fallback
    }

    return [
      {
        title: 'Full Stack Open — Modern Web Development',
        provider: 'University of Helsinki',
        url: 'https://fullstackopen.com/en/',
        level: 'Intermediate',
        duration: '70 hours',
        rating: 4.9,
        skill: 'react'
      },
      {
        title: 'FastAPI - Modern Python Web Framework',
        provider: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=7t2alSnE2-I',
        level: 'All Levels',
        duration: '8 hours',
        rating: 4.8,
        skill: 'fastapi'
      },
      {
        title: 'Docker and Kubernetes: The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
        level: 'Intermediate',
        duration: '22 hours',
        rating: 4.8,
        skill: 'docker'
      },
      {
        title: 'Practical Deep Learning for Coders',
        provider: 'fast.ai',
        url: 'https://course.fast.ai/',
        level: 'Intermediate',
        duration: '40 hours',
        rating: 4.9,
        skill: 'pytorch'
      },
      {
        title: 'TypeScript for JavaScript Developers',
        provider: 'Coursera',
        url: 'https://www.coursera.org',
        level: 'Beginner',
        duration: '15 hours',
        rating: 4.7,
        skill: 'typescript'
      }
    ];
  }

  public static async fetchSavedCourses(userId: string): Promise<CourseItem[]> {
    try {
      const res = await fetch('/api/career/saved-courses?guest_token=' + encodeURIComponent(userId) + '&user_id=' + encodeURIComponent(userId));
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.courses || []);
        return list;
      }
    } catch {
      // Fallback to localStorage
    }
    const local = localStorage.getItem('codedna_saved_courses_' + userId);
    return local ? JSON.parse(local) : [];
  }

  public static async saveCourse(course: {
    user_id: string;
    course_title: string;
    provider: string;
    course_url: string;
    skill_name: string;
    rating?: number;
  }): Promise<any> {
    try {
      const res = await fetch('/api/career/saved-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...course,
          guest_token: course.user_id,
          title: course.course_title,
          url: course.course_url,
          skill: course.skill_name
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local storage
    }
    const key = 'codedna_saved_courses_' + course.user_id;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = { ...course, id: Date.now(), is_completed: false };
    list.unshift(newItem);
    localStorage.setItem(key, JSON.stringify(list));
    return newItem;
  }

  public static async deleteCourse(id: number, userId?: string): Promise<boolean> {
    try {
      const tokenQuery = userId ? '?guest_token=' + encodeURIComponent(userId) + '&user_id=' + encodeURIComponent(userId) : '';
      const res = await fetch('/api/career/saved-courses/' + id + tokenQuery, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    if (userId) {
      const key = 'codedna_saved_courses_' + userId;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = list.filter((c: any) => c.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
    return true;
  }

  public static async fetchHistory(userId: string): Promise<any[]> {
    try {
      const res = await fetch('/api/career/history?guest_token=' + encodeURIComponent(userId) + '&user_id=' + encodeURIComponent(userId));
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.history || []);
        return list;
      }
    } catch {
      // Fallback
    }
    const local = localStorage.getItem('codedna_career_history_' + userId);
    return local ? JSON.parse(local) : [];
  }

  public static async deleteHistory(id: number, userId?: string): Promise<boolean> {
    try {
      const tokenQuery = userId ? '?guest_token=' + encodeURIComponent(userId) + '&user_id=' + encodeURIComponent(userId) : '';
      const res = await fetch('/api/career/history/' + id + tokenQuery, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    if (userId) {
      const key = 'codedna_career_history_' + userId;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = list.filter((h: any) => h.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
    return true;
  }

  // =========================================================================
  // CAREER INTELLIGENCE COMPREHENSIVE ENGINE INTEGRATION
  // =========================================================================
  public static async analyzeCareerIntelligence(params: {
    username?: string;
    resumeText?: string;
    resumeFile?: File | null;
    preferences?: any;
    targetRole?: string;
    guestToken?: string;
  }): Promise<{ status: string; saved_id?: number; report: CareerIntelligenceReport }> {
    const { username, resumeText, resumeFile, preferences, targetRole, guestToken } = params;

    if (resumeFile) {
      const formData = new FormData();
      formData.append('resume_file', resumeFile);
      if (username) formData.append('username', username);
      if (resumeText) formData.append('resume_text', resumeText);
      if (targetRole) formData.append('target_role', targetRole);
      if (guestToken) formData.append('guest_token', guestToken);
      if (preferences) formData.append('preferences', JSON.stringify(preferences));

      const res = await fetch('/api/career/intelligence/analyze', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to analyze career intelligence.');
      }
      return await res.json();
    } else {
      const res = await fetch('/api/career/intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          resume_text: resumeText,
          target_role: targetRole,
          guest_token: guestToken,
          preferences
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to analyze career intelligence.');
      }
      return await res.json();
    }
  }

  public static async explainCareerIntelligence(params: {
    question: string;
    report?: CareerIntelligenceReport;
    reportId?: number;
    guestToken?: string;
  }): Promise<IntelligenceExplanationResult> {
    const res = await fetch('/api/career/intelligence/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: params.question,
        report: params.report,
        report_id: params.reportId,
        guest_token: params.guestToken
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to generate explanation.');
    }
    return await res.json();
  }

  public static async getIntelligenceHistory(guestToken: string): Promise<any[]> {
    if (!guestToken) return [];
    try {
      const res = await fetch('/api/career/intelligence/history?guest_token=' + encodeURIComponent(guestToken));
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public static async getIntelligenceReportById(reportId: number, guestToken: string): Promise<any> {
    const res = await fetch('/api/career/intelligence/report/' + reportId + '?guest_token=' + encodeURIComponent(guestToken));
    if (!res.ok) {
      throw new Error('Report not found or access denied.');
    }
    return await res.json();
  }

  public static async deleteIntelligenceReport(reportId: number, guestToken: string): Promise<boolean> {
    const res = await fetch('/api/career/intelligence/report/' + reportId + '?guest_token=' + encodeURIComponent(guestToken), {
      method: 'DELETE'
    });
    return res.ok;
  }
}
