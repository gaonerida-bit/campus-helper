'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';

export default function SettingsPage() {
  const [noResponseDays, setNoResponseDays] = useState(7);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [monthlyBudget, setMonthlyBudget] = useState(100);
  const [targetApplications, setTargetApplications] = useState(50);
  const [targetInterviews, setTargetInterviews] = useState(20);
  const [localBackupPath] = useState('E:\\AI agent 编码\\校招助手开发');

  return (
    <AppLayout>
      <Header title="设置" subtitle="个性化配置" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 账号设置 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              👤 个人信息
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-semibold">
                  N
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">Nerida</p>
                  <p className="text-sm text-[var(--foreground-muted)]">校招求职者</p>
                </div>
                <button className="ml-auto px-4 py-2 rounded-xl bg-[var(--muted)] text-[var(--foreground-light)] hover:bg-[var(--muted-dark)] transition-smooth text-sm">
                  修改头像
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    defaultValue="Nerida"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    求职意向
                  </label>
                  <input
                    type="text"
                    defaultValue="前端开发工程师"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 求职目标 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              🎯 求职目标
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">目标投递数</p>
                  <p className="text-sm text-[var(--foreground-muted)]">成就进度条参考</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={targetApplications}
                    onChange={(e) => setTargetApplications(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <span className="text-[var(--foreground-muted)]">家</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">目标面试数</p>
                  <p className="text-sm text-[var(--foreground-muted)]">成就进度条参考</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={targetInterviews}
                    onChange={(e) => setTargetInterviews(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <span className="text-[var(--foreground-muted)]">场</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI 设置 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              🤖 AI 助手设置
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  API Key（Kimi）
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">月度预算上限</p>
                  <p className="text-sm text-[var(--foreground-muted)]">接近时提醒</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--foreground-muted)]">¥</span>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
              <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '23%' }} />
              </div>
              <p className="text-sm text-[var(--foreground-muted)]">本月已用 ¥23（23%）</p>
            </div>
          </div>

          {/* 提醒设置 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              ⏰ 提醒设置
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">提醒总开关</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[var(--primary)]" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">无回应提醒天数</p>
                  <p className="text-sm text-[var(--foreground-muted)]">投递后 N 天无回应自动提醒</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={noResponseDays}
                    onChange={(e) => setNoResponseDays(Number(e.target.value))}
                    min={1}
                    max={30}
                    className="w-20 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <span className="text-[var(--foreground-muted)]">天</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-[var(--foreground)]">面试前1天提醒</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[var(--primary)]" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-[var(--foreground)]">面试前2小时提醒</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[var(--primary)]" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-[var(--foreground)]">网申截止前3天提醒</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[var(--primary)]" />
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <div>
                  <p className="font-medium text-[var(--foreground)] mb-2">安静时段</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => setQuietHoursStart(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <span className="text-[var(--foreground-muted)]">至</span>
                    <input
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => setQuietHoursEnd(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm text-[var(--foreground-muted)]">该时段不推送</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-medium text-[var(--foreground)]">联系人久未联系提醒</span>
                    <p className="text-sm text-[var(--foreground-muted)]">超过设定天数未联系时提醒</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={30}
                      min={7}
                      max={90}
                      className="w-20 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <span className="text-[var(--foreground-muted)]">天</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 数据同步 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              ☁️ 数据同步
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Supabase 云端</p>
                    <p className="text-sm text-[var(--success)]">已连接 · 上次同步 5分钟前</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-smooth text-sm">
                  立即同步
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-xl">💾</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--foreground)]">本地备份</p>
                    <p className="text-sm text-[var(--foreground-muted)] break-all">{localBackupPath}</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary-light)] transition-smooth text-sm">
                  手动备份
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">自动备份</p>
                  <p className="text-sm text-[var(--foreground-muted)]">每天自动同步到本地</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[var(--primary)]" />
              </div>
            </div>
          </div>

          {/* 外观设置 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              🎨 外观
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[var(--foreground)] mb-3">配色方案</p>
                <div className="flex gap-3">
                  <button className="w-12 h-12 rounded-xl bg-[#8B9A7D] ring-2 ring-offset-2 ring-[var(--primary)]" title="莫兰迪绿调" />
                  <button className="w-12 h-12 rounded-xl bg-[#A78B7D]" title="莫兰迪棕调" />
                  <button className="w-12 h-12 rounded-xl bg-[#7D8BA7]" title="莫兰迪蓝调" />
                  <button className="w-12 h-12 rounded-xl bg-[#A7A47D]" title="莫兰迪黄调" />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-[var(--foreground)]">默认视图</span>
                  <select className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none cursor-pointer">
                    <option value="kanban">看板视图</option>
                    <option value="table">表格视图</option>
                    <option value="card">卡片视图</option>
                    <option value="timeline">时间线视图</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* 关于 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              ℹ️ 关于
            </h3>
            <div className="space-y-2 text-sm text-[var(--foreground-light)]">
              <p>校招助手 v1.0.0</p>
              <p>由 AI 驱动的秋招管理工具</p>
              <p className="text-[var(--foreground-muted)]">© 2026 · 让校招更轻松</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
