import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Anchor, Box, Breadcrumbs, Container, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { getAllLabs } from '@/lib/content';
import { CATEGORY_LABEL } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';
import LabCard from '@/components/LabCard';

const CATEGORY_ICON: Record<string, string> = {
  dev: 'ti-code',
  pm: 'ti-clipboard-list',
  ba: 'ti-file-search',
};

const CATEGORY_SUB: Record<string, string> = {
  dev: 'Lập trình theo quy trình phát triển phần mềm thật — từ yêu cầu tới triển khai.',
  pm: 'Quản lý dự án.',
  ba: 'Phân tích nghiệp vụ.',
};

export function generateStaticParams() {
  const cats = Array.from(new Set(getAllLabs().map((l) => l.category)));
  return cats.map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const labs = getAllLabs().filter((l) => l.category === category);
  if (labs.length === 0) notFound();

  return (
    <>
      <SiteHeader />
      <Box style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: 'var(--mantine-color-gray-0)' }}>
        <Container size="lg" py="xl">
          <Breadcrumbs fz="sm" mb="md" separator="›">
            <Anchor component={Link} href="/" c="dimmed">
              Trang chủ
            </Anchor>
            <Text>{CATEGORY_LABEL[category] ?? category}</Text>
          </Breadcrumbs>
          <Group gap={12}>
            <ThemeIcon variant="light" size={44} radius="md">
              <i className={`ti ${CATEGORY_ICON[category] ?? 'ti-folder'}`} style={{ fontSize: 24 }} />
            </ThemeIcon>
            <div>
              <Title order={1}>{CATEGORY_LABEL[category] ?? category}</Title>
              <Text c="dimmed" fz="sm" mt={2} maw={620}>
                {CATEGORY_SUB[category]}
              </Text>
            </div>
          </Group>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Stack gap="md">
          <Text c="dimmed" fz="sm">
            {labs.length} khoá học
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}
