'use client';

import { useMemo } from 'react';
import { useApplications, useInterviews, useOffers } from '@/context/DataContext';

interface WeeklyReportProps {
  onClose?: () => void;
}

export default function WeeklyReport({ onClose }: WeeklyReportProps) {
  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { offers } = useOffers();

  const report = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // This week's data
    const weekApplications = applications.filter(a => new Date(a.appliedDate) >= weekAgo);
    const weekInterviews = interviews.filter(i => new Date(i.date) >= weekAgo);

    // This month's data
    const monthApplications = applications.filter(a => new Date(a.appliedDate) >= monthAgo);
    const monthInterviews = interviews.filter(i => new Date(i.date) >= monthAgo);

    // Stage distribution
    const stageStats = {
      pending: applications.filter(a => a.status === 'pending').length,
      interviewing: applications.filter(a => a.status === 'interviewing').length,
      offer: applications.filter(a => a.status === 'offer').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };

    // Company distribution
    const companyStats = applications.reduce((acc, app) => {
      acc[app.company] = (acc[app.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCompanies = Object.entries(companyStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Conversion rates
    const totalApplied = applications.length;
    const totalInterviews = interviews.filter(i => i.status === 'completed').length;
    const interviewRate = totalApplied > 0 ? ((totalInterviews / totalApplied) * 100).toFixed(1) : '0';
    const offerRate = totalApplied > 0 ? ((offers.length / totalApplied) * 100).toFixed(1) : '0';

    return {
      week: {
        applications: weekApplications.length,
        interviews: weekInterviews.length,
      },
      month: {
        applications: monthApplications.length,
        interviews: monthInterviews.length,
      },
      total: {
        applications: totalApplied,
        interviews: totalInterviews,
        offers: offers.length,
      },
      stageStats,
      topCompanies,
      conversionRate: { interviewRate, offerRate },
      generatedAt: now.toLocaleString('zh-CN'),
    };
  }, [applications, interviews, offers]);

  const exportReport = () => {
    const reportText = `
📊 校招助手周报
生成时间: ${report.generatedAt}

━━━━━━━━━━━━━━━━━━━━
📈 本周数据
━━━━━━━━━━━━━━━━━━━━
• 本周投递: ${report.week.applications} 家
• 本周面试: ${report.week.interviews} 场

━━━━━━━━━━━━━━━━━━━━
📅 本月数据
━━━━━━━━━━━━━━━━━━━━
• 本月投递: ${report.month.applications} 家
• 本月面试: ${report.month.interviews} 场

━━━━━━━━━━━━━━━━━━━━
🎯 累计数据
━━━━━━━━━━━━━━━━━━━━
• 总投递数: ${report.total.applications} 家
• 面试总数: ${report.total.interviews} 场
• 收到 Offer: ${report.total.offers} 个

━━━━━━━━━━━━━━━━━━━━
📍 投递阶段分布
━━━━━━━━━━━━━━━━━━━━
• 待回复: ${report.stageStats.pending} 家
• 面试中: ${report.stageStats.interviewing} 家
• 已 Offer: ${report.stageStats.offer} 家
• 已拒绝: ${report.stageStats.rejected} 家

━━━━━━━━━━━━━━━━━━━━
💼 投递最多的公司
━━━━━━━━━━━━━━━━━━━━
${report.topCompanies.map(([company, count], i) => `${i + 1}. ${company} (${count}次)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━
📊 转化率
━━━━━━━━━━━━━━━━━━━━
• 投递→面试转化率: ${report.conversionRate.interviewRate}%
• 投递→Offer转化率: ${report.conversionRate.offerRate}%

━━━━━━━━━━━━━━━━━━━━
💪 加油！坚持就是胜利！
━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `校招周报_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">📊 周报摘要</h3>
          <p className="text-sm text-[var(--foreground-muted)]">{report.generatedAt}</p>
        </div>
        <button
          onClick={exportReport}
          className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-dark)] transition-smooth"
        >
          📥 导出报告
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-4 text-white text-center">
          <p className="text-3xl font-bold">{report.week.applications}</p>
          <p className="text-sm opacity-80">本周投递</p>
        </div>
        <div className="bg-gradient-to-br from-[var(--warning)] to-[#c49564] rounded-xl p-4 text-white text-center">
          <p className="text-3xl font-bold">{report.week.interviews}</p>
          <p className="text-sm opacity-80">本周面试</p>
        </div>
        <div className="bg-gradient-to-br from-[var(--success)] to-[#7a9878] rounded-xl p-4 text-white text-center">
          <p className="text-3xl font-bold">{report.total.offers}</p>
          <p className="text-sm opacity-80">收到Offer</p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[var(--surface)] rounded-xl p-4">
        <h4 className="font-medium text-[var(--foreground)] mb-3">📊 转化漏斗</h4>
        <div className="space-y-2">
          {[
            { label: '投递', value: report.total.applications, color: 'bg-[var(--primary)]', percent: 100 },
            { label: '面试', value: report.total.interviews, color: 'bg-[var(--warning)]', percent: Math.round((report.total.interviews / Math.max(report.total.applications, 1)) * 100) },
            { label: 'Offer', value: report.total.offers, color: 'bg-[var(--success)]', percent: Math.round((report.total.offers / Math.max(report.total.applications, 1)) * 100) },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-12 text-sm text-[var(--foreground-light)]">{item.label}</span>
              <div className="flex-1 h-6 bg-[var(--muted)] rounded-lg overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-lg flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(item.percent, item.value > 0 ? 10 : 0)}%` }}
                >
                  <span className="text-xs font-medium text-white">{item.value}</span>
                </div>
              </div>
              <span className="w-12 text-sm text-[var(--foreground-muted)] text-right">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-[var(--surface)] rounded-xl p-4">
        <h4 className="font-medium text-[var(--foreground)] mb-3">💼 投递最多的公司</h4>
        {report.topCompanies.length > 0 ? (
          <div className="space-y-2">
            {report.topCompanies.map(([company, count], i) => (
              <div key={company} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                  i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-[var(--muted-dark)]'
                }`}>
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-[var(--foreground)]">{company}</span>
                <span className="text-sm text-[var(--foreground-muted)]">{count}次</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground-muted)] text-center py-4">暂无数据</p>
        )}
      </div>

      {/* Stage Distribution */}
      <div className="bg-[var(--surface)] rounded-xl p-4">
        <h4 className="font-medium text-[var(--foreground)] mb-3">📍 投递状态分布</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(report.stageStats).map(([stage, count]) => {
            const labels: Record<string, string> = {
              pending: '待回复',
              interviewing: '面试中',
              offer: '已Offer',
              rejected: '已拒绝',
            };
            const colors: Record<string, string> = {
              pending: 'bg-[var(--muted-dark)]',
              interviewing: 'bg-[var(--warning)]',
              offer: 'bg-[var(--success)]',
              rejected: 'bg-[var(--error)]',
            };
            return (
              <div key={stage} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--muted)]">
                <div className={`w-3 h-3 rounded-full ${colors[stage]}`} />
                <span className="text-sm text-[var(--foreground-light)]">{labels[stage]}</span>
                <span className="ml-auto font-medium text-[var(--foreground)]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-xl p-4 text-white">
        <p className="text-sm font-medium">💪 加油！</p>
        <p className="text-sm opacity-90 mt-1">
          {report.total.applications === 0
            ? '开始投递吧！第一步总是最难的，但你已经迈出了第一步。'
            : report.total.offers === 0
            ? `你已经投递了 ${report.total.applications} 家公司，继续坚持，Offer 就在不远处！`
            : '恭喜收到 Offer！继续加油，争取更多选择！'}
        </p>
      </div>
    </div>
  );
}
