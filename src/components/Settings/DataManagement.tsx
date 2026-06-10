'use client';

import { useState } from 'react';
import Button from '@/components/UI/Button';

interface ExportData {
  version: string;
  exportedAt: string;
  applications: any[];
  interviews: any[];
  contacts: any[];
  resumes: any[];
  offers: any[];
  questions: any[];
  exams: any[];
  calendarEvents: any[];
  settings: any;
}

interface ImportResult {
  success: boolean;
  message: string;
  imported?: {
    applications: number;
    interviews: number;
    contacts: number;
    resumes: number;
    offers: number;
    questions: number;
    exams: number;
    calendarEvents: number;
  };
}

export default function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const exportData = () => {
    setIsExporting(true);

    try {
      const dataStr = localStorage.getItem('campus-helper-data');
      const settingsStr = localStorage.getItem('campus-helper-settings');

      const data = dataStr ? JSON.parse(dataStr) : {};
      const settings = settingsStr ? JSON.parse(settingsStr) : {};

      const exportPayload: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        applications: data.applications || [],
        interviews: data.interviews || [],
        contacts: data.contacts || [],
        resumes: data.resumes || [],
        offers: data.offers || [],
        questions: data.questions || [],
        exams: data.exams || [],
        calendarEvents: data.calendarEvents || [],
        settings: settings,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `校招助手数据备份_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastExport(new Date().toLocaleString());
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported: ExportData = JSON.parse(content);

        if (!imported.version || !imported.exportedAt) {
          throw new Error('无效的数据文件格式');
        }

        const existingDataStr = localStorage.getItem('campus-helper-data');
        const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};

        const mergedData = {
          applications: [
            ...(existingData.applications || []),
            ...(imported.applications || []).filter((app: any) =>
              !(existingData.applications || []).some((e: any) => e.id === app.id)
            )
          ],
          interviews: [
            ...(existingData.interviews || []),
            ...(imported.interviews || []).filter((int: any) =>
              !(existingData.interviews || []).some((e: any) => e.id === int.id)
            )
          ],
          contacts: [
            ...(existingData.contacts || []),
            ...(imported.contacts || []).filter((c: any) =>
              !(existingData.contacts || []).some((e: any) => e.id === c.id)
            )
          ],
          resumes: [
            ...(existingData.resumes || []),
            ...(imported.resumes || []).filter((r: any) =>
              !(existingData.resumes || []).some((e: any) => e.id === r.id)
            )
          ],
          offers: [
            ...(existingData.offers || []),
            ...(imported.offers || []).filter((o: any) =>
              !(existingData.offers || []).some((e: any) => e.id === o.id)
            )
          ],
          questions: [
            ...(existingData.questions || []),
            ...(imported.questions || []).filter((q: any) =>
              !(existingData.questions || []).some((e: any) => e.id === q.id)
            )
          ],
          exams: [
            ...(existingData.exams || []),
            ...(imported.exams || []).filter((ex: any) =>
              !(existingData.exams || []).some((e: any) => e.id === ex.id)
            )
          ],
          calendarEvents: [
            ...(existingData.calendarEvents || []),
            ...(imported.calendarEvents || []).filter((ev: any) =>
              !(existingData.calendarEvents || []).some((e: any) => e.id === ev.id)
            )
          ],
        };

        localStorage.setItem('campus-helper-data', JSON.stringify(mergedData));

        if (imported.settings) {
          localStorage.setItem('campus-helper-settings', JSON.stringify({
            ...JSON.parse(existingDataStr || '{}'),
            ...imported.settings,
          }));
        }

        setImportResult({
          success: true,
          message: '数据导入成功！页面将自动刷新...',
          imported: {
            applications: (imported.applications || []).length,
            interviews: (imported.interviews || []).length,
            contacts: (imported.contacts || []).length,
            resumes: (imported.resumes || []).length,
            offers: (imported.offers || []).length,
            questions: (imported.questions || []).length,
            exams: (imported.exams || []).length,
            calendarEvents: (imported.calendarEvents || []).length,
          },
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        setImportResult({
          success: false,
          message: error instanceof Error ? error.message : '导入失败，请检查文件格式',
        });
      } finally {
        setIsImporting(false);
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      if (confirm('再次确认：所有数据将被永久删除！')) {
        localStorage.removeItem('campus-helper-data');
        localStorage.removeItem('campus-helper-settings');
        localStorage.removeItem('campus-helper-initialized');
        localStorage.removeItem('kimi-api-key');
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">📤 导出数据</h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-4">
          将所有数据导出为 JSON 文件，方便备份或迁移到其他设备
        </p>
        <Button
          onClick={exportData}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? '导出中...' : '📥 导出所有数据'}
        </Button>
        {lastExport && (
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            上次导出: {lastExport}
          </p>
        )}
      </div>

      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">📥 导入数据</h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-4">
          从备份文件导入数据，已存在的数据不会被覆盖
        </p>
        <label className="inline-block">
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
            disabled={isImporting}
          />
          <Button
            variant="secondary"
            disabled={isImporting}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isImporting ? '导入中...' : '📂 选择备份文件'}
          </Button>
        </label>

        {importResult && (
          <div className={`mt-4 p-4 rounded-xl ${
            importResult.success ? 'bg-[var(--success)]/10' : 'bg-red-500/10'
          }`}>
            <p className={`text-sm ${
              importResult.success ? 'text-[var(--success)]' : 'text-red-500'
            }`}>
              {importResult.message}
            </p>
            {importResult.success && importResult.imported && (
              <div className="mt-2 text-xs text-[var(--foreground-muted)]">
                导入了 {importResult.imported.applications} 个投递、{importResult.imported.interviews} 个面试、{importResult.imported.contacts} 个联系人...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">🗑️ 清除数据</h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-4">
          清除所有本地存储的数据，包括 API 设置。此操作不可恢复！
        </p>
        <Button
          variant="danger"
          onClick={clearAllData}
          className="flex items-center gap-2"
        >
          🗑️ 清除所有数据
        </Button>
      </div>

      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">💾 数据统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '投递记录', key: 'applications' },
            { label: '面试记录', key: 'interviews' },
            { label: '联系人', key: 'contacts' },
            { label: '简历', key: 'resumes' },
          ].map(({ label, key }) => {
            const dataStr = localStorage.getItem('campus-helper-data');
            const data = dataStr ? JSON.parse(dataStr) : {};
            const count = (data[key] || []).length;

            return (
              <div key={key} className="bg-[var(--muted)] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">{count}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
