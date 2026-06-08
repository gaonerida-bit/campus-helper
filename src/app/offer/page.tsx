'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface Offer {
  id: number;
  company: string;
  position: string;
  baseSalary: number; // 月薪
  bonus?: number; // 年终奖月数
  stock?: number; // 股票/期权价值
  signingBonus?: number; // 签字费
  city: string;
  benefits: {
    housing: number; // 房补
    meal: number; // 餐补
    transport: number; // 交通补
    annualLeave: number; // 年假天数
    housingFund: number; // 公积金比例
  };
  workLife: {
    avgHours: number; // 日均工时
    weekendWork: '从不' | '偶尔' | '经常' | '必须';
    flexibility: '完全弹性' | '弹性打卡' | '固定时间' | '996';
  };
  growth: {
    promotionCycle: string;
    training: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

const mockOffers: Offer[] = [
  {
    id: 1,
    company: '美团',
    position: '前端开发工程师',
    baseSalary: 28000,
    bonus: 3,
    city: '北京',
    benefits: {
      housing: 2000,
      meal: 500,
      transport: 0,
      annualLeave: 10,
      housingFund: 12,
    },
    workLife: {
      avgHours: 9,
      weekendWork: '偶尔',
      flexibility: '弹性打卡',
    },
    growth: {
      promotionCycle: '1-2年',
      training: '完善的应届生培训体系',
    },
    status: 'pending',
  },
  {
    id: 2,
    company: '字节跳动',
    position: '前端开发',
    baseSalary: 35000,
    bonus: 2,
    stock: 150000,
    signingBonus: 30000,
    city: '北京',
    benefits: {
      housing: 1500,
      meal: 800,
      transport: 500,
      annualLeave: 7,
      housingFund: 10,
    },
    workLife: {
      avgHours: 11,
      weekendWork: '经常',
      flexibility: '弹性打卡',
    },
    growth: {
      promotionCycle: '半年-1年',
      training: '字节范学院',
    },
    status: 'pending',
  },
  {
    id: 3,
    company: '腾讯',
    position: 'Web前端开发',
    baseSalary: 30000,
    bonus: 4,
    stock: 100000,
    city: '深圳',
    benefits: {
      housing: 3000,
      meal: 600,
      transport: 300,
      annualLeave: 15,
      housingFund: 12,
    },
    workLife: {
      avgHours: 9.5,
      weekendWork: '偶尔',
      flexibility: '完全弹性',
    },
    growth: {
      promotionCycle: '1-2年',
      training: '腾讯学堂',
    },
    status: 'pending',
  },
];

// 城市生活成本估算（元/月）
const cityCosts: Record<string, { rent: number; meal: number; transport: number }> = {
  '北京': { rent: 4000, meal: 2000, transport: 400 },
  '上海': { rent: 4500, meal: 2100, transport: 350 },
  '深圳': { rent: 4500, meal: 2000, transport: 300 },
  '杭州': { rent: 3500, meal: 1800, transport: 300 },
  '广州': { rent: 3000, meal: 1800, transport: 250 },
};

// 五险一金计算（简化版）
const calculateAfterTax = (monthlySalary: number, housingFundRate: number) => {
  const taxableIncome = monthlySalary * (1 - housingFundRate / 100 - 0.105); // 扣除五险一金
  // 个税简化计算
  const annualTaxable = taxableIncome * 12;
  let tax = 0;
  if (annualTaxable > 36000) tax = annualTaxable * 0.03 - 2520;
  if (annualTaxable > 144000) tax = annualTaxable * 0.1 - 16920;
  if (annualTaxable > 300000) tax = annualTaxable * 0.2 - 31920;
  return (taxableIncome - tax / 12);
};

const calculateAnnualPackage = (offer: Offer) => {
  const base = offer.baseSalary * 12;
  const bonus = offer.bonus ? offer.baseSalary * offer.bonus : 0;
  const stock = offer.stock || 0;
  const signing = offer.signingBonus || 0;
  return base + bonus + stock + signing;
};

export default function OfferPage() {
  const [offers, setOffers] = useState(mockOffers);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'compare' | 'calculator'>('list');

  const toggleOfferSelection = (id: number) => {
    if (selectedOffers.includes(id)) {
      setSelectedOffers(selectedOffers.filter((o) => o !== id));
    } else if (selectedOffers.length < 4) {
      setSelectedOffers([...selectedOffers, id]);
    }
  };

  const selectedOffersData = offers.filter((o) => selectedOffers.includes(o.id));

  return (
    <AppLayout>
      <Header
        title="Offer 对比"
        subtitle="多维度对比Offer，做出最优选择"
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'list'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📋 列表
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'compare'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📊 对比
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'calculator'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                🧮 城市成本
              </button>
            </div>
            <Button onClick={() => setCompareMode(!compareMode)}>
              {compareMode ? '取消选择' : '＋ 添加Offer'}
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`
                  bg-[var(--surface)] rounded-2xl p-6 shadow-sm border-2 transition-smooth cursor-pointer
                  ${selectedOffers.includes(offer.id) ? 'border-[var(--primary)]' : 'border-transparent hover:border-[var(--border)]'}
                `}
                onClick={() => compareMode && toggleOfferSelection(offer.id)}
              >
                {/* 头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">
                      {offer.company}
                    </h3>
                    <p className="text-sm text-[var(--foreground-light)]">
                      {offer.position} · {offer.city}
                    </p>
                  </div>
                  {compareMode && (
                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${selectedOffers.includes(offer.id)
                          ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                          : 'border-[var(--border)]'
                        }
                      `}
                    >
                      {selectedOffers.includes(offer.id) && '✓'}
                    </div>
                  )}
                </div>

                {/* 年包 */}
                <div className="bg-[var(--primary)]/10 rounded-xl p-4 mb-4">
                  <p className="text-sm text-[var(--foreground-muted)]">总包（首年）</p>
                  <p className="text-3xl font-bold text-[var(--primary)]">
                    ¥{(calculateAnnualPackage(offer) / 10000).toFixed(1)}万
                  </p>
                </div>

                {/* 薪资结构 */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground-light)]">月薪</span>
                    <span className="text-[var(--foreground)]">¥{(offer.baseSalary / 1000).toFixed(0)}k</span>
                  </div>
                  {offer.bonus && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--foreground-light)]">年终奖</span>
                      <span className="text-[var(--foreground)]">{offer.bonus}个月</span>
                    </div>
                  )}
                  {offer.stock && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--foreground-light)]">股票</span>
                      <span className="text-[var(--foreground)]">¥{(offer.stock / 10000).toFixed(1)}万</span>
                    </div>
                  )}
                </div>

                {/* 福利 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-[var(--muted)] text-xs text-[var(--foreground-light)]">
                    🏠 房补 ¥{offer.benefits.housing}
                  </span>
                  <span className="px-2 py-1 rounded bg-[var(--muted)] text-xs text-[var(--foreground-light)]">
                    🍜 餐补 ¥{offer.benefits.meal}
                  </span>
                  <span className="px-2 py-1 rounded bg-[var(--muted)] text-xs text-[var(--foreground-light)]">
                    📅 年假 {offer.benefits.annualLeave}天
                  </span>
                </div>

                {/* 工作强度 */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--foreground-light)]">日均工时</span>
                    <span className={offer.workLife.avgHours > 10 ? 'text-[var(--error)]' : 'text-[var(--foreground)]'}>
                      {offer.workLife.avgHours}h
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground-light)]">工作制度</span>
                    <span className="text-[var(--foreground)]">{offer.workLife.flexibility}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 添加新Offer卡片 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-3xl mb-4">
                ➕
              </div>
              <p className="text-[var(--foreground-light)] font-medium">添加新Offer</p>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            {selectedOffers.length < 2 ? (
              <div className="text-center py-12">
                <p className="text-[var(--foreground-muted)] mb-4">
                  请至少选择 2 个 Offer 进行对比
                </p>
                <Button onClick={() => setActiveTab('list')}>去选择</Button>
              </div>
            ) : (
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground-muted)] w-32">
                        对比项
                      </th>
                      {selectedOffersData.map((offer) => (
                        <th key={offer.id} className="text-center py-3 px-4">
                          <span className="text-lg font-semibold text-[var(--foreground)]">
                            {offer.company}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 总包 */}
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">总包（首年）</td>
                      {selectedOffersData.map((offer) => (
                        <td key={offer.id} className="py-3 px-4 text-center">
                          <span className="text-xl font-bold text-[var(--primary)]">
                            ¥{(calculateAnnualPackage(offer) / 10000).toFixed(1)}万
                          </span>
                        </td>
                      ))}
                    </tr>
                    {/* 月薪 */}
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">月薪</td>
                      {selectedOffersData.map((offer) => (
                        <td key={offer.id} className="py-3 px-4 text-center">
                          ¥{(offer.baseSalary / 1000).toFixed(0)}k
                        </td>
                      ))}
                    </tr>
                    {/* 税后月收入 */}
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">税后月薪</td>
                      {selectedOffersData.map((offer) => {
                        const afterTax = calculateAfterTax(offer.baseSalary, offer.benefits.housingFund);
                        return (
                          <td key={offer.id} className="py-3 px-4 text-center">
                            ¥{(afterTax / 1000).toFixed(1)}k
                          </td>
                        );
                      })}
                    </tr>
                    {/* 城市 */}
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">城市</td>
                      {selectedOffersData.map((offer) => (
                        <td key={offer.id} className="py-3 px-4 text-center">
                          {offer.city}
                        </td>
                      ))}
                    </tr>
                    {/* 日均工时 */}
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">日均工时</td>
                      {selectedOffersData.map((offer) => (
                        <td key={offer.id} className="py-3 px-4 text-center">
                          <span className={offer.workLife.avgHours > 10 ? 'text-[var(--error)]' : 'text-[var(--success)]'}>
                            {offer.workLife.avgHours}h
                          </span>
                        </td>
                      ))}
                    </tr>
                    {/* 晋升周期 */}
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">晋升周期</td>
                      {selectedOffersData.map((offer) => (
                        <td key={offer.id} className="py-3 px-4 text-center">
                          {offer.growth.promotionCycle}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>

                {/* AI 推荐 */}
                <div className="mt-6 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <p className="font-semibold">AI 分析</p>
                      <p className="text-sm text-white/80">
                        综合薪资、工作生活平衡、发展前景，你目前的选择倾向是...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                🧮 城市生活成本计算器
              </h3>
              <p className="text-[var(--foreground-light)] mb-6">
                不同城市的薪资不能直接对比，扣除生活成本后的实际可支配收入才是关键。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(cityCosts).map(([city, costs]) => (
                  <div key={city} className="bg-[var(--muted)] rounded-xl p-4">
                    <h4 className="font-semibold text-[var(--foreground)] mb-3">{city}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-light)]">租房（合租）</span>
                        <span className="text-[var(--foreground)]">¥{costs.rent}/月</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-light)]">餐饮</span>
                        <span className="text-[var(--foreground)]">¥{costs.meal}/月</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-light)]">交通</span>
                        <span className="text-[var(--foreground)]">¥{costs.transport}/月</span>
                      </div>
                      <div className="pt-2 border-t border-[var(--border)] flex justify-between font-semibold">
                        <span className="text-[var(--foreground)]">固定支出</span>
                        <span className="text-[var(--error)]">
                          ¥{(costs.rent + costs.meal + costs.transport)}/月
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
