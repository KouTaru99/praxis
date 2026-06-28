import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { Lab, Stage, Step } from './types';

const LABS_ROOT = path.join(process.cwd(), 'content', 'labs');

function readYaml<T>(file: string): T {
  return yaml.load(fs.readFileSync(file, 'utf8')) as T;
}

function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/** Đọc đầy đủ 1 Lab (kèm Chặng + Bước). */
export function getLab(labFolder: string): Lab {
  const labDir = path.join(LABS_ROOT, labFolder);
  const meta = readYaml<Omit<Lab, 'stages'>>(path.join(labDir, 'lab.yaml'));

  const stagesDir = path.join(labDir, 'stages');
  const stages: Stage[] = listDirs(stagesDir).map((stageFolder) => {
    const stageDir = path.join(stagesDir, stageFolder);
    const stageMeta = readYaml<Omit<Stage, 'steps'>>(path.join(stageDir, 'stage.yaml'));

    const steps: Step[] = fs
      .readdirSync(stageDir)
      .filter((f) => /^\d+\.ya?ml$/.test(f))
      .map((f) => readYaml<Step>(path.join(stageDir, f)))
      .sort((a, b) => a.order - b.order);

    return { ...stageMeta, steps };
  });

  stages.sort((a, b) => a.order - b.order);
  return { ...meta, stages };
}

/** Tất cả Lab (đầy đủ) — dùng cho trang chủ + generateStaticParams. */
export function getAllLabs(): Lab[] {
  return listDirs(LABS_ROOT)
    .map(getLab)
    .sort((a, b) => a.title.localeCompare(b.title, 'vi'));
}

export function getLabByRoute(category: string, labId: string): Lab | undefined {
  return getAllLabs().find((l) => l.category === category && l.id === labId);
}

export function getStep(
  category: string,
  labId: string,
  stageId: string,
  stepId: string
): { lab: Lab; stage: Stage; step: Step } | undefined {
  const lab = getLabByRoute(category, labId);
  if (!lab) return undefined;
  const stage = lab.stages.find((s) => s.id === stageId);
  if (!stage) return undefined;
  const step = stage.steps.find((s) => s.id === stepId);
  if (!step) return undefined;
  return { lab, stage, step };
}

/** Bước trước/sau trên toàn Lab (phẳng) — cho footer điều hướng. */
export function flatSteps(lab: Lab): { stage: Stage; step: Step }[] {
  return lab.stages.flatMap((stage) => stage.steps.map((step) => ({ stage, step })));
}
