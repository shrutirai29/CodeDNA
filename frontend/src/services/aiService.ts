import type { DeveloperProfile } from '../types/developer';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  engine?: 'gemini' | 'local_ml';
}

export class AIService {
  public static async queryCopilot(
    message: string,
    profile: DeveloperProfile,
    conversationHistory: ChatMessage[]
  ): Promise<{ response: string; engine: 'gemini' | 'local_ml' }> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          profile_username: profile.username,
          history: conversationHistory.map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [h.content]
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          response: data.reply || data.response,
          engine: data.engine?.includes('gemini') ? 'gemini' : 'local_ml'
        };
      }
    } catch {
      // Server offline / client-only mode, fall through to local mentor
    }

    const q = message.toLowerCase();

    if (q.includes('backend') || q.includes('score low')) {
      return {
        response: `Looking at **@${profile.username}**'s profile, your **Code Depth** is currently **${profile.dimensions.technical_depth}/100** and **Weekly Habit** is **${profile.dimensions.consistency}/100**. To push your backend score into the 95th percentile, expand beyond standard CRUD endpoints: integrate distributed caching (**Redis**), introduce database indexing/profiling on **PostgreSQL**, and add async task workers (**Celery / Kafka**).`,
        engine: 'local_ml'
      };
    }

    if (q.includes('elite senior') || q.includes('tier') || q.includes('reach')) {
      return {
        response: `Currently, **@${profile.username}** is rated as **${profile.tier}** with an overall score of **${profile.developer_score}/100** (ranking higher than **${profile.percentile_rank}%** of developers). To climb to the next tier, focus on: 1) Increasing your **Weekly Habit** consistency to reduce commit burstiness, 2) Shipping a repository with automated CI/CD and unit test coverage (>80%), and 3) Deepening low-level system design.`,
        engine: 'local_ml'
      };
    }

    if (q.includes('learn next') || q.includes('skill') || q.includes('what should i learn')) {
      return {
        response: `Based on your Technology DNA graph and Career Matching fit (${profile.careers[0]?.role || 'Full-Stack Developer'} at ${profile.careers[0]?.fit || 90}%), your **Next Best Skill** is **${profile.next_best_skill.skill}**! Adopting containerization will increase your multi-role fit by approximately **+${profile.next_best_skill.potentialImprovement}%** and bridge your current DevOps gap.`,
        engine: 'local_ml'
      };
    }

    if (q.includes('missing') || q.includes('portfolio') || q.includes('project')) {
      return {
        response: `Your repository portfolio features strong projects like **${profile.repositories.slice(0, 2).map(r => r.name).join('** and **')}**. To maximize hiring and open-source impact, add: 1) A distributed systems project with rate limiting or web sockets, 2) Clean architectural documentation with Mermaid diagrams in your READMEs, and 3) Benchmark performance tests.`,
        engine: 'local_ml'
      };
    }

    return {
      response: `CodeDNA Copilot here! I've audited **@${profile.username}**'s GitHub footprint. You're exhibiting strong velocity in **${profile.tech_dna.slice(0, 3).map(t => t.name).join(', ')}** with a high project impact score (**${profile.dimensions.impact}/100**). Feel free to ask me how to optimize your repositories, simulate skill additions, or prepare for engineering roles!`,
      engine: 'gemini'
    };
  }
}
