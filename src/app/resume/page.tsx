'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import ExportResumeModal from '@/components/Resume/ExportResumeModal';
import { ResumeData } from '@/components/Resume/PrintableResume';
import { useUserProfile } from '@/context/DataContext';

// 简历版本接口
interface Resume {
  id: number;
  name: string;
  version: string;
  lastUsed: string;
  isDefault: boolean;
  tags: string[];
  forCompany?: string;
}

// 素材库数据接口
interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
  courses: string;
  isHighlight: boolean;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  content: string;
  achievements: string;
  isHighlight: boolean;
}

interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack: string;
  achievements: string;
  isHighlight: boolean;
}

interface Skill {
  id: string;
  name: string;
  proficiency: '精通' | '熟练' | '了解';
  category: string;
  isHighlight: boolean;
}

interface Honor {
  id: string;
  name: string;
  level: string;
  date: string;
  description: string;
  isHighlight: boolean;
}

interface SelfEvaluation {
  id: string;
  content: string;
  updatedAt: string;
}


type MaterialSection = 'education' | 'experience' | 'project' | 'skill' | 'honor' | 'selfEvaluation';

const sectionConfig = {
  education: { icon: '🎓', label: '教育经历', color: 'bg-[var(--primary)]' },
  experience: { icon: '💼', label: '实习经历', color: 'bg-[var(--warning)]' },
  project: { icon: '🚀', label: '项目经历', color: 'bg-[var(--info)]' },
  skill: { icon: '🛠️', label: '专业技能', color: 'bg-[var(--accent)]' },
  honor: { icon: '🏆', label: '荣誉奖项', color: 'bg-[var(--success)]' },
  selfEvaluation: { icon: '✨', label: '自我评价', color: 'bg-[var(--primary)]' },
};

// 表单模态框组件
function FormModal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]">
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// 教育经历表单
function EducationForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Education>;
  onChange: (data: Partial<Education>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">学校名称 *</label>
          <input
            type="text"
            value={data.school || ''}
            onChange={(e) => onChange({ ...data, school: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：北京大学"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">专业 *</label>
          <input
            type="text"
            value={data.major || ''}
            onChange={(e) => onChange({ ...data, major: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：计算机科学与技术"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">学历</label>
          <select
            value={data.degree || ''}
            onChange={(e) => onChange({ ...data, degree: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">请选择</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
            <option value="交换生">交换生</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">GPA</label>
          <input
            type="text"
            value={data.gpa || ''}
            onChange={(e) => onChange({ ...data, gpa: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：3.8/4.0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">开始时间 *</label>
          <input
            type="month"
            value={data.startDate || ''}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">结束时间 *</label>
          <input
            type="month"
            value={data.endDate || ''}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">主修课程</label>
        <textarea
          value={data.courses || ''}
          onChange={(e) => onChange({ ...data, courses: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
          placeholder="如：数据结构、算法、操作系统、计算机网络"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="eduHighlight"
          checked={data.isHighlight || false}
          onChange={(e) => onChange({ ...data, isHighlight: e.target.checked })}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <label htmlFor="eduHighlight" className="text-sm text-[var(--foreground-light)]">
          ⭐ 标记为重点内容（会优先展示在简历中）
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 实习经历表单
function ExperienceForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Experience>;
  onChange: (data: Partial<Experience>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">公司名称 *</label>
          <input
            type="text"
            value={data.company || ''}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：字节跳动"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位 *</label>
          <input
            type="text"
            value={data.position || ''}
            onChange={(e) => onChange({ ...data, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：前端开发实习生"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">开始时间 *</label>
          <input
            type="month"
            value={data.startDate || ''}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">结束时间 *</label>
          <input
            type="month"
            value={data.endDate || ''}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">工作内容 *</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-32 resize-none"
          placeholder="描述你的工作内容和职责..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">主要成就</label>
        <input
          type="text"
          value={data.achievements || ''}
          onChange={(e) => onChange({ ...data, achievements: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="如：优化页面加载速度 40%"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="expHighlight"
          checked={data.isHighlight || false}
          onChange={(e) => onChange({ ...data, isHighlight: e.target.checked })}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <label htmlFor="expHighlight" className="text-sm text-[var(--foreground-light)]">
          ⭐ 标记为重点项目
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 项目经历表单
function ProjectForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Project>;
  onChange: (data: Partial<Project>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">项目名称 *</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：校园博客系统"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">担任角色</label>
          <input
            type="text"
            value={data.role || ''}
            onChange={(e) => onChange({ ...data, role: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：独立开发 / 核心开发"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">开始时间 *</label>
          <input
            type="month"
            value={data.startDate || ''}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">结束时间 *</label>
          <input
            type="month"
            value={data.endDate || ''}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">项目描述 *</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-28 resize-none"
          placeholder="描述项目背景、功能、技术方案..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">技术栈</label>
        <input
          type="text"
          value={data.techStack || ''}
          onChange={(e) => onChange({ ...data, techStack: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="如：React, Node.js, MongoDB"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">项目成果</label>
        <input
          type="text"
          value={data.achievements || ''}
          onChange={(e) => onChange({ ...data, achievements: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="如：日活 1000+，获校级创新大赛银奖"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="projHighlight"
          checked={data.isHighlight || false}
          onChange={(e) => onChange({ ...data, isHighlight: e.target.checked })}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <label htmlFor="projHighlight" className="text-sm text-[var(--foreground-light)]">
          ⭐ 标记为重点项目
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 技能表单
function SkillForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Skill>;
  onChange: (data: Partial<Skill>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">技能名称 *</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：React / TypeScript"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">熟练度</label>
          <select
            value={data.proficiency || '了解'}
            onChange={(e) => onChange({ ...data, proficiency: e.target.value as Skill['proficiency'] })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="精通">精通</option>
            <option value="熟练">熟练</option>
            <option value="了解">了解</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">分类</label>
        <select
          value={data.category || ''}
          onChange={(e) => onChange({ ...data, category: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="">请选择</option>
          <option value="前端框架">前端框架</option>
          <option value="编程语言">编程语言</option>
          <option value="后端">后端</option>
          <option value="数据库">数据库</option>
          <option value="工具">工具</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="skillHighlight"
          checked={data.isHighlight || false}
          onChange={(e) => onChange({ ...data, isHighlight: e.target.checked })}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <label htmlFor="skillHighlight" className="text-sm text-[var(--foreground-light)]">
          ⭐ 标记为核心技能
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 荣誉奖项表单
function HonorForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Honor>;
  onChange: (data: Partial<Honor>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">奖项名称 *</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：校级一等奖学金"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">获奖级别</label>
          <select
            value={data.level || ''}
            onChange={(e) => onChange({ ...data, level: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">请选择</option>
            <option value="校级">校级</option>
            <option value="院级">院级</option>
            <option value="省级">省级</option>
            <option value="国家级">国家级</option>
            <option value="国际级">国际级</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">获奖时间</label>
        <input
          type="month"
          value={data.date || ''}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">详细描述</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
          placeholder="描述获奖情况..."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="honorHighlight"
          checked={data.isHighlight || false}
          onChange={(e) => onChange({ ...data, isHighlight: e.target.checked })}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <label htmlFor="honorHighlight" className="text-sm text-[var(--foreground-light)]">
          ⭐ 标记为重点奖项
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 自我评价表单
function SelfEvaluationForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: SelfEvaluation;
  onChange: (data: SelfEvaluation) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">自我评价</label>
        <textarea
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-40 resize-none"
          placeholder="撰写一段自我评价，突出你的优势和特点..."
        />
      </div>
      <div className="bg-[var(--muted)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <span className="font-medium text-[var(--foreground)]">AI 优化</span>
        </div>
        <p className="text-sm text-[var(--foreground-muted)]">
          点击「AI 优化」按钮，让 AI 帮你润色这段自我评价
        </p>
        <Button variant="secondary" size="sm" className="mt-2">
          ✨ AI 优化
        </Button>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const { userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'resumes' | 'materials'>('resumes');
  const [filterSection, setFilterSection] = useState<string>('all');

  // 简历版本列表（本地状态，暂未持久化）
  const [resumes, setResumes] = useState<Resume[]>([]);

  // 素材库数据状态
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [selfEvaluation, setSelfEvaluation] = useState<SelfEvaluation>({ id: '1', content: '', updatedAt: '' });

  // 表单状态
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<MaterialSection | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // 导出模态框状态
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportingResume, setExportingResume] = useState<Resume | null>(null);

  // 生成导出数据
  const generateExportData = (): ResumeData => {
    return {
      name: userProfile.name || '',
      contact: {
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        location: userProfile.targetLocations?.[0] || '',
      },
      education: education.map(e => ({
        school: e.school,
        major: e.major,
        degree: e.degree,
        startDate: e.startDate,
        endDate: e.endDate,
        gpa: e.gpa,
        courses: e.courses,
      })),
      experience: experience.map(e => ({
        company: e.company,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        content: e.content,
        achievements: e.achievements,
      })),
      projects: projects.map(p => ({
        name: p.name,
        role: p.role,
        startDate: p.startDate,
        endDate: p.endDate,
        description: p.description,
        techStack: p.techStack,
        achievements: p.achievements,
      })),
      skills: skills.map(s => ({
        name: s.name,
        proficiency: s.proficiency,
      })),
      honors: honors.map(h => ({
        name: h.name,
        level: h.level,
        date: h.date,
        description: h.description,
      })),
      selfEvaluation: selfEvaluation.content,
    };
  };

  const handleExportPDF = (resume: Resume) => {
    setExportingResume(resume);
    setIsExportOpen(true);
  };

  // 统计各分类数量
  const stats = {
    education: education.length,
    experience: experience.length,
    project: projects.length,
    skill: skills.length,
    honor: honors.length,
    selfEvaluation: 1,
  };

  const getFilteredItems = () => {
    if (filterSection === 'all') {
      return [];
    }

    switch (filterSection) {
      case 'education':
        return education.map(e => ({
          id: e.id,
          type: 'education' as MaterialSection,
          title: e.school,
          subtitle: `${e.major} · ${e.degree}`,
          detail: `${e.startDate} - ${e.endDate}`,
          extra: e.gpa ? `GPA: ${e.gpa}` : '',
          isHighlight: e.isHighlight,
        }));
      case 'experience':
        return experience.map(e => ({
          id: e.id,
          type: 'experience' as MaterialSection,
          title: e.company,
          subtitle: e.position,
          detail: `${e.startDate} - ${e.endDate}`,
          extra: e.achievements,
          isHighlight: e.isHighlight,
        }));
      case 'project':
        return projects.map(p => ({
          id: p.id,
          type: 'project' as MaterialSection,
          title: p.name,
          subtitle: p.role,
          detail: `${p.startDate} - ${p.endDate}`,
          extra: p.techStack,
          isHighlight: p.isHighlight,
        }));
      case 'skill':
        return skills.map(s => ({
          id: s.id,
          type: 'skill' as MaterialSection,
          title: s.name,
          subtitle: s.category,
          detail: s.proficiency,
          extra: '',
          isHighlight: s.isHighlight,
        }));
      case 'honor':
        return honors.map(h => ({
          id: h.id,
          type: 'honor' as MaterialSection,
          title: h.name,
          subtitle: h.level,
          detail: h.date,
          extra: h.description,
          isHighlight: h.isHighlight,
        }));
      case 'selfEvaluation':
        return [{
          id: selfEvaluation.id,
          type: 'selfEvaluation' as MaterialSection,
          title: '自我评价',
          subtitle: selfEvaluation.content.substring(0, 50) + '...',
          detail: `更新于 ${selfEvaluation.updatedAt}`,
          extra: '',
          isHighlight: false,
        }];
      default:
        return [];
    }
  };

  const filteredItems = getFilteredItems();

  const openAddForm = (type: MaterialSection) => {
    setFormType(type);
    setEditingId(null);
    setFormData(getEmptyFormData(type));
    setIsFormOpen(true);
  };

  const openEditForm = (type: MaterialSection, id: string) => {
    setFormType(type);
    setEditingId(id);
    setIsFormOpen(true);

    switch (type) {
      case 'education':
        setFormData(education.find(e => e.id === id) || {});
        break;
      case 'experience':
        setFormData(experience.find(e => e.id === id) || {});
        break;
      case 'project':
        setFormData(projects.find(p => p.id === id) || {});
        break;
      case 'skill':
        setFormData(skills.find(s => s.id === id) || {});
        break;
      case 'honor':
        setFormData(honors.find(h => h.id === id) || {});
        break;
      case 'selfEvaluation':
        setFormData(selfEvaluation);
        break;
    }
  };

  const getEmptyFormData = (type: MaterialSection) => {
    switch (type) {
      case 'education':
        return { school: '', major: '', degree: '', startDate: '', endDate: '', gpa: '', courses: '', isHighlight: false };
      case 'experience':
        return { company: '', position: '', startDate: '', endDate: '', content: '', achievements: '', isHighlight: false };
      case 'project':
        return { name: '', role: '', startDate: '', endDate: '', description: '', techStack: '', achievements: '', isHighlight: false };
      case 'skill':
        return { name: '', proficiency: '了解' as const, category: '', isHighlight: false };
      case 'honor':
        return { name: '', level: '', date: '', description: '', isHighlight: false };
      case 'selfEvaluation':
        return { content: '', updatedAt: new Date().toISOString().split('T')[0] };
      default:
        return {};
    }
  };

  const saveForm = () => {
    if (!formType) return;

    switch (formType) {
      case 'education':
        if (editingId) {
          setEducation(education.map(e => e.id === editingId ? { ...formData, id: editingId } as Education : e));
        } else {
          setEducation([...education, { ...formData, id: Date.now().toString() } as Education]);
        }
        break;
      case 'experience':
        if (editingId) {
          setExperience(experience.map(e => e.id === editingId ? { ...formData, id: editingId } as Experience : e));
        } else {
          setExperience([...experience, { ...formData, id: Date.now().toString() } as Experience]);
        }
        break;
      case 'project':
        if (editingId) {
          setProjects(projects.map(p => p.id === editingId ? { ...formData, id: editingId } as Project : p));
        } else {
          setProjects([...projects, { ...formData, id: Date.now().toString() } as Project]);
        }
        break;
      case 'skill':
        if (editingId) {
          setSkills(skills.map(s => s.id === editingId ? { ...formData, id: editingId } as Skill : s));
        } else {
          setSkills([...skills, { ...formData, id: Date.now().toString() } as Skill]);
        }
        break;
      case 'honor':
        if (editingId) {
          setHonors(honors.map(h => h.id === editingId ? { ...formData, id: editingId } as Honor : h));
        } else {
          setHonors([...honors, { ...formData, id: Date.now().toString() } as Honor]);
        }
        break;
      case 'selfEvaluation':
        setSelfEvaluation({ ...formData, updatedAt: new Date().toISOString().split('T')[0] });
        break;
    }

    setIsFormOpen(false);
    setFormType(null);
    setEditingId(null);
    setFormData({});
  };

  const deleteItem = (type: MaterialSection, id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    switch (type) {
      case 'education':
        setEducation(education.filter(e => e.id !== id));
        break;
      case 'experience':
        setExperience(experience.filter(e => e.id !== id));
        break;
      case 'project':
        setProjects(projects.filter(p => p.id !== id));
        break;
      case 'skill':
        setSkills(skills.filter(s => s.id !== id));
        break;
      case 'honor':
        setHonors(honors.filter(h => h.id !== id));
        break;
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setFormType(null);
    setEditingId(null);
    setFormData({});
  };

  const totalHighlights =
    education.filter(e => e.isHighlight).length +
    experience.filter(e => e.isHighlight).length +
    projects.filter(p => p.isHighlight).length +
    skills.filter(s => s.isHighlight).length +
    honors.filter(h => h.isHighlight).length;

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
            {activeTab === 'resumes' && (
              <Button>＋ 上传简历</Button>
            )}
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
                    <Button variant="ghost" size="sm" title="导出PDF" onClick={() => handleExportPDF(resume)}>
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
            {/* 素材分类入口 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(sectionConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => openAddForm(key as MaterialSection)}
                  className={`bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-smooth flex flex-col items-center gap-3 ${
                    filterSection === key ? 'ring-2 ring-[var(--primary)]' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-2xl text-white`}>
                    {config.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-[var(--foreground)]">{config.label}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{stats[key as keyof typeof stats] || 0} 条</p>
                  </div>
                </button>
              ))}
            </div>

            {/* 素材筛选 */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-[var(--foreground-muted)]">快速筛选：</span>
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
              {filterSection === 'all' ? (
                <>
                  {/* 全部视图 - 按分类分组展示 */}
                  {Object.entries(sectionConfig).map(([key, config]) => {
                    const items = key === 'education' ? education :
                                  key === 'experience' ? experience :
                                  key === 'project' ? projects :
                                  key === 'skill' ? skills :
                                  key === 'honor' ? honors :
                                  key === 'selfEvaluation' ? [selfEvaluation] : [];

                    if (!items.length) return null;

                    return (
                      <div key={key} className="space-y-3">
                        <h3 className="text-sm font-medium text-[var(--foreground-muted)] flex items-center gap-2">
                          <span>{config.icon}</span> {config.label}
                          <span className="ml-auto">{(items as any[]).length} 条</span>
                        </h3>
                        {(items as any[]).map((item: any) => {
                          const title = key === 'education' ? item.school :
                                        key === 'experience' ? item.company :
                                        key === 'project' ? item.name :
                                        key === 'skill' ? item.name :
                                        key === 'honor' ? item.name : '自我评价';
                          const subtitle = key === 'education' ? `${item.major} · ${item.degree}` :
                                           key === 'experience' ? item.position :
                                           key === 'project' ? item.role :
                                           key === 'skill' ? item.category :
                                           key === 'honor' ? item.level : item.content.substring(0, 50) + '...';
                          const detail = key === 'education' ? `${item.startDate} - ${item.endDate}` :
                                        key === 'experience' ? `${item.startDate} - ${item.endDate}` :
                                        key === 'project' ? `${item.startDate} - ${item.endDate}` :
                                        key === 'skill' ? item.proficiency :
                                        key === 'honor' ? item.date : `更新于 ${item.updatedAt}`;

                          return (
                            <div
                              key={item.id}
                              className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer"
                              onClick={() => openEditForm(key as MaterialSection, item.id)}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-lg text-white`}>
                                  {config.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <div>
                                      <h4 className="font-semibold text-[var(--foreground)]">
                                        {title}
                                      </h4>
                                      <span className="text-xs text-[var(--foreground-muted)]">
                                        {subtitle}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {item.isHighlight && (
                                        <span className="px-2 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                                          ⭐ 重点
                                        </span>
                                      )}
                                      {key !== 'selfEvaluation' && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); deleteItem(key as MaterialSection, item.id); }}
                                          className="p-1 rounded hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]"
                                        >
                                          🗑️
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-[var(--foreground-light)]">{detail}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {filteredItems.map((item) => {
                    const config = sectionConfig[item.type];
                    return (
                      <div
                        key={item.id}
                        className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer"
                        onClick={() => openEditForm(item.type, item.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-lg text-white`}>
                            {config.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h4 className="font-semibold text-[var(--foreground)]">
                                  {item.title}
                                </h4>
                                <span className="text-xs text-[var(--foreground-muted)]">
                                  {item.subtitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.isHighlight && (
                                  <span className="px-2 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                                    ⭐ 重点
                                  </span>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteItem(item.type, item.id); }}
                                  className="p-1 rounded hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-[var(--foreground-light)]">{item.detail}</p>
                            {item.extra && (
                              <p className="text-xs text-[var(--foreground-muted)] mt-1 truncate">
                                {item.extra}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 添加卡片 */}
                  <div
                    className="bg-[var(--surface)] rounded-2xl p-6 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer flex flex-col items-center justify-center min-h-[150px]"
                    onClick={() => openAddForm(filterSection as MaterialSection)}
                  >
                    <span className="text-3xl mb-2">➕</span>
                    <p className="text-[var(--foreground-light)]">添加{filterSection && sectionConfig[filterSection as keyof typeof sectionConfig]?.label || '素材'}</p>
                  </div>
                </>
              )}
            </div>

            {/* 素材统计 */}
            <div className="bg-[var(--muted)] rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm text-[var(--foreground-light)]">
                📊 素材统计：共 {education.length + experience.length + projects.length + skills.length + honors.length + 1} 条素材
              </p>
              <p className="text-sm text-[var(--warning)]">
                ⭐ {totalHighlights} 个重点项目
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 表单模态框 */}
      <FormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={
          editingId
            ? `编辑${formType && sectionConfig[formType]?.label || ''}`
            : `添加${formType && sectionConfig[formType]?.label || ''}`
        }
      >
        {formType === 'education' && (
          <EducationForm
            data={formData}
            onChange={setFormData}
            onSave={saveForm}
            onCancel={handleFormClose}
          />
        )}
        {formType === 'experience' && (
          <ExperienceForm
            data={formData}
            onChange={setFormData}
            onSave={saveForm}
            onCancel={handleFormClose}
          />
        )}
        {formType === 'project' && (
          <ProjectForm
            data={formData}
            onChange={setFormData}
            onSave={saveForm}
            onCancel={handleFormClose}
          />
        )}
        {formType === 'skill' && (
          <SkillForm
            data={formData}
            onChange={setFormData}
            onSave={saveForm}
            onCancel={handleFormClose}
          />
        )}
        {formType === 'honor' && (
          <HonorForm
            data={formData}
            onChange={setFormData}
            onSave={saveForm}
            onCancel={handleFormClose}
          />
        )}
        {formType === 'selfEvaluation' && (
          <SelfEvaluationForm
            data={formData}
            onChange={setFormData}
            onSave={saveForm}
            onCancel={handleFormClose}
          />
        )}
      </FormModal>

      {/* 导出 PDF 模态框 */}
      <ExportResumeModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        resumeData={generateExportData()}
        resumeName={exportingResume?.name || '我的简历'}
      />
    </AppLayout>
  );
}
