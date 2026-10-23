import records from '@/content/business/agent-projects.json';

export const agentProjects = records;
export type AgentProject = (typeof agentProjects)[number];
export const agentProjectPath = (slug: string) => `/work/agents/${slug}`;
