'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface Resume {
  id: number;
  name: string;
  version: string;
  lastUsed: string;
  isDefault: boolean;
  tags: string[];
  forCompany?: string;
}

interface ResumeMaterial {
  id: string;
  section: 'education' | 'experience' | 'project' | 'skill' | 'honor';
  title: string;
  content: string;
  isHighlight: boolean;
}

const resumes: Resume[] = [
  { id: 1, name: '通用前端简历', version: 'v3.2', lastUsed: '今天', isDefault: true, tags: ['前端', 'React', 'TypeScript'] },
  { id: 2, name: '字节跳动专用', version: 'v1.0', lastUsed: '昨天', isDefault: false, tags: ['大厂', '前端'], forCompany: '字节跳动' },
  { id: 3, name: '大厂专用版', version: 'v2.1', lastUsed: '3天前', isDefault: false, tags: ['大厂', '全栈'] },
  { id: 4, name: '国企/外企版', version: 'v1.5', lastUsed: '1周前', isDefault: false, tags: ['国企', '外企'] },
];

const materials: ResumeMaterial[] = [
  { id: '1', section: 'education', title: '北京大学', content: '计算机科学与技术 · 本科 · 2019-2023 · GPA 3.8/4.0', isHighlight: true },
  { id: '2', section: 'experience', title: '字节跳动实习', content: '前端开发实习生 · 2023.06-2023.09\n• 参与公司内部管理系统开发\n• 使用 React + TypeScript 开发核心模块', isHighlight: true },
  { id: '3', section: 'project', title: '校园博客系统', content: '个人项目 · 2023.01-2023.03\n• 使用 Next.js + MySQL 开发\n• 日活 1000+，部署在 Vercel', isHighlight: false },
  { id: '4', section: 'skill', title: '专业技能', content: 'React/Vue · TypeScript · Node.js · MySQL · Git · Docker', isHighlight: true },
  { id: '5', section: 'honor', title: '荣誉奖项', content: '校级一等奖学金 · 2021-2022\n优秀学生干部 · 2022', isHighlight: false },
];

const sectionConfig = {
  education: { icon: '🎓', label: '教育经历', color: 'bg-[var(--primary)]' },
  experience: { icon: '💼', label: '实习经历', color: 'bg-[var(--warning)]' },
  project: { icon: '🚀', label: '项目经历', color: 'bg-[var(--info)]' },
  skill: { icon: '🛠️', label: '专业技能', color: 'bg-[var(--accent)]' },
  honor: { icon: '🏆', label: '荣誉奖项', color: 'bg-[var(--success)]' },
};

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<'resumes' | 'materials'>('resumes');
  const [filterSection, setFilterSection] = useState<string>('all');

  const filteredMaterials = filterSection === 'all'
    ? materials
    : materials.filter(m => m.section === filterSection);

  return (
    <AppLayout>
      <Header
        title="简历库"
        subtitle="管理多版本简历与素材库"
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'resumes'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📄 简历版本
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'materials'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📚 素材库
              </button>
            </div>
            <Button>＋ {activeTab === 'resumes' ? '上传简历' : '添加素材'}</Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            {/* 简历列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 添加新简历卡片 */}
              <div className="bg-[var(--surface)] rounded-2xl p-8 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]">
                <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-3xl mb-4">
                  ➕
                </div>
                <p className="text-[var(--foreground-light)] font-medium">
                  上传新简历
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  支持 PDF、Word 格式
                </p>
              </div>

              {/* 简历卡片 */}
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-smooth border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {resume.isDefault && (
                        <span className="px-2 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
                          默认
                        </span>
                      )}
                      {resume.forCompany && (
                        <span className="px-2 py-1 rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                          投递: {resume.forCompany}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    {resume.name}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-3">
                    {resume.version} · 上次使用 {resume.lastUsed}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resume.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg bg-[var(--muted)] text-xs text-[var(--foreground-light)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                    <Button variant="secondary" size="sm" className="flex-1">
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" title="导出PDF">
                      📥
                    </Button>
                    <Button variant="ghost" size="sm" title="删除">
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI 优化入口 */}
            <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
                  🤖
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI 简历优化</h3>
                  <p className="text-white/80 text-sm">
                    让 AI 帮你分析简历问题，针对不同岗位自动优化
                  </p>
                </div>
                <Button className="bg-white text-[var(--primary)] hover:bg-white/90">
                  立即优化
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* 素材筛选 */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterSection('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                  filterSection === 'all'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)]'
                }`}
              >
                全部
              </button>
              {Object.entries(sectionConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFilterSection(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth flex items-center gap-2 ${
                    filterSection === key
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {config.icon} {config.label}
                </button>
              ))}
            </div>

            {/* 素材列表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMaterials.map((material) => {
                const config = sectionConfig[material.section];
                return (
                  <div
                    key={material.id}
                    className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-lg text-white`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-[var(--foreground)]">
                              {material.title}
                            </h4>
                            <span className="text-xs text-[var(--foreground-muted)]">
                              {config.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {material.isHighlight && (
                              <span className="px-2 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                                ⭐ 重点项目
                              </span>
                            )}
                            <Button variant="ghost" size="sm">✏️</Button>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--foreground-light)] whitespace-pre-line">
                          {material.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 添加素材卡片 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer flex flex-col items-center justify-center min-h-[150px]">
                <span className="text-3xl mb-2">➕</span>
                <p className="text-[var(--foreground-light)]">添加新素材</p>
              </div>
            </div>

            {/* 素材统计 */}
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)]">
                📊 素材统计：{materials.length} 条素材 · {materials.filter(m => m.isHighlight).length} 个重点项目
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
