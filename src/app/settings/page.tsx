'use client';

import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useToast } from '@/components/UI/Toast';
import { useUserProfile, useDataManagement, useStats, useApp } from '@/context/DataContext';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { clearAllSupabaseData } from '@/lib/supabase-service';

export default function SettingsPage() {
  const { state } = useApp();
  const { userProfile, update } = useUserProfile();
  const { exportData, importData, clearAllData, cleanOrphanData } = useDataManagement();
  const { stats } = useStats();
  const { isConfigured, lastSynced, isSyncing, error, syncToCloud, syncFromCloud, deviceId } = useSupabaseSync();
  const { addToast } = useToast();

  const [noResponseDays, setNoResponseDays] = useState(userProfile.settings?.noResponseDays || 7);
  const [quietHoursStart, setQuietHoursStart] = useState(userProfile.settings?.quietHoursStart || '22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState(userProfile.settings?.quietHoursEnd || '08:00');
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kimi-api-key') || '';
    }
    return '';
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(userProfile.settings?.monthlyBudget || 100);
  const [targetApplications, setTargetApplications] = useState(userProfile.goals?.applications || 50);
  const [targetInterviews, setTargetInterviews] = useState(userProfile.goals?.interviews || 20);
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [isImporting, setIsImporting] = useState(false);
  const [aiUsage] = useState(() => {
    if (typeof window !== 'undefined') {
      const used = parseFloat(localStorage.getItem('kimi-usage') || '0');
      const budget = userProfile.settings?.monthlyBudget || 100;
      return { used, budget, percent: Math.min(100, (used / budget) * 100) };
    }
    return { used: 0, budget: 100, percent: 0 };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 水合完成后将本地 state 同步为实际持久化值，避免显示默认值覆盖已保存数据
  useEffect(() => {
    if (state.isHydrated) {
      setName(userProfile.name);
      setTitle(userProfile.title);
      setNoResponseDays(userProfile.settings?.noResponseDays || 7);
      setQuietHoursStart(userProfile.settings?.quietHoursStart || '22:00');
      setQuietHoursEnd(userProfile.settings?.quietHoursEnd || '08:00');
      setMonthlyBudget(userProfile.settings?.monthlyBudget || 100);
      setTargetApplications(userProfile.goals?.applications || 50);
      setTargetInterviews(userProfile.goals?.interviews || 20);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isHydrated]);

  const handleSaveProfile = () => {
    update({ name, title });
    addToast('success', '个人信息已保存');
  };

  const handleSaveGoals = () => {
    update({
      goals: {
        applications: targetApplications,
        interviews: targetInterviews,
        replies: userProfile.goals?.replies || 30,
      },
    });
    addToast('success', '求职目标已保存');
  };

  const handleSaveSettings = () => {
    update({
      settings: {
        ...userProfile.settings,
        noResponseDays,
        quietHoursStart,
        quietHoursEnd,
        monthlyBudget,
      },
    });
    if (apiKey) {
      localStorage.setItem('kimi-api-key', apiKey);
    }
    addToast('success', '设置已保存');
  };

  const handleClearAllData = async () => {
    if (!window.confirm('确定要清除所有数据吗？此操作不可恢复。')) return;
    clearAllData();
    if (isConfigured) {
      await clearAllSupabaseData();
    }
    addToast('success', '所有数据已清除');
  };

  const handleCleanOrphanData = () => {
    if (!window.confirm('将删除所有与投递记录不匹配的数据（面试、笔试、联系人、日历、Offer、公司档案）。确定吗？')) return;
    const count = cleanOrphanData();
    addToast('success', count > 0 ? `已清理 ${count} 条孤儿数据` : '没有需要清理的孤儿数据');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importData(file);
    } catch {
      alert('导入失败：无效的文件格式');
    } finally {
      setIsImporting(false);
    }
  };

  const themes = [
    { id: 'green', name: '莫兰迪绿调', color: '#8B9A7D' },
    { id: 'brown', name: '莫兰迪棕调', color: '#A78B7D' },
    { id: 'blue', name: '莫兰迪蓝调', color: '#7D8BA7' },
    { id: 'yellow', name: '莫兰迪黄调', color: '#A7A47D' },
  ];

  const currentTheme = themes.find(t => t.id === userProfile.settings?.theme) || themes[0];

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
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">{name}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">{title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    求职意向
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="w-full">保存修改</Button>
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
              <div className="p-3 bg-[var(--muted)] rounded-xl">
                <p className="text-sm text-[var(--foreground-light)]">当前进度</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm">投递 {stats.totalApplications}/{targetApplications}</span>
                  <span className="text-sm">面试 {stats.completedInterviews}/{targetInterviews}</span>
                </div>
              </div>
              <Button onClick={handleSaveGoals} className="w-full">保存目标</Button>
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
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  >
                    {showApiKey ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  用于调用 Kimi AI API 提供智能助手功能
                </p>
                {apiKey && apiKey.startsWith('sk-') && (
                  <p className="text-xs text-green-600 mt-1">✅ API Key 已配置</p>
                )}
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
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all"
                  style={{ width: `${aiUsage.percent}%` }}
                />
              </div>
              <p className="text-sm text-[var(--foreground-muted)]">
                本月已用 ¥{aiUsage.used.toFixed(2)}（{aiUsage.percent.toFixed(1)}%）
              </p>
              <Button onClick={handleSaveSettings} className="w-full">保存设置</Button>
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
            </div>
          </div>

          {/* 数据管理 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              💾 数据管理
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-[var(--muted)] rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[var(--primary)]">{stats.totalApplications}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">投递</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--warning)]">{stats.upcomingInterviews}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">面试</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--info)]">{stats.totalContacts}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">联系人</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--success)]">{stats.totalOffers}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Offer</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-xl">📤</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">导出数据</p>
                    <p className="text-sm text-[var(--foreground-muted)]">下载 JSON 格式备份</p>
                  </div>
                </div>
                <Button variant="secondary" onClick={exportData}>
                  导出
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-xl">📥</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">导入数据</p>
                    <p className="text-sm text-[var(--foreground-muted)]">从备份文件恢复</p>
                  </div>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                  >
                    {isImporting ? '导入中...' : '导入'}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <span className="text-xl">🧹</span>
                    </div>
                    <div>
                      <p className="font-medium text-yellow-700">清理孤儿数据（以投递为准）</p>
                      <p className="text-sm text-yellow-600">删除与投递记录不匹配的面试、笔试、联系人等</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleCleanOrphanData}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0"
                  >
                    清理
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">清除所有数据（重置为空白）</p>
                      <p className="text-sm text-red-400">不可恢复，同时清除本地及云端数据</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleClearAllData}
                    className="bg-red-100 text-red-600 hover:bg-red-200 border-0"
                  >
                    清除
                  </Button>
                </div>
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
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`w-12 h-12 rounded-xl transition-smooth ${
                        currentTheme.id === theme.id ? 'ring-2 ring-offset-2 ring-[var(--primary)]' : ''
                      }`}
                      style={{ backgroundColor: theme.color }}
                      title={theme.name}
                      onClick={() => update({ settings: { ...userProfile.settings, theme: theme.id } })}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-[var(--foreground)]">默认视图</span>
                  <select
                    value={userProfile.settings?.defaultView || 'kanban'}
                    onChange={(e) => update({ settings: { ...userProfile.settings, defaultView: e.target.value } })}
                    className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="kanban">看板视图</option>
                    <option value="table">表格视图</option>
                    <option value="card">卡片视图</option>
                    <option value="timeline">时间线视图</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* 云端同步 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              ☁️ 云端同步 (Supabase)
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">同步状态</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {isConfigured ? '✅ 环境变量已读取' : '⚠️ 未检测到环境变量'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isConfigured ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {isConfigured ? '已配置完成' : '待配置'}
                  </span>
                </div>
                {deviceId && (
                  <p className="text-xs text-[var(--foreground-muted)] mt-2">
                    设备ID: {deviceId.slice(0, 16)}...
                  </p>
                )}
                {lastSynced && (
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    上次同步: {lastSynced.toLocaleString('zh-CN')}
                  </p>
                )}
              </div>

              {!isConfigured ? (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800 mb-2">📋 配置步骤:</p>
                  <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
                    <li>在 <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a> 创建项目</li>
                    <li>获取 Project URL 和 anon public key</li>
                    <li>在 Supabase SQL Editor 中运行建表脚本</li>
                    <li>在 Vercel 环境变量中设置:
                      <code className="block bg-blue-100 px-2 py-1 rounded mt-1 text-xs">
                        NEXT_PUBLIC_SUPABASE_URL=your_url<br/>
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
                      </code>
                    </li>
                    <li>重新部署后即可使用云端同步</li>
                  </ol>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      const result = await syncToCloud(state);
                      if (result.success) {
                        alert('✅ 数据已同步到云端');
                      } else {
                        alert('❌ 同步失败: ' + (result.error || '未知错误'));
                      }
                    }}
                    className="flex-1"
                    disabled={isSyncing}
                  >
                    {isSyncing ? '同步中...' : '📤 上传'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      const result = await syncFromCloud();
                      if (result.data) {
                        alert('✅ 已从云端恢复数据，页面将刷新');
                        window.location.reload();
                      } else {
                        alert('❌ 恢复失败: ' + (result.error || '未知错误'));
                      }
                    }}
                    className="flex-1"
                    disabled={isSyncing}
                  >
                    {isSyncing ? '加载中...' : '📥 下载'}
                  </Button>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
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
