import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Praxis — học bằng cách làm',
  description:
    'Làm ra kết quả thật, theo đúng quy trình người trong nghề. Mỗi Lab dẫn bạn đi từng bước copy-vào-là-chạy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
