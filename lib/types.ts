export type BlockType =
  | 'prose'
  | 'code'
  | 'command'
  | 'callout'
  | 'resource'
  | 'diagram'
  | 'concept-link';

export interface Block {
  type: BlockType;
  content: string;
  lang?: string;          // code
  filename?: string;      // code
  variant?: 'info' | 'warning' | 'tip'; // callout
  label?: string;         // resource
  url?: string;           // resource
  kind?: 'article' | 'video' | 'docs'; // resource
}

export interface Step {
  id: string;
  title: string;
  order: number;
  est_minutes?: number;
  commit_ref?: string;
  goal: string;
  deliverable: string;
  outcome_preview: string;
  blocks: Block[];
}

export interface Stage {
  id: string;
  order: number;
  title: string;
  part?: string; // nhóm hiển thị (Phần) cho lab dài — không đổi URL
  description?: string;
  steps: Step[];
}

export interface Lab {
  id: string;
  title: string;
  category: string;       // dev | pm | ba
  complexity: 'co-ban' | 'trung-cap' | 'nang-cao';
  est_hours: number;
  description: string;
  repo_solution?: string;
  tags?: string[];
  stages: Stage[];
}

export const COMPLEXITY_LABEL: Record<Lab['complexity'], string> = {
  'co-ban': 'Cơ bản',
  'trung-cap': 'Trung cấp',
  'nang-cao': 'Nâng cao',
};

export const CATEGORY_LABEL: Record<string, string> = {
  dev: 'Dev',
  pm: 'PM',
  ba: 'BA',
};
