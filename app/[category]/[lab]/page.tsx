import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { getAllLabs, getLabByRoute } from '@/lib/content';
import { CATEGORY_LABEL, COMPLEXITY_LABEL, type Lab } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';

const COMPLEXITY_COLOR: Record<Lab['complexity'], string> = {
  'co-ban': 'teal',
  'trung-cap': 'yellow',
  'nang-cao': 'red',
};

export function generateStaticParams() {
  return getAllLabs().map((l) => ({ category: l.category, lab: l.id }));
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ category: string; lab: string }>;
}) {
  const { category, lab: labId } = await params;
  const lab = getLabByRoute(category, labId);
  if (!lab) notFound();

  const totalSteps = lab.stages.reduce((n, s) => n + s.steps.length, 0);
  const first = lab.stages.find((s) => s.steps.length > 0);
  const firstStepHref = first ? `/${category}/${labId}/${first.id}/${first.steps[0].id}` : undefined;

  return (
    <>
      <SiteHeader />
      <Box style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: 'var(--mantine-color-gray-0)' }}>
        <Container size="md" py="xl">
          <Breadcrumbs fz="sm" mb="md" separator="›">
            <Anchor component={Link} href="/" c="dimmed">
              Trang chủ
            </Anchor>
            <Anchor component={Link} href={`/${category}`} c="dimmed">
              {CATEGORY_LABEL[category] ?? category}
            </Anchor>
            <Text>{lab.title}</Text>
          </Breadcrumbs>
          <Title order={1} mb="xs">
            {lab.title}
          </Title>
          <Text c="dimmed" fz="md" lh={1.6} maw={680} mb="md">
            {lab.description}
          </Text>
          <Group gap="sm">
            <Badge color={COMPLEXITY_COLOR[lab.complexity]} variant="light" radius="sm">
              {COMPLEXITY_LABEL[lab.complexity]}
            </Badge>
            <Text fz="sm" c="dimmed">
              <i className="ti ti-clock" /> ~{lab.est_hours} giờ · {lab.stages.length} chặng · {totalSteps} bước
            </Text>
            {lab.repo_solution && (
              <Anchor href={lab.repo_solution} fz="sm" target="_blank">
                <i className="ti ti-brand-github" /> Repo mẫu lời giải
              </Anchor>
            )}
          </Group>
          {firstStepHref && (
            <Button component={Link} href={firstStepHref} mt="lg" rightSection={<i className="ti ti-arrow-right" />}>
              Bắt đầu Chặng 1
            </Button>
          )}
        </Container>
      </Box>

      <Container size="md" py="xl">
        <Stack gap="lg">
          {lab.stages.map((stage) => (
            <Box key={stage.id}>
              <Group gap="sm" mb="sm">
                <ThemeIcon variant="light" radius="xl" size={28}>
                  <Text fz="sm" fw={700}>
                    {stage.order}
                  </Text>
                </ThemeIcon>
                <Title order={4}>{stage.title}</Title>
                {stage.description && (
                  <Text c="dimmed" fz="sm" visibleFrom="sm">
                    — {stage.description}
                  </Text>
                )}
              </Group>
              <Stack gap={6} pl={40}>
                {stage.steps.map((step) => (
                  <Paper
                    key={step.id}
                    component={Link}
                    href={`/${category}/${labId}/${stage.id}/${step.id}`}
                    className="lab-card"
                    withBorder
                    radius="md"
                    px="md"
                    py="xs"
                  >
                    <Group gap="sm" wrap="nowrap">
                      <i className="ti ti-file-text" style={{ fontSize: 16, color: 'var(--mantine-color-dimmed)' }} />
                      <Text fz="sm">{step.title}</Text>
                      {step.est_minutes && (
                        <Text fz="xs" c="dimmed" ml="auto">
                          {step.est_minutes} phút
                        </Text>
                      )}
                    </Group>
                  </Paper>
                ))}
                {stage.steps.length === 0 && (
                  <Text fz="sm" c="dimmed">
                    (đang biên soạn)
                  </Text>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Container>
    </>
  );
}
