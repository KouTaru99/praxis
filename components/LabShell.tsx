'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { AppShell, Burger, Group, Text, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Shell full-width cho trang Lab/Step: header + navbar (cây chặng/bước) + main trải rộng.
export default function LabShell({
  navbar,
  breadcrumb,
  children,
}: {
  navbar: ReactNode;
  breadcrumb: ReactNode;
  children: ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 290, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm" wrap="nowrap">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group gap={8} wrap="nowrap">
              <ThemeIcon variant="light" radius="md" size={28}>
                <i className="ti ti-tool" style={{ fontSize: 16 }} />
              </ThemeIcon>
              <Text fw={650} fz="md" visibleFrom="xs">
                Praxis
              </Text>
            </Group>
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>{breadcrumb}</div>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm" style={{ background: 'var(--mantine-color-gray-0)' }}>
        {navbar}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
