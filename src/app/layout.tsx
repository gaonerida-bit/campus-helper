import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "校招助手 - 秋招管理工具",
  description: "帮助管理秋招投递进度、面试提醒、简历优化的智能助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
