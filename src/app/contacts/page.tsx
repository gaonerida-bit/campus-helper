'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface Contact {
  id: number;
  name: string;
  relation: '学长学姐' | '校友' | '同学' | '猎头' | 'HR' | '其他';
  company: string;
  position: string;
  canRefer: boolean;
  referCompanies?: string[];
  lastContact?: string;
  contactInfo: {
    wechat?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: '张学长',
    relation: '学长学姐',
    company: '字节跳动',
    position: '前端开发',
    canRefer: true,
    referCompanies: ['字节跳动'],
    lastContact: '3天前',
    contactInfo: { wechat: 'zhang学长', phone: '138****8888' },
    notes: '秋招内推人，已帮忙投递前端岗位',
  },
  {
    id: 2,
    name: '李学姐',
    relation: '学长学姐',
    company: '腾讯',
    position: '产品经理',
    canRefer: true,
    referCompanies: ['腾讯', '阿里'],
    lastContact: '1周前',
    contactInfo: { wechat: '李学姐2024' },
    notes: '师姐，22届毕业生',
  },
  {
    id: 3,
    name: '王同学',
    relation: '同学',
    company: '-',
    position: '-',
    canRefer: false,
    lastContact: '昨天',
    contactInfo: { wechat: '同学王' },
    notes: '一起准备秋招的战友',
  },
  {
    id: 4,
    name: '陈HR',
    relation: 'HR',
    company: '美团',
    position: '校招HR',
    canRefer: true,
    referCompanies: ['美团'],
    lastContact: '5天前',
    contactInfo: { email: 'chenhr@meituan.com' },
    notes: '美团校招负责人',
  },
  {
    id: 5,
    name: '刘猎头',
    relation: '猎头',
    company: '猎聘',
    position: '技术猎头',
    canRefer: true,
    lastContact: '2周前',
    contactInfo: { phone: '139****6666', email: 'liulie@liepin.com' },
    notes: '专注互联网技术岗位',
  },
];

const relationConfig = {
  '学长学姐': { icon: '👨‍🎓', color: 'bg-[var(--primary)]' },
  '校友': { icon: '🎓', color: 'bg-[var(--accent)]' },
  '同学': { icon: '👥', color: 'bg-[var(--secondary)]' },
  '猎头': { icon: '💼', color: 'bg-[var(--warning)]' },
  'HR': { icon: '🏢', color: 'bg-[var(--info)]' },
  '其他': { icon: '👤', color: 'bg-[var(--muted-dark)]' },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCanReferOnly, setShowCanReferOnly] = useState(false);

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === 'all' || contact.relation === filter;
    const matchesSearch =
      contact.name.includes(searchQuery) ||
      contact.company.includes(searchQuery) ||
      contact.notes?.includes(searchQuery);
    const matchesCanRefer = !showCanReferOnly || contact.canRefer;
    return matchesFilter && matchesSearch && matchesCanRefer;
  });

  const relations = ['all', ...Array.from(new Set(contacts.map((c) => c.relation)))];
  const canReferCount = contacts.filter((c) => c.canRefer).length;

  return (
    <AppLayout>
      <Header
        title="联系人管理"
        subtitle={`共 ${contacts.length} 位联系人 · ${canReferCount} 位可内推`}
        actions={<Button>＋ 添加联系人</Button>}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧列表 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 筛选栏 */}
            <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                {/* 搜索 */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="搜索联系人..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* 关系筛选 */}
                <div className="flex gap-2 flex-wrap">
                  {relations.map((rel) => (
                    <button
                      key={rel}
                      onClick={() => setFilter(rel)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                        filter === rel
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--muted)] text-[var(--foreground-light)] hover:bg-[var(--muted-dark)]'
                      }`}
                    >
                      {rel === 'all' ? '全部' : rel}
                    </button>
                  ))}
                </div>

                {/* 可内推筛选 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCanReferOnly}
                    onChange={(e) => setShowCanReferOnly(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--foreground-light)]">只看可内推</span>
                </label>
              </div>
            </div>

            {/* 联系人列表 */}
            <div className="space-y-3">
              {filteredContacts.map((contact) => {
                const config = relationConfig[contact.relation];
                return (
                  <div
                    key={contact.id}
                    className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-smooth cursor-pointer border border-[var(--border)]"
                  >
                    <div className="flex items-start gap-4">
                      {/* 头像 */}
                      <div
                        className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-xl text-white font-medium`}
                      >
                        {contact.name.charAt(0)}
                      </div>

                      {/* 信息 */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-[var(--foreground)]">
                              {contact.name}
                              {contact.canRefer && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)]">
                                  可内推
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-[var(--foreground-light)]">
                              {contact.position} @ {contact.company}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-lg ${config.color} text-white`}
                          >
                            {config.icon} {contact.relation}
                          </span>
                        </div>

                        {/* 联系方式 */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {contact.contactInfo.wechat && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)]">
                              💬 {contact.contactInfo.wechat}
                            </span>
                          )}
                          {contact.contactInfo.phone && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)]">
                              📱 {contact.contactInfo.phone}
                            </span>
                          )}
                          {contact.contactInfo.email && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)]">
                              ✉️ {contact.contactInfo.email}
                            </span>
                          )}
                        </div>

                        {/* 可内推公司 */}
                        {contact.referCompanies && contact.referCompanies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="text-xs text-[var(--foreground-muted)]">
                              可内推：
                            </span>
                            {contact.referCompanies.map((company) => (
                              <span
                                key={company}
                                className="text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 备注 */}
                        {contact.notes && (
                          <p className="text-sm text-[var(--foreground-muted)] bg-[var(--muted)] rounded-lg px-3 py-2">
                            💡 {contact.notes}
                          </p>
                        )}

                        {/* 底部操作 */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                          <span className="text-xs text-[var(--foreground-muted)]">
                            最后联系：{contact.lastContact}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              ✏️ 编辑
                            </Button>
                            <Button variant="ghost" size="sm">
                              💬 联系
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧统计 */}
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                📊 联系人统计
              </h3>
              <div className="space-y-4">
                {Object.entries(relationConfig).map(([relation, config]) => {
                  const count = contacts.filter((c) => c.relation === relation).length;
                  if (count === 0) return null;
                  return (
                    <div key={relation} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center text-white text-sm`}>
                          {config.icon}
                        </span>
                        <span className="text-sm text-[var(--foreground-light)]">
                          {relation}
                        </span>
                      </div>
                      <span className="font-semibold text-[var(--foreground)]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 久未联系提醒 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                ⏰ 久未联系
              </h3>
              <div className="space-y-3">
                {contacts
                  .filter((c) => {
                    const days = parseInt(c.lastContact?.replace(/[^0-9]/g, '') || '0');
                    return days >= 7;
                  })
                  .slice(0, 3)
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20"
                    >
                      <p className="font-medium text-[var(--foreground)]">
                        {contact.name}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {contact.lastContact}未联系
                      </p>
                    </div>
                  ))}
                {contacts.filter((c) => parseInt(c.lastContact?.replace(/[^0-9]/g, '') || '0') >= 7).length === 0 && (
                  <p className="text-sm text-[var(--foreground-muted)] text-center py-4">
                    🎉 所有联系人都在保持联系！
                  </p>
                )}
              </div>
            </div>

            {/* 快速添加 */}
            <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] rounded-2xl p-6 shadow-md text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-3">
                🤝
              </div>
              <h3 className="font-semibold mb-2">内推资源很重要</h3>
              <p className="text-white/80 text-sm mb-4">
                记得主动联系学长学姐，维护人脉关系
              </p>
              <Button className="w-full bg-white text-[var(--primary)] hover:bg-white/90">
                ＋ 添加新联系人
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
