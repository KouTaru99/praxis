import Link from 'next/link';
import { Badge, Card, Group, Text } from '@mantine/core';
import { COMPLEXITY_LABEL, type Lab } from '@/lib/types';

const COMPLEXITY_COLOR: Record<Lab['complexity'], string> = {
  'co-ban': 'teal',
  'trung-cap': 'yellow',
  'nang-cao': 'red',
};

function stepCount(lab: Lab) {
  return lab.stages.reduce((n, s) => n + s.steps.length, 0);
}

export default function LabCard({ lab }: { lab: Lab }) {
  return (
    <Card
      className="lab-card"
      component={Link}
      href={`/${lab.category}/${lab.id}`}
      withBorder
      radius="md"
      padding="lg"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <Text fw={600} fz="md" lh={1.3}>
          {lab.title}
        </Text>
        <Badge color={COMPLEXITY_COLOR[lab.complexity]} variant="light" size="sm" radius="sm">
          {COMPLEXITY_LABEL[lab.complexity]}
        </Badge>
      </Group>

      <Text c="dimmed" fz="sm" mt={8} lh={1.6} style={{ flex: 1 }}>
        {lab.description}
      </Text>

      <Group gap="lg" mt="md" fz="xs" c="dimmed">
        <Group gap={5}>
          <i className="ti ti-clock" style={{ fontSize: 14 }} />~{lab.est_hours} giờ
        </Group>
        <Group gap={5}>
          <i className="ti ti-stairs" style={{ fontSize: 14 }} />
          {lab.stages.length} chặng · {stepCount(lab)} bước
        </Group>
      </Group>

      <Group gap={6} mt="sm" c="blue.7" fz="sm" className="lab-card-cta" fw={500}>
        <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
        Bắt đầu Lab
      </Group>
    </Card>
  );
}
