/**
 * Sample data for initial app state
 * This data is loaded on first visit to demonstrate app functionality
 */

import { Application, Interview, Contact, Exam, Question, CalendarEvent, Offer, Resume } from '@/context/DataContext';

export const sampleApplications: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    company: '字节跳动',
    position: '前端开发工程师',
    location: '北京',
    salary: '35-50k·16薪',
    stage: '二面',
    status: 'interviewing',
    appliedDate: '2026-05-15',
    notes: '技术栈匹配度较高，面试官反馈积极',
    url: 'https://jobs.bytedance.com',
    source: '官网投递',
  },
  {
    company: '腾讯',
    position: 'Web前端开发工程师',
    location: '深圳',
    salary: '30-45k·16薪',
    stage: '一面',
    status: 'interviewing',
    appliedDate: '2026-05-20',
    notes: 'PCG事业群，Web开发方向',
    url: 'https://careers.tencent.com',
    source: '官网投递',
  },
  {
    company: '阿里巴巴',
    position: '前端工程师',
    location: '杭州',
    salary: '32-48k·15薪',
    stage: '笔试',
    status: 'pending',
    appliedDate: '2026-05-22',
    notes: '淘天集团',
    url: 'https://talent.alibaba.com',
    source: '官网投递',
  },
  {
    company: '美团',
    position: '前端开发工程师',
    location: '北京',
    stage: '投递',
    status: 'pending',
    appliedDate: '2026-05-18',
    url: 'https://zhaopin.meituan.com',
    source: '官网投递',
  },
  {
    company: '京东',
    position: '前端开发',
    location: '北京',
    stage: 'offer',
    status: 'offer',
    appliedDate: '2026-04-25',
    salary: '28k·13薪',
    notes: '已发Offer，正在考虑',
  },
  {
    company: '百度',
    position: '前端研发工程师',
    location: '北京',
    stage: '拒绝',
    status: 'rejected',
    appliedDate: '2026-05-10',
    notes: '简历筛选未通过',
  },
];

export const sampleInterviews: Omit<Interview, 'id' | 'createdAt'>[] = [
  {
    applicationId: 'sample-1',
    company: '字节跳动',
    position: '前端开发工程师',
    type: '技术面',
    date: '2026-06-12',
    time: '14:00',
    onlineLink: 'https://meeting.bytedance.com/abc123',
    interviewer: '张老师',
    status: 'upcoming',
  },
  {
    applicationId: 'sample-2',
    company: '腾讯',
    position: 'Web前端开发工程师',
    type: '技术面',
    date: '2026-06-13',
    time: '10:00',
    onlineLink: 'https://meeting.qq.com/xyz789',
    interviewer: '李老师',
    status: 'upcoming',
  },
  {
    company: '字节跳动',
    position: '前端开发工程师',
    type: '技术面',
    date: '2026-05-28',
    time: '15:00',
    interviewer: '王老师',
    feedback: '整体表现良好，项目经验与岗位匹配度高',
    rating: 4,
    status: 'completed',
  },
];

export const sampleContacts: Omit<Contact, 'id' | 'createdAt'>[] = [
  {
    name: '张学长',
    company: '字节跳动',
    position: '前端开发',
    relationship: '内推人',
    wechat: 'zhang_ge',
    notes: '可内推字节、快手',
    lastContact: '2026-05-25',
  },
  {
    name: '王学姐',
    company: '腾讯',
    position: '产品经理',
    relationship: '校友',
    wechat: 'wang_jie',
    notes: '腾讯WXG，可帮忙看简历',
    lastContact: '2026-05-20',
  },
  {
    name: '李HR',
    company: '美团',
    position: 'HR',
    email: 'li.hr@meituan.com',
    relationship: 'HR',
    notes: '主动联系，已发Offer',
    lastContact: '2026-06-01',
  },
];

export const sampleExams: Omit<Exam, 'id' | 'createdAt'>[] = [
  {
    company: '阿里巴巴',
    position: '前端工程师',
    date: '2026-06-15',
    time: '14:00',
    type: 'OT',
    status: 'upcoming',
    duration: '120分钟',
    onlineLink: 'https://assessment.alibaba.com',
  },
];

export const sampleQuestions: Omit<Question, 'id' | 'createdAt'>[] = [
  {
    category: 'JavaScript',
    type: '选择',
    difficulty: 'medium',
    question: '以下哪个不是 JavaScript 的数据类型？',
    answer: 'array',
    explanation: 'JavaScript 有 6 种原始类型：string, number, boolean, null, undefined, symbol，和 1 种引用类型：object。array 是 object 的特殊形式。',
    tags: ['JavaScript', '数据类型'],
    source: '牛客网',
  },
  {
    category: 'React',
    type: '简答',
    difficulty: 'hard',
    question: '请解释 React 的虚拟 DOM 原理，以及它如何提高性能？',
    answer: '虚拟 DOM 是真实 DOM 的 JavaScript 对象表示...',
    explanation: '虚拟 DOM 通过比较新旧两个虚拟 DOM 树的差异（diff 算法），只将必要的最小更改应用到真实 DOM。',
    tags: ['React', '原理', '性能优化'],
    starred: true,
    source: '个人整理',
  },
];

export const sampleOffers: Omit<Offer, 'id' | 'createdAt'>[] = [
  {
    company: '京东',
    position: '前端开发工程师',
    salary: {
      base: 28,
      bonus: 4,
      total: 44,
    },
    location: '北京',
    level: 'P5',
    startDate: '2026-07-15',
    benefits: ['六险一金', '餐补', '交通补', '免费健身房'],
    pros: ['平台大，稳定', '技术团队成熟', '福利好'],
    cons: ['加班较多', '位置较偏'],
    recommendation: 'negotiate',
    notes: '正在考虑，等待其他结果',
  },
];

export const sampleResumes: Omit<Resume, 'id' | 'createdAt' | 'updatedAt' | 'version'>[] = [
  {
    title: '通用前端简历',
    content: JSON.stringify({
      basics: {
        name: 'Nerida',
        title: '前端开发工程师',
        email: 'nerida@example.com',
        phone: '138****8888',
      },
      education: {
        school: '某985大学',
        major: '计算机科学与技术',
        degree: '本科',
        duration: '2022-2026',
        gpa: '3.8/5.0',
      },
      experience: [
        {
          company: 'XX科技公司',
          position: '前端开发实习生',
          duration: '2024.06-2024.09',
          highlights: [
            '负责公司官网前端开发，使用 React + TypeScript',
            '优化页面加载性能，提升 40% 加载速度',
          ],
        },
      ],
      projects: [
        {
          name: '校园二手交易平台',
          role: '前端负责人',
          tech: 'Vue3 + Vite + Pinia',
          highlights: [
            '独立完成前端架构设计与实现',
            '实现实时聊天功能，使用 WebSocket',
          ],
        },
      ],
      skills: ['React', 'Vue', 'TypeScript', 'Node.js', 'Git'],
    }),
    isDefault: true,
  },
];

export const sampleEvents: Omit<CalendarEvent, 'id' | 'createdAt'>[] = [
  {
    date: '2026-06-12',
    title: '字节跳动二面',
    type: 'interview',
    company: '字节跳动',
    description: '技术面试',
    reminder: true,
  },
  {
    date: '2026-06-13',
    title: '腾讯一面',
    type: 'interview',
    company: '腾讯',
    description: '技术面试',
    reminder: true,
  },
  {
    date: '2026-06-15',
    title: '阿里巴巴笔试',
    type: 'test',
    company: '阿里巴巴',
    description: '在线笔试',
    reminder: true,
  },
  {
    date: '2026-09-01',
    title: '秋招正式批开始',
    type: 'milestone',
    description: '2026秋招正式批开放',
  },
];

// Check if data has been initialized
export function isDataInitialized(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('campus-helper-data') !== null ||
         localStorage.getItem('campus-helper-initialized') === 'true';
}

export function markDataAsInitialized(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('campus-helper-initialized', 'true');
  }
}
