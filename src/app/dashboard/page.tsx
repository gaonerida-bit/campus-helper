'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import WeeklyReport from '@/components/Reports/WeeklyReport';
import Button from '@/components/UI/Button';

export default function DashboardPage() {
  const [showReport, setShowReport] = useState(true);

  return (
    <AppLayout>
      <Header
        title="数据看板"
        subtitle="全面了解你的求职进展"
        actions={
          <Button
            variant="secondary"
            onClick={() => setShowReport(!showReport)}
          >
            {showReport ? '📊 收起报告' : '📊 查看报告'}
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {showReport && <WeeklyReport />}

        {/* Additional dashboard widgets can go here */}
        <div className="mt-6 bg-[var(--surface)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">💡 使用提示</h3>
          <ul className="space-y-2 text-sm text-[var(--foreground-light)]">
            <li>• 定期查看周报，了解自己的求职进度</li>
            <li>• 点击「导出报告」可保存周报为文本文件</li>
            <li>• 数据会自动保存到本地，可随时查看</li>
            <li>• 使用快捷键 ⌘K 可快速搜索</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
