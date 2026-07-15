'use client';

import { useState, useCallback } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import {
  useMasterResume,
  MasterResume,
  MasterResumeEducation,
  MasterResumeInternship,
  MasterResumeProject,
} from '@/context/DataContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Sub-components: Section wrappers ────────────────────────────────────────

function SectionCard({ title, icon, children, action }: {
  title: string;
  icon: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--surface)] rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── BasicInfo ────────────────────────────────────────────────────────────────

function BasicInfoSection({ masterResume, onSave }: {
  masterResume: MasterResume;
  onSave: (data: MasterResume) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...masterResume.basicInfo });

  const handleSave = () => {
    onSave({ ...masterResume, basicInfo: form });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...masterResume.basicInfo });
    setEditing(false);
  };

  const info = masterResume.basicInfo;

  if (!editing) {
    return (
      <SectionCard
        title="基本信息"
        icon="👤"
        action={
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>编辑</Button>
        }
      >
        {!info.name && !info.phone && !info.email ? (
          <div className="text-center py-6">
            <p className="text-[var(--foreground-muted)] text-sm mb-3">还未填写基本信息</p>
            <Button size="sm" onClick={() => setEditing(true)}>+ 填写基本信息</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {info.name && <div><span className="text-[var(--foreground-muted)]">姓名</span><p className="font-medium mt-0.5">{info.name}</p></div>}
            {info.phone && <div><span className="text-[var(--foreground-muted)]">手机</span><p className="font-medium mt-0.5">{info.phone}</p></div>}
            {info.email && <div><span className="text-[var(--foreground-muted)]">邮箱</span><p className="font-medium mt-0.5">{info.email}</p></div>}
            {info.location && <div><span className="text-[var(--foreground-muted)]">所在地</span><p className="font-medium mt-0.5">{info.location}</p></div>}
            {info.targetPosition && <div><span className="text-[var(--foreground-muted)]">求职意向</span><p className="font-medium mt-0.5">{info.targetPosition}</p></div>}
            {info.targetSalary && <div><span className="text-[var(--foreground-muted)]">期望薪资</span><p className="font-medium mt-0.5">{info.targetSalary}</p></div>}
            {info.github && <div><span className="text-[var(--foreground-muted)]">GitHub</span><p className="font-medium mt-0.5">{info.github}</p></div>}
            {info.linkedin && <div><span className="text-[var(--foreground-muted)]">LinkedIn</span><p className="font-medium mt-0.5">{info.linkedin}</p></div>}
            {info.portfolio && <div className="col-span-2"><span className="text-[var(--foreground-muted)]">作品集</span><p className="font-medium mt-0.5">{info.portfolio}</p></div>}
            {info.summary && <div className="col-span-2"><span className="text-[var(--foreground-muted)]">个人简介</span><p className="text-[var(--foreground-light)] mt-0.5 whitespace-pre-wrap">{info.summary}</p></div>}
          </div>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard title="基本信息" icon="👤">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {([
            ['name', '姓名 *', 'text'],
            ['phone', '手机号', 'tel'],
            ['email', '邮箱', 'email'],
            ['location', '所在城市', 'text'],
            ['targetPosition', '求职意向', 'text'],
            ['targetSalary', '期望薪资', 'text'],
            ['github', 'GitHub', 'url'],
            ['linkedin', 'LinkedIn', 'url'],
          ] as [keyof typeof form, string, string][]).map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">{label}</label>
              <input
                type={type}
                value={(form[key] as string) || ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">作品集链接</label>
          <input
            type="url"
            value={form.portfolio || ''}
            onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">个人简介</label>
          <textarea
            value={form.summary || ''}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            placeholder="简短介绍自己的技术背景、求职意向..."
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">保存</Button>
          <Button variant="secondary" onClick={handleCancel} className="flex-1">取消</Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Education ───────────────────────────────────────────────────────────────

const DEGREE_OPTIONS = ['本科', '硕士', '博士', '专科', '其他'];

type EduFormState = Omit<MasterResumeEducation, 'id'>;
const emptyEdu: EduFormState = { school: '', major: '', degree: '本科', startDate: '', endDate: '', gpa: '', courses: '', awards: '' };

function EducationForm({ initial, onSubmit, onCancel }: {
  initial: EduFormState;
  onSubmit: (data: EduFormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);

  return (
    <div className="space-y-4 p-4 bg-[var(--muted)] rounded-xl">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">学校名称 *</label>
          <input value={form.school} onChange={e => setForm({ ...form, school: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：北京大学" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">专业 *</label>
          <input value={form.major} onChange={e => setForm({ ...form, major: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：计算机科学与技术" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">学历 *</label>
          <select value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
            {DEGREE_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">GPA</label>
          <input value={form.gpa || ''} onChange={e => setForm({ ...form, gpa: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：3.8/4.0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">开始时间</label>
          <input type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">结束时间</label>
          <input type="month" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="至今可留空" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">主修课程</label>
        <input value={form.courses || ''} onChange={e => setForm({ ...form, courses: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="如：数据结构、算法、操作系统、计算机网络" />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">奖项荣誉</label>
        <input value={form.awards || ''} onChange={e => setForm({ ...form, awards: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="如：国家奖学金、ACM 区域赛银奖" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => { if (!form.school || !form.major) { alert('请填写学校和专业'); return; } onSubmit(form); }} className="flex-1">保存</Button>
        <Button size="sm" variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

function EducationSection({ masterResume, onSave }: { masterResume: MasterResume; onSave: (data: MasterResume) => void }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: EduFormState) => {
    const newEdu: MasterResumeEducation = { id: genId(), ...data };
    onSave({ ...masterResume, educations: [...masterResume.educations, newEdu] });
    setAdding(false);
  };

  const handleUpdate = (id: string, data: EduFormState) => {
    onSave({ ...masterResume, educations: masterResume.educations.map(e => e.id === id ? { ...e, ...data } : e) });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('确认删除这条教育经历？')) return;
    onSave({ ...masterResume, educations: masterResume.educations.filter(e => e.id !== id) });
  };

  return (
    <SectionCard title="教育经历" icon="🎓" action={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ 添加</Button>}>
      <div className="space-y-4">
        {masterResume.educations.map(edu => (
          <div key={edu.id}>
            {editingId === edu.id ? (
              <EducationForm
                initial={{ school: edu.school, major: edu.major, degree: edu.degree, startDate: edu.startDate, endDate: edu.endDate, gpa: edu.gpa, courses: edu.courses, awards: edu.awards }}
                onSubmit={(data) => handleUpdate(edu.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[var(--foreground)]">{edu.school}</h4>
                      <span className="px-2 py-0.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-xs">{edu.degree}</span>
                    </div>
                    <p className="text-sm text-[var(--foreground-light)]">{edu.major}</p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">
                      {edu.startDate} — {edu.endDate || '至今'}
                      {edu.gpa && ` · GPA ${edu.gpa}`}
                    </p>
                    {edu.courses && <p className="text-xs text-[var(--foreground-muted)] mt-1">主修课程：{edu.courses}</p>}
                    {edu.awards && <p className="text-xs text-[var(--foreground-muted)] mt-0.5">荣誉：{edu.awards}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button onClick={() => setEditingId(edu.id)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-muted)] text-sm">✏️</button>
                    <button onClick={() => handleDelete(edu.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--foreground-muted)] hover:text-red-500 text-sm">🗑️</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {adding && (
          <EducationForm initial={{ ...emptyEdu }} onSubmit={handleAdd} onCancel={() => setAdding(false)} />
        )}
        {masterResume.educations.length === 0 && !adding && (
          <div className="text-center py-6">
            <p className="text-[var(--foreground-muted)] text-sm mb-3">还没有添加教育经历</p>
            <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ 添加教育经历</Button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Internship ───────────────────────────────────────────────────────────────

type InternFormState = Omit<MasterResumeInternship, 'id'>;

function BulletsEditor({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  const add = () => onChange([...bullets, '']);
  const update = (i: number, v: string) => { const b = [...bullets]; b[i] = v; onChange(b); };
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-[var(--foreground-muted)] text-sm mt-2 flex-shrink-0">•</span>
          <textarea
            value={b}
            onChange={e => update(i, e.target.value)}
            rows={2}
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            placeholder="用 STAR 法则描述：做了什么 → 怎么做 → 达到什么结果"
          />
          <button onClick={() => remove(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--foreground-muted)] hover:text-red-500 mt-1">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-[var(--primary)] hover:underline">+ 添加一条描述</button>
    </div>
  );
}

function InternshipForm({ initial, onSubmit, onCancel }: {
  initial: InternFormState;
  onSubmit: (data: InternFormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<InternFormState>(initial);

  return (
    <div className="space-y-4 p-4 bg-[var(--muted)] rounded-xl">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">公司名称 *</label>
          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：字节跳动" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">岗位 *</label>
          <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：前端开发实习生" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">开始时间</label>
          <input type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">结束时间</label>
          <input type="month" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="至今可留空" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">工作地点</label>
          <input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：北京（线上）" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-2">工作内容描述</label>
        <BulletsEditor bullets={form.bullets} onChange={bullets => setForm({ ...form, bullets })} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => { if (!form.company || !form.position) { alert('请填写公司和岗位'); return; } onSubmit(form); }} className="flex-1">保存</Button>
        <Button size="sm" variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

function InternshipSection({ masterResume, onSave }: { masterResume: MasterResume; onSave: (data: MasterResume) => void }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyIntern: InternFormState = { company: '', position: '', startDate: '', endDate: '', location: '', bullets: [''] };

  const handleAdd = (data: InternFormState) => {
    onSave({ ...masterResume, internships: [...masterResume.internships, { id: genId(), ...data }] });
    setAdding(false);
  };
  const handleUpdate = (id: string, data: InternFormState) => {
    onSave({ ...masterResume, internships: masterResume.internships.map(i => i.id === id ? { ...i, ...data } : i) });
    setEditingId(null);
  };
  const handleDelete = (id: string) => {
    if (!confirm('确认删除这条实习经历？')) return;
    onSave({ ...masterResume, internships: masterResume.internships.filter(i => i.id !== id) });
  };

  return (
    <SectionCard title="实习经历" icon="💼" action={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ 添加</Button>}>
      <div className="space-y-4">
        {masterResume.internships.map(intern => (
          <div key={intern.id}>
            {editingId === intern.id ? (
              <InternshipForm
                initial={{ company: intern.company, position: intern.position, startDate: intern.startDate, endDate: intern.endDate, location: intern.location, bullets: intern.bullets.length ? intern.bullets : [''] }}
                onSubmit={data => handleUpdate(intern.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-smooth">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[var(--foreground)]">{intern.company}</h4>
                      <span className="text-sm text-[var(--foreground-light)]">· {intern.position}</span>
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                      {intern.startDate} — {intern.endDate || '至今'}
                      {intern.location && ` · ${intern.location}`}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingId(intern.id)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-muted)] text-sm">✏️</button>
                    <button onClick={() => handleDelete(intern.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--foreground-muted)] hover:text-red-500 text-sm">🗑️</button>
                  </div>
                </div>
                <ul className="space-y-1 pl-3">
                  {intern.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-sm text-[var(--foreground-light)] flex gap-2">
                      <span className="text-[var(--primary)] flex-shrink-0 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {adding && <InternshipForm initial={emptyIntern} onSubmit={handleAdd} onCancel={() => setAdding(false)} />}
        {masterResume.internships.length === 0 && !adding && (
          <div className="text-center py-6">
            <p className="text-[var(--foreground-muted)] text-sm mb-3">还没有添加实习经历</p>
            <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ 添加实习经历</Button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

type ProjFormState = Omit<MasterResumeProject, 'id'> & { techStackRaw: string };

function ProjectForm({ initial, onSubmit, onCancel }: {
  initial: ProjFormState;
  onSubmit: (data: ProjFormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProjFormState>(initial);

  return (
    <div className="space-y-4 p-4 bg-[var(--muted)] rounded-xl">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">项目名称 *</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：校招助手 Web App" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">我的角色 *</label>
          <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：独立开发 / 前端负责人" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">开始时间</label>
          <input type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">结束时间</label>
          <input type="month" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="进行中可留空" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">技术栈（用逗号分隔）</label>
          <input value={form.techStackRaw} onChange={e => setForm({ ...form, techStackRaw: e.target.value, techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：React, TypeScript, Next.js, Tailwind CSS, Supabase" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">项目链接</label>
          <input type="url" value={form.url || ''} onChange={e => setForm({ ...form, url: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="GitHub / Demo 链接（可选）" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-2">项目难点/成果描述</label>
        <BulletsEditor bullets={form.bullets} onChange={bullets => setForm({ ...form, bullets })} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => { if (!form.name || !form.role) { alert('请填写项目名称和角色'); return; } onSubmit(form); }} className="flex-1">保存</Button>
        <Button size="sm" variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

function ProjectSection({ masterResume, onSave }: { masterResume: MasterResume; onSave: (data: MasterResume) => void }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyProj: ProjFormState = { name: '', role: '', startDate: '', endDate: '', techStack: [], techStackRaw: '', bullets: [''], url: '' };

  const handleAdd = (data: ProjFormState) => {
    const { techStackRaw: _, ...rest } = data;
    onSave({ ...masterResume, projects: [...masterResume.projects, { id: genId(), ...rest }] });
    setAdding(false);
  };
  const handleUpdate = (id: string, data: ProjFormState) => {
    const { techStackRaw: _, ...rest } = data;
    onSave({ ...masterResume, projects: masterResume.projects.map(p => p.id === id ? { ...p, ...rest } : p) });
    setEditingId(null);
  };
  const handleDelete = (id: string) => {
    if (!confirm('确认删除这个项目经历？')) return;
    onSave({ ...masterResume, projects: masterResume.projects.filter(p => p.id !== id) });
  };

  return (
    <SectionCard title="项目经历" icon="🚀" action={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ 添加</Button>}>
      <div className="space-y-4">
        {masterResume.projects.map(proj => (
          <div key={proj.id}>
            {editingId === proj.id ? (
              <ProjectForm
                initial={{ ...proj, techStackRaw: proj.techStack.join(', '), endDate: proj.endDate || '' }}
                onSubmit={data => handleUpdate(proj.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-smooth">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[var(--foreground)]">{proj.name}</h4>
                      <span className="text-sm text-[var(--foreground-light)]">· {proj.role}</span>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline" onClick={e => e.stopPropagation()}>
                          🔗 链接
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{proj.startDate} — {proj.endDate || '进行中'}</p>
                    {proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.techStack.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--muted)] text-xs text-[var(--foreground-light)]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                    <button onClick={() => setEditingId(proj.id)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-muted)] text-sm">✏️</button>
                    <button onClick={() => handleDelete(proj.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--foreground-muted)] hover:text-red-500 text-sm">🗑️</button>
                  </div>
                </div>
                <ul className="space-y-1 pl-3 mt-2">
                  {proj.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-sm text-[var(--foreground-light)] flex gap-2">
                      <span className="text-[var(--primary)] flex-shrink-0 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {adding && <ProjectForm initial={emptyProj} onSubmit={handleAdd} onCancel={() => setAdding(false)} />}
        {masterResume.projects.length === 0 && !adding && (
          <div className="text-center py-6">
            <p className="text-[var(--foreground-muted)] text-sm mb-3">还没有添加项目经历</p>
            <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ 添加项目经历</Button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection({ masterResume, onSave }: { masterResume: MasterResume; onSave: (data: MasterResume) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...masterResume.skills });
  const skills = masterResume.skills;

  const handleSave = () => {
    onSave({ ...masterResume, skills: form });
    setEditing(false);
  };

  const fields: [keyof typeof form, string][] = [
    ['frontend', '前端'],
    ['backend', '后端'],
    ['languages', '编程语言'],
    ['tools', '工具 & 平台'],
    ['other', '其他技能'],
  ];

  if (!editing) {
    const hasAny = fields.some(([k]) => !!skills[k]);
    return (
      <SectionCard title="技能清单" icon="⚡" action={<Button size="sm" variant="secondary" onClick={() => setEditing(true)}>编辑</Button>}>
        {!hasAny ? (
          <div className="text-center py-6">
            <p className="text-[var(--foreground-muted)] text-sm mb-3">还没有填写技能清单</p>
            <Button size="sm" onClick={() => setEditing(true)}>+ 填写技能</Button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {fields.map(([k, label]) => skills[k] && (
              <div key={k} className="flex gap-3">
                <span className="text-[var(--foreground-muted)] flex-shrink-0 w-20">{label}</span>
                <span className="text-[var(--foreground-light)]">{skills[k]}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard title="技能清单" icon="⚡">
      <div className="space-y-4">
        {fields.map(([k, label]) => (
          <div key={k}>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">{label}</label>
            <input
              value={(form[k] as string) || ''}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder={
                k === 'frontend' ? 'React, Vue, TypeScript, HTML/CSS, Tailwind' :
                k === 'backend' ? 'Node.js, Python, Go, MySQL, Redis, MongoDB' :
                k === 'languages' ? 'JavaScript, TypeScript, Python, Java, C++' :
                k === 'tools' ? 'Git, Docker, Linux, VSCode, Figma' :
                '其他相关技能...'
              }
            />
          </div>
        ))}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">保存</Button>
          <Button variant="secondary" onClick={() => { setForm({ ...skills }); setEditing(false); }} className="flex-1">取消</Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResumeVaultPage() {
  const { masterResume, update } = useMasterResume();

  const handleSave = useCallback((data: MasterResume) => {
    update(data);
  }, [update]);

  const totalItems =
    masterResume.educations.length +
    masterResume.internships.length +
    masterResume.projects.length;

  return (
    <AppLayout>
      <Header
        title="我的履历库"
        subtitle={`已收录 ${totalItems} 条素材 · 用于 AI 定制简历`}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 说明卡片 */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📚</div>
              <div>
                <h3 className="font-semibold mb-1">全局履历库</h3>
                <p className="text-white/80 text-sm">
                  在这里维护你所有的职业素材——一次录入，随时调用。在投递某个岗位时，AI 会自动从这里挑选最相关的内容，生成针对该 JD 的定制简历。
                </p>
              </div>
            </div>
          </div>

          {/* 各模块 */}
          <BasicInfoSection masterResume={masterResume} onSave={handleSave} />
          <EducationSection masterResume={masterResume} onSave={handleSave} />
          <InternshipSection masterResume={masterResume} onSave={handleSave} />
          <ProjectSection masterResume={masterResume} onSave={handleSave} />
          <SkillsSection masterResume={masterResume} onSave={handleSave} />

          {masterResume.updatedAt && (
            <p className="text-xs text-[var(--foreground-muted)] text-center pb-4">
              上次更新：{new Date(masterResume.updatedAt).toLocaleString('zh-CN')}
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
