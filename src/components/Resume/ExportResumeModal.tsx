'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableResume, { ResumeData } from './PrintableResume';

interface ExportResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  resumeName?: string;
}

export default function ExportResumeModal({
  isOpen,
  onClose,
  resumeData,
  resumeName = '我的简历'
}: ExportResumeModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [previewData, setPreviewData] = useState<ResumeData>(resumeData);

  useEffect(() => {
    setPreviewData(resumeData);
  }, [resumeData]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${resumeName}.pdf`,
    onAfterPrint: () => {
      console.log('PDF exported successfully');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">导出简历 PDF</h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              预览并导出 {resumeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]"
          >
            ✕
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6 bg-[var(--muted)]">
          {/* 预览容器 */}
          <div className="flex justify-center">
            <div className="transform scale-50 origin-top">
              <PrintableResume ref={printRef} data={previewData} />
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="text-sm text-[var(--foreground-muted)]">
            💡 提示：导出的 PDF 为 A4 纸张大小，适合直接投递
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted-dark)] transition-smooth"
            >
              取消
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition-smooth flex items-center gap-2"
            >
              <span>📥</span>
              导出 PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
