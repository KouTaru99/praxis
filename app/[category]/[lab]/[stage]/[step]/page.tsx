import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Group,
  Paper,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { getAllLabs, getStep, flatSteps } from '@/lib/content';
import BlockRenderer from '@/components/BlockRenderer';
import LabShell from '@/components/LabShell';
import LabNav from '@/components/LabNav';

export function generateStaticParams() {
  return getAllLabs().flatMap((lab) =>
    lab.stages.flatMap((stage) =>
      stage.steps.map((step) => ({
        category: lab.category,
        lab: lab.id,
        stage: stage.id,
        step: step.id,
      }))
    )
  );
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ category: string; lab: string; stage: string; step: string }>;
}) {
  const { category, lab: labId, stage: stageId, step: stepId } = await params;
  const found = getStep(category, labId, stageId, stepId);
  if (!found) notFound();
  const { lab, stage, step } = found;

  const flat = flatSteps(lab);
  const idx = flat.findIndex((x) => x.step.id === step.id && x.stage.id === stage.id);
  const prev = idx > 0 ? flat[idx - 1] : undefined;
  const next = idx < flat.length - 1 ? flat[idx + 1] : undefined;

  const breadcrumb = (
    <Breadcrumbs fz="sm" separator="›" styles={{ root: { flexWrap: 'nowrap', overflow: 'hidden' } }}>
      <Anchor component={Link} href={`/${category}/${labId}`} c="dimmed" lineClamp={1}>
        {lab.title}
      </Anchor>
      <Text c="dimmed" visibleFrom="sm">
        Chặng {stage.order}
      </Text>
      <Text lineClamp={1}>{step.title}</Text>
    </Breadcrumbs>
  );

  return (
    <LabShell
      breadcrumb={breadcrumb}
      navbar={<LabNav lab={lab} category={category} activeStageId={stage.id} activeStepId={step.id} />}
    >
      <Box maw={860} mx="auto" px={{ base: 'md', sm: 'xl' }} py="xl">
        <Text c="dimmed" fz="xs" fw={600} tt="uppercase" mb={6} style={{ letterSpacing: '0.04em' }}>
          Chặng {stage.order} · {stage.title}
        </Text>
        <Title order={1} mb="lg">
          {step.title}
        </Title>

        {/* Mục tiêu */}
        <SectionHead icon="ti-target" text="Mục tiêu" />
        <Text fz="md" lh={1.7} mb="md">
          {step.goal}
        </Text>
        <Paper withBorder radius="md" p="md" mb="xs" bg="var(--mantine-color-gray-0)">
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <ThemeIcon variant="light" color="gray" size="md" radius="md">
              <i className="ti ti-package" style={{ fontSize: 15 }} />
            </ThemeIcon>
            <Text fz="sm" lh={1.6}>
              <b style={{ fontWeight: 600 }}>Sản phẩm của bước:</b> {step.deliverable}
            </Text>
          </Group>
        </Paper>
        <Paper withBorder radius="md" p="md" mb="xl" bg="var(--mantine-color-blue-0)" style={{ borderColor: 'var(--mantine-color-blue-2)' }}>
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <ThemeIcon variant="light" size="md" radius="md">
              <i className="ti ti-eye" style={{ fontSize: 15 }} />
            </ThemeIcon>
            <Text fz="sm" lh={1.6}>
              <b style={{ fontWeight: 600 }}>Sau bước này bạn sẽ thấy:</b> {step.outcome_preview}
            </Text>
          </Group>
        </Paper>

        {/* Hướng dẫn */}
        <SectionHead icon="ti-book" text="Hướng dẫn" />
        <BlockRenderer blocks={step.blocks} />

        {/* Footer nav */}
        <Divider my="xl" />
        <Group justify="space-between" wrap="wrap" gap="sm">
          {prev ? (
            <Button
              component={Link}
              href={`/${category}/${labId}/${prev.stage.id}/${prev.step.id}`}
              variant="default"
              leftSection={<i className="ti ti-arrow-left" />}
            >
              <Box component="span" maw={240} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prev.step.title}
              </Box>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button
              component={Link}
              href={`/${category}/${labId}/${next.stage.id}/${next.step.id}`}
              rightSection={<i className="ti ti-arrow-right" />}
            >
              <Box component="span" maw={240} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Bước tiếp: {next.step.title}
              </Box>
            </Button>
          ) : (
            <span />
          )}
        </Group>
      </Box>
    </LabShell>
  );
}

function SectionHead({ icon, text }: { icon: string; text: string }) {
  return (
    <Group gap={8} mb="sm">
      <ThemeIcon variant="light" size="md" radius="md">
        <i className={`ti ${icon}`} style={{ fontSize: 16 }} />
      </ThemeIcon>
      <Title order={3}>{text}</Title>
    </Group>
  );
}
