/**
 * Unified derived-data layer for application-related data.
 *
 * All components that need stats, filtered lists, or chart data
 * should import from here instead of duplicating filter/reduce logic.
 *
 * Single Source of Truth: everything derives from `applications` (and related
 * collections that reference them by applicationId or company name).
 */

import type {
  Application,
  Interview,
  Exam,
  Offer,
  Activity,
} from '@/context/DataContext';

// ─── Status helpers ────────────────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: '已投递',
  interviewing: '面试中',
  offer: 'Offer',
  rejected: '已拒绝',
};

export const APPLICATION_STAGE_COLORS: Record<string, string> = {
  pending: 'text-[var(--foreground-muted)] bg-[var(--muted)]',
  interviewing: 'text-[var(--warning)] bg-[var(--warning)]/10',
  offer: 'text-[var(--success)] bg-[var(--success)]/10',
  rejected: 'text-[var(--error)] bg-[var(--error)]/10',
};

// ─── Basic filters ─────────────────────────────────────────────────────────

export function getOfferApplications(applications: Application[]): Application[] {
  return applications.filter(a => a.status === 'offer');
}

export function getInterviewingApplications(applications: Application[]): Application[] {
  return applications.filter(a => a.status === 'interviewing');
}

export function getPendingApplications(applications: Application[]): Application[] {
  return applications.filter(a => a.status === 'pending');
}

export function getRejectedApplications(applications: Application[]): Application[] {
  return applications.filter(a => a.status === 'rejected');
}

export function getUpcomingInterviews(interviews: Interview[]): Interview[] {
  return interviews.filter(i => i.status === 'upcoming');
}

export function getCompletedInterviews(interviews: Interview[]): Interview[] {
  return interviews.filter(i => i.status === 'completed');
}

export function getRecentApplications(
  applications: Application[],
  limit = 5
): Application[] {
  return [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// ─── No-response alerts ────────────────────────────────────────────────────

export function getNoResponseApplications(
  applications: Application[],
  thresholdDays = 7
): Array<Application & { daysSince: number }> {
  const now = Date.now();
  return applications
    .filter(a => {
      if (a.status !== 'pending') return false;
      const appliedDate = new Date(a.appliedDate || a.createdAt);
      const daysSince = Math.floor((now - appliedDate.getTime()) / 86400000);
      return daysSince > thresholdDays;
    })
    .map(a => ({
      ...a,
      daysSince: Math.floor(
        (now - new Date(a.appliedDate || a.createdAt).getTime()) / 86400000
      ),
    }))
    .slice(0, 5);
}

// ─── Offer expiry alerts ───────────────────────────────────────────────────

export function getExpiringOffers(
  offers: Offer[],
  thresholdDays = 7
): Array<Offer & { daysLeft: number }> {
  const now = Date.now();
  return offers
    .filter(o => o.deadline)
    .map(o => ({
      ...o,
      daysLeft: Math.ceil(
        (new Date(o.deadline!).getTime() - now) / 86400000
      ),
    }))
    .filter(o => o.daysLeft >= 0 && o.daysLeft <= thresholdDays)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export interface ApplicationStats {
  total: number;
  pending: number;
  interviewing: number;
  offer: number;
  rejected: number;
  /** Applications that have received any kind of response (not pending) */
  replied: number;
  upcomingInterviews: number;
  completedInterviews: number;
  totalExams: number;
  totalOffers: number;
}

export function getApplicationStats(
  applications: Application[],
  interviews: Interview[],
  exams: Exam[],
  offers: Offer[]
): ApplicationStats {
  return {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    replied: applications.filter(a => a.status !== 'pending').length,
    upcomingInterviews: interviews.filter(i => i.status === 'upcoming').length,
    completedInterviews: interviews.filter(i => i.status === 'completed').length,
    totalExams: exams.length,
    totalOffers: offers.length,
  };
}

// ─── Conversion funnel (real data) ─────────────────────────────────────────

export interface FunnelStep {
  label: string;
  count: number;
  /** 0–100, relative to the first step */
  widthPercent: number;
}

/**
 * Builds a conversion funnel from real application data.
 * All counts are derived from DataContext collections — no hardcoded rates.
 */
export function getConversionFunnel(
  applications: Application[],
  interviews: Interview[],
  exams: Exam[],
  offers: Offer[]
): FunnelStep[] {
  const total = applications.length;
  if (total === 0) return [];

  const interviewCount = applications.filter(
    a => a.status === 'interviewing' || a.status === 'offer'
  ).length;
  const examCount = exams.filter(e => e.status === 'completed').length;
  const completedInterviews = interviews.filter(i => i.status === 'completed').length;
  const offerCount = offers.length;

  const steps: Array<{ label: string; count: number }> = [
    { label: '投递', count: total },
    { label: '进入面试', count: interviewCount },
    { label: '完成笔试', count: examCount },
    { label: '完成面试', count: completedInterviews },
    { label: 'Offer', count: offerCount },
  ];

  return steps.map(s => ({
    ...s,
    widthPercent: total > 0 ? Math.max(s.count > 0 ? 4 : 0, (s.count / total) * 100) : 0,
  }));
}

// ─── Trend data for charts ─────────────────────────────────────────────────

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  count: number;
  cumulative: number;
}

/**
 * Returns daily application counts for the past N days.
 */
export function getApplicationTrend(
  applications: Application[],
  days = 30
): TrendPoint[] {
  const now = new Date();
  const result: TrendPoint[] = [];
  let cumulative = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = applications.filter(
      a => (a.appliedDate || a.createdAt).startsWith(dateStr)
    ).length;
    cumulative += count;
    result.push({ date: dateStr, count, cumulative });
  }

  return result;
}

// ─── Company list from applications ────────────────────────────────────────

/** Returns unique company names from the user's actual applications. */
export function getAppliedCompanies(applications: Application[]): string[] {
  return [...new Set(applications.map(a => a.company.trim()).filter(Boolean))];
}

// ─── Weekly schedule ───────────────────────────────────────────────────────

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export interface WeekDay {
  day: string;
  dayName: string;
  dateStr: string;
  events: string[];
  highlight: boolean;
}

export function buildWeeklySchedule(
  events: Array<{ date: string; title: string }>,
  interviews: Array<{ date: string; time: string; company: string; type: string }>
): WeekDay[] {
  const today = new Date();
  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? '今天' : i === 1 ? '明天' : DAY_NAMES[d.getDay()];

    const eventLabels: string[] = [];
    interviews
      .filter(int => int.date === dateStr)
      .forEach(int => eventLabels.push(`${int.time} ${int.company} ${int.type}`));
    events
      .filter(e => e.date === dateStr)
      .forEach(e => eventLabels.push(e.title));

    week.push({
      day: dayLabel,
      dayName: DAY_NAMES[d.getDay()],
      dateStr,
      events: eventLabels.length > 0 ? eventLabels : ['暂无安排'],
      highlight: i === 0,
    });
  }

  return week;
}

// ─── Activity helpers ──────────────────────────────────────────────────────

export function getRecentActivities(
  activities: Activity[],
  limit = 20
): Activity[] {
  return [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
