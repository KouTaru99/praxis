import Link from 'next/link';
import { Anchor, Box, Container, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
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
  dev: 'lập trình theo quy trình PTPM',
  pm: 'quản lý dự án',
  ba: 'phân tích nghiệp vụ',
};

const PREVIEW_PER_CATEGORY = 3;

export default function HomePage() {
  const labs = getAllLabs();
  const categories = Array.from(new Set(labs.map((l) => l.category)));

  return (
    <>
      <SiteHeader />

      {/* Hero full-bleed — lấp hết bề ngang, không để trống 2 bên */}
      <Box
        style={{
          background: 'linear-gradient(180deg, var(--mantine-color-gray-0), var(--mantine-color-body))',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Container size="lg" py={48}>
          <Stack gap="sm" maw={680}>
            <Title order={1} fz={32}>
              Làm ra kết quả thật, theo đúng quy trình người trong nghề.
            </Title>
            <Text fz="lg" c="dimmed" lh={1.6}>
              Mỗi Lab dẫn bạn đi từng bước tới một sản phẩm chạy được — copy theo là chạy, làm tới đâu
              thấy thành quả tới đó.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Stack gap={40}>
          {categories.map((cat) => {
            const catLabs = labs.filter((l) => l.category === cat);
            const preview = catLabs.slice(0, PREVIEW_PER_CATEGORY);
            return (
              <Stack key={cat} gap="md">
                <Group justify="space-between" align="center">
                  <Group gap={10}>
                    <ThemeIcon variant="light" size={34} radius="md">
                      <i className={`ti ${CATEGORY_ICON[cat] ?? 'ti-folder'}`} style={{ fontSize: 19 }} />
                    </ThemeIcon>
                    <div>
                      <Title order={3}>{CATEGORY_LABEL[cat] ?? cat}</Title>
                      {CATEGORY_SUB[cat] && (
                        <Text c="dimmed" fz="sm">
                          {CATEGORY_SUB[cat]}
                        </Text>
                      )}
                    </div>
                  </Group>
                  <Anchor component={Link} href={`/${cat}`} fz="sm" fw={500}>
                    Xem tất cả ({catLabs.length}) →
                  </Anchor>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  {preview.map((lab) => (
                    <LabCard key={lab.id} lab={lab} />
                  ))}
                </SimpleGrid>
              </Stack>
            );
          })}
        </Stack>
      </Container>
    </>
  );
}
