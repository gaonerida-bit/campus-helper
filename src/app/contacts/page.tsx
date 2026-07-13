'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useContacts, useCompanyProfiles, Contact as AppContact, CompanyProfile } from '@/context/DataContext';

const relationConfig: Record<string, { icon: string; color: string }> = {
  '校友': { icon: '👨‍🎓', color: 'bg-[var(--primary)]' },
  '内推人': { icon: '🤝', color: 'bg-[var(--accent)]' },
  'HR': { icon: '💼', color: 'bg-[var(--info)]' },
  '面试官': { icon: '👔', color: 'bg-[var(--warning)]' },
  '同学': { icon: '👥', color: 'bg-[var(--secondary)]' },
  '其他': { icon: '👤', color: 'bg-[var(--muted-dark)]' },
};

const companyProfiles: Record<string, CompanyProfile> = {
  '字节跳动': {
    id: 'bytedance',
    name: '字节跳动',
    industry: '互联网/科技',
    size: '10000+人',
    description: '全球领先的互联网科技公司，旗下产品包括抖音、TikTok、今日头条等',
    culture: '年轻活力、扁平管理、追求极致、坦诚清晰',
    benefits: ['六险一金全额', '免费三餐/下午茶', '租房补贴', '弹性工作', '股票期权'],
    createdAt: new Date().toISOString(),
  },
  '腾讯': {
    id: 'tencent',
    name: '腾讯',
    industry: '互联网/科技',
    size: '100000+人',
    description: '中国最大的互联网综合服务提供商之一，社交、游戏、金融科技等领域龙头',
    culture: '瑞雪精神、用户为本、科技向善',
    benefits: ['五险一金', '免费早餐', '年终奖金', '带薪年假', '员工关怀'],
    createdAt: new Date().toISOString(),
  },
  '美团': {
    id: 'meituan',
    name: '美团',
    industry: '本地生活',
    size: '100000+人',
    description: '中国领先的生活服务电商平台，覆盖外卖、酒旅、出行等多个领域',
    culture: '以客户为中心、长期有耐心、追求卓越',
    benefits: ['五险一金', '餐补', '交通补贴', '定期体检', '团建费'],
    createdAt: new Date().toISOString(),
  },
  '阿里巴巴': {
    id: 'alibaba',
    name: '阿里巴巴',
    industry: '互联网/电商',
    size: '200000+人',
    description: '全球领先的电子商务企业，涵盖淘宝、天猫、阿里云等业务',
    culture: '客户第一、团队合作、拥抱变化、诚信、激情、敬业',
    benefits: ['六险一金', '股票期权', '带薪年假', '员工购房贷款', '免费健身房'],
    createdAt: new Date().toISOString(),
  },
};

// 添加/编辑联系人表单
function ContactForm({
  contact,
  onSave,
  onCancel
}: {
  contact?: AppContact;
  onSave: (data: Omit<AppContact, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    company: contact?.company || '',
    position: contact?.position || '',
    relationship: contact?.relationship || '其他',
    email: contact?.email || '',
    phone: contact?.phone || '',
    wechat: contact?.wechat || '',
    linkedin: contact?.linkedin || '',
    notes: contact?.notes || '',
    tags: contact?.tags || [],
  });

  const handleSubmit = () => {
    if (!formData.name) {
      alert('请输入联系人姓名');
      return;
    }
    onSave({
      name: formData.name,
      company: formData.company,
      position: formData.position,
      relationship: formData.relationship as AppContact['relationship'],
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      wechat: formData.wechat || undefined,
      linkedin: formData.linkedin || undefined,
      notes: formData.notes || undefined,
      tags: formData.tags,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">姓名 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="输入姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">关系</label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value as AppContact['relationship'] })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="校友">校友</option>
            <option value="内推人">内推人</option>
            <option value="HR">HR</option>
            <option value="面试官">面试官</option>
            <option value="同学">同学</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">公司</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="公司名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="职位名称"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">联系方式</label>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={formData.wechat}
            onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="💬 微信"
          />
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="📱 电话"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="✉️ 邮箱"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">备注</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-20 resize-none"
          placeholder="添加备注信息..."
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 联系人详情模态框
function ContactDetailModal({
  contact,
  onClose,
  onEdit,
  onViewCompany,
  onDelete
}: {
  contact: AppContact;
  onClose: () => void;
  onEdit: () => void;
  onViewCompany: (company: string) => void;
  onDelete: () => void;
}) {
  const config = relationConfig[contact.relationship] || relationConfig['其他'];
  const hasCompanyProfile = companyProfiles[contact.company];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className={`h-24 ${config.color} relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-smooth"
          >
            ✕
          </button>
        </div>
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <div className={`w-20 h-20 rounded-2xl ${config.color} flex items-center justify-center text-3xl text-white font-bold shadow-lg`}>
              {contact.name.charAt(0)}
            </div>
            <div className="flex-1 mb-2">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">{contact.name}</h2>
              <p className="text-[var(--foreground-light)]">
                {contact.position} @ {contact.company}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-lg text-sm ${config.color} text-white`}>
              {config.icon} {contact.relationship}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[var(--foreground-light)] mb-2">联系方式</h4>
              <div className="space-y-2">
                {contact.wechat && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]">
                    <span>💬</span>
                    <span className="text-[var(--foreground)]">{contact.wechat}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]">
                    <span>📱</span>
                    <span className="text-[var(--foreground)]">{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]">
                    <span>✉️</span>
                    <span className="text-[var(--foreground)]">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>

            {contact.notes && (
              <div>
                <h4 className="text-sm font-medium text-[var(--foreground-light)] mb-2">备注</h4>
                <p className="text-[var(--foreground)] bg-[var(--muted)] rounded-xl p-3">
                  {contact.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={onEdit} className="flex-1">编辑</Button>
              <Button variant="danger" onClick={onDelete} className="flex-1">🗑️ 删除</Button>
              {hasCompanyProfile && (
                <Button onClick={() => onViewCompany(contact.company)} className="flex-1">
                  🏢 查看公司
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 公司详情模态框
function CompanyProfileModal({
  company,
  onClose
}: {
  company: string;
  onClose: () => void;
}) {
  const profile = companyProfiles[company];

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🏢</div>
            <p className="text-[var(--foreground-light)]">暂无该公司的详细信息</p>
          </div>
          <Button onClick={onClose} className="w-full">关闭</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">{profile.name}</h2>
              <p className="text-[var(--foreground-light)]">{profile.industry} · {profile.size}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-2">📝 公司简介</h3>
            <p className="text-[var(--foreground-light)]">{profile.description}</p>
          </div>

          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-2">🎯 企业文化</h3>
            <p className="text-[var(--foreground-light)]">{profile.culture}</p>
          </div>

          {profile.benefits && profile.benefits.length > 0 && (
            <div>
              <h3 className="font-medium text-[var(--foreground)] mb-2">✨ 福利待遇</h3>
              <div className="flex flex-wrap gap-2">
                {profile.benefits.map((benefit, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-[var(--muted)] text-sm text-[var(--foreground-light)]">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-[var(--border)]">
          <Button onClick={onClose} className="w-full">关闭</Button>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const { contacts, add, update, remove } = useContacts();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { companyProfiles: storedProfiles } = useCompanyProfiles();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<AppContact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<AppContact | undefined>();

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === 'all' || contact.relationship === filter;
    const matchesSearch =
      contact.name.includes(searchQuery) ||
      contact.company.includes(searchQuery) ||
      contact.notes?.includes(searchQuery) ||
      contact.tags?.some(tag => tag.includes(searchQuery));
    return matchesFilter && matchesSearch;
  });

  const uniqueRelations = ['all', ...Array.from(new Set(contacts.map((c) => c.relationship)))];
  const allCompanyProfiles = { ...companyProfiles, ...Object.fromEntries(storedProfiles.map(p => [p.name, p])) };

  const handleSaveContact = (data: Omit<AppContact, 'id' | 'createdAt'>) => {
    if (editingContact) {
      update(editingContact.id, data);
    } else {
      add(data);
    }
    setIsFormOpen(false);
    setEditingContact(undefined);
  };

  const handleEditContact = (contact: AppContact) => {
    setSelectedContact(null);
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleViewCompany = (company: string) => {
    setSelectedContact(null);
    setSelectedCompany(company);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('确定要删除这个联系人吗？')) {
      remove(id);
      setSelectedContact(null);
      setDeleteConfirmId(null);
    }
  };

  return (
    <AppLayout>
      <Header
        title="联系人管理"
        subtitle={`共 ${contacts.length} 位联系人`}
        actions={<Button onClick={() => setIsFormOpen(true)}>＋ 添加联系人</Button>}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧列表 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 筛选栏 */}
            <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="搜索联系人、公司、标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {uniqueRelations.map((rel) => (
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
              </div>
            </div>

            {/* 联系人列表 */}
            <div className="space-y-3">
              {filteredContacts.length === 0 && contacts.length === 0 ? (
                <div className="text-center py-16 bg-[var(--surface)] rounded-2xl">
                  <div className="text-6xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">还没有联系人</h3>
                  <p className="text-[var(--foreground-muted)] mb-6">添加你的校友、HR、内推人等联系人</p>
                  <Button onClick={() => setIsFormOpen(true)}>＋ 添加第一个联系人</Button>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[var(--foreground-muted)]">没有符合条件的联系人</p>
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const config = relationConfig[contact.relationship] || relationConfig['其他'];
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-smooth cursor-pointer border border-[var(--border)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-xl text-white font-medium`}>
                          {contact.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-[var(--foreground)]">{contact.name}</h3>
                              <p className="text-sm text-[var(--foreground-light)]">
                                {contact.position} @ {contact.company}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-lg ${config.color} text-white`}>
                              {config.icon} {contact.relationship}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {contact.wechat && (
                              <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)]">
                                💬 {contact.wechat}
                              </span>
                            )}
                            {contact.phone && (
                              <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)]">
                                📱 {contact.phone}
                              </span>
                            )}
                            {contact.email && (
                              <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)]">
                                ✉️ {contact.email}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                            {contact.lastContact && (
                              <span className="text-xs text-[var(--foreground-muted)]">
                                最后联系：{contact.lastContact}
                              </span>
                            )}
                            <div className="flex gap-2 ml-auto">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleEditContact(contact); }}
                              >
                                ✏️ 编辑
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 右侧统计 */}
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📊 联系人统计</h3>
              <div className="space-y-4">
                {Object.entries(relationConfig).map(([relation, config]) => {
                  const count = contacts.filter((c) => c.relationship === relation).length;
                  if (count === 0) return null;
                  return (
                    <div key={relation} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center text-white text-sm`}>
                          {config.icon}
                        </span>
                        <span className="text-sm text-[var(--foreground-light)]">{relation}</span>
                      </div>
                      <span className="font-semibold text-[var(--foreground)]">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 公司内推资源 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">🏢 公司内推资源</h3>
              <div className="space-y-3">
                {Object.keys(allCompanyProfiles).map((company) => (
                  <div
                    key={company}
                    onClick={() => setSelectedCompany(company)}
                    className="p-3 rounded-xl hover:bg-[var(--muted)] cursor-pointer transition-smooth"
                  >
                    <p className="font-medium text-[var(--foreground)]">{company}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {contacts.filter(c => c.company === company).length} 位联系人
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 快速添加 */}
            <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] rounded-2xl p-6 shadow-md text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2">内推资源很重要</h3>
              <p className="text-white/80 text-sm mb-4">记得主动联系学长学姐，维护人脉关系</p>
              <Button className="w-full bg-white text-[var(--primary)] hover:bg-white/90" onClick={() => setIsFormOpen(true)}>
                ＋ 添加新联系人
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 联系人详情 */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onEdit={() => handleEditContact(selectedContact)}
          onViewCompany={handleViewCompany}
          onDelete={() => handleDeleteContact(selectedContact.id)}
        />
      )}

      {/* 公司详情 */}
      {selectedCompany && (
        <CompanyProfileModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}

      {/* 添加/编辑表单 */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsFormOpen(false); setEditingContact(undefined); }} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {editingContact ? '编辑联系人' : '添加联系人'}
              </h2>
              <button onClick={() => { setIsFormOpen(false); setEditingContact(undefined); }} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ContactForm
                contact={editingContact}
                onSave={handleSaveContact}
                onCancel={() => { setIsFormOpen(false); setEditingContact(undefined); }}
              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
