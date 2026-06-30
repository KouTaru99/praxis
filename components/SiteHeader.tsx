import Link from 'next/link';
import { Box, Container, Group, Text, ThemeIcon } from '@mantine/core';

// Thanh đầu trang full-width, dùng chung cho home/category/lab.
export default function SiteHeader() {
  return (
    <Box
      component="header"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        background: 'var(--mantine-color-body)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container size="lg" h={56}>
        <Group h="100%" justify="space-between">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group gap={9}>
              <ThemeIcon variant="light" radius="md" size={30}>
                <i className="ti ti-tool" style={{ fontSize: 17 }} />
              </ThemeIcon>
              <Text fw={650} fz="lg">
                Praxis
              </Text>
              <Text c="dimmed" fz="sm" visibleFrom="xs">
                — học bằng cách làm
              </Text>
            </Group>
          </Link>
        </Group>
      </Container>
    </Box>
  );
}
