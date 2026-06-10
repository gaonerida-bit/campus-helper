'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useOffers, Offer as AppOffer } from '@/context/DataContext';

const cityCosts: Record<string, { rent: number; meal: number; transport: number }> = {
  '北京': { rent: 4000, meal: 2000, transport: 400 },
  '上海': { rent: 4500, meal: 2100, transport: 350 },
  '深圳': { rent: 4500, meal: 2000, transport: 300 },
  '杭州': { rent: 3500, meal: 1800, transport: 300 },
  '广州': { rent: 3000, meal: 1800, transport: 250 },
};

// 添加Offer表单
function AddOfferForm({ onSubmit, onCancel }: { onSubmit: (data: Omit<AppOffer, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    baseSalary: '',
    bonus: '',
    stock: '',
    location: '北京',
  });

  const handleSubmit = () => {
    if (!formData.company || !formData.baseSalary) {
      alert('请填写公司和薪资');
      return;
    }
    onSubmit({
      company: formData.company,
      position: formData.position,
      salary: {
        base: parseInt(formData.baseSalary),
        bonus: formData.bonus ? parseInt(formData.bonus) : undefined,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
      },
      location: formData.location,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">公司名称 *</label>
          <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="如：字节跳动" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位</label>
          <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="如：前端开发" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">月薪 *</label>
          <input type="number" value={formData.baseSalary} onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="28000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">城市</label>
          <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]">
            {Object.keys(cityCosts).map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">年终奖(月)</label>
          <input type="number" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="3" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">股票/期权价值</label>
        <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="100000" />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">添加Offer</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// 计算年薪
const calculateAnnualPackage = (offer: AppOffer) => {
  const base = offer.salary.base * 12;
  const bonus = offer.salary.bonus ? offer.salary.base * offer.salary.bonus : 0;
  const stock = offer.salary.stock || 0;
  return base + bonus + stock;
};

// 计算税后月薪
const calculateAfterTax = (monthlySalary: number) => {
  const taxableIncome = monthlySalary * (1 - 0.12 - 0.105); // 公积金12% + 社保10.5%
  const annualTaxable = taxableIncome * 12;
  let tax = 0;
  if (annualTaxable > 36000) tax = annualTaxable * 0.03 - 2520;
  if (annualTaxable > 144000) tax = annualTaxable * 0.1 - 16920;
  if (annualTaxable > 300000) tax = annualTaxable * 0.2 - 31920;
  return taxableIncome - tax / 12;
};

export default function OfferPage() {
  const { offers, add: addOffer } = useOffers();
  const [compareMode, setCompareMode] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'compare' | 'calculator'>('list');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const toggleOfferSelection = (id: string) => {
    if (selectedOffers.includes(id)) {
      setSelectedOffers(selectedOffers.filter((o) => o !== id));
    } else if (selectedOffers.length < 4) {
      setSelectedOffers([...selectedOffers, id]);
    }
  };

  const selectedOffersData = offers.filter((o) => selectedOffers.includes(o.id));

  const handleAddOffer = (data: Omit<AppOffer, 'id' | 'createdAt'>) => {
    addOffer(data);
    setIsAddOpen(false);
  };

  const getAIAnalysis = () => {
    if (selectedOffersData.length < 2) return null;
    const sorted = [...selectedOffersData].sort((a, b) => calculateAnnualPackage(b) - calculateAnnualPackage(a));
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const diff = ((calculateAnnualPackage(highest) - calculateAnnualPackage(lowest)) / 10000).toFixed(1);

    return {
      highestSalary: highest,
      lowestSalary: lowest,
      diff,
      recommendation: `${highest.company} 总包最高`,
    };
  };

  const aiAnalysis = getAIAnalysis();

  return (
    <AppLayout>
      <Header
        title="Offer 对比"
        subtitle={`${offers.length} 个Offer · 可对比 ${offers.length >= 2 ? '✓' : '需添加更多'}`}
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${activeTab === 'list' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>📋 列表</button>
              <button onClick={() => setActiveTab('compare')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${activeTab === 'compare' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>📊 对比</button>
              <button onClick={() => setActiveTab('calculator')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${activeTab === 'calculator' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>🧮 城市</button>
            </div>
            <Button onClick={() => setIsAddOpen(true)}>＋ 添加Offer</Button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className={`bg-[var(--surface)] rounded-2xl p-6 shadow-sm border-2 transition-smooth cursor-pointer ${selectedOffers.includes(offer.id) ? 'border-[var(--primary)]' : 'border-transparent hover:border-[var(--border)]'}`} onClick={() => { if (compareMode) toggleOfferSelection(offer.id); }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{offer.company}</h3>
                    <p className="text-sm text-[var(--foreground-light)]">{offer.position} · {offer.location}</p>
                  </div>
                  {compareMode && (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOffers.includes(offer.id) ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-[var(--border)]'}`}>
                      {selectedOffers.includes(offer.id) && '✓'}
                    </div>
                  )}
                </div>
                <div className="bg-[var(--primary)]/10 rounded-xl p-4 mb-4">
                  <p className="text-sm text-[var(--foreground-muted)]">总包（首年）</p>
                  <p className="text-3xl font-bold text-[var(--primary)]">¥{(calculateAnnualPackage(offer) / 10000).toFixed(1)}万</p>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-[var(--foreground-light)]">月薪</span><span className="text-[var(--foreground)]">¥{(offer.salary.base / 1000).toFixed(0)}k</span></div>
                  {offer.salary.bonus && <div className="flex justify-between text-sm"><span className="text-[var(--foreground-light)]">年终奖</span><span className="text-[var(--foreground)]">{offer.salary.bonus}个月</span></div>}
                  {offer.salary.stock && <div className="flex justify-between text-sm"><span className="text-[var(--foreground-light)]">股票</span><span className="text-[var(--foreground)]">¥{(offer.salary.stock / 10000).toFixed(1)}万</span></div>}
                </div>
                {offer.benefits && offer.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {offer.benefits.map((benefit, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-[var(--muted)] text-xs text-[var(--foreground-light)]">{benefit}</span>
                    ))}
                  </div>
                )}
                {offer.notes && <p className="mt-3 text-xs text-[var(--foreground-muted)] bg-[var(--muted)] rounded-lg px-3 py-2">📝 {offer.notes}</p>}
              </div>
            ))}
            <div onClick={() => setIsAddOpen(true)} className="bg-[var(--surface)] rounded-2xl p-6 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-3xl mb-4">➕</div>
              <p className="text-[var(--foreground-light)] font-medium">添加新Offer</p>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            {selectedOffers.length < 2 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-[var(--foreground-muted)] mb-4">请至少选择 2 个 Offer 进行对比</p>
                <Button onClick={() => setActiveTab('list')}>去选择</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground-muted)] w-32">对比项</th>
                        {selectedOffersData.map((offer) => (
                          <th key={offer.id} className="text-center py-3 px-4">
                            <span className="text-lg font-semibold text-[var(--foreground)]">{offer.company}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)] bg-[var(--primary)]/5">
                        <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">总包（首年）</td>
                        {selectedOffersData.map((offer) => (
                          <td key={offer.id} className="py-3 px-4 text-center"><span className="text-xl font-bold text-[var(--primary)]">¥{(calculateAnnualPackage(offer) / 10000).toFixed(1)}万</span></td>
                        ))}
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">月薪</td>
                        {selectedOffersData.map((offer) => <td key={offer.id} className="py-3 px-4 text-center">¥{(offer.salary.base / 1000).toFixed(0)}k</td>)}
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">税后月薪</td>
                        {selectedOffersData.map((offer) => <td key={offer.id} className="py-3 px-4 text-center">¥{(calculateAfterTax(offer.salary.base) / 1000).toFixed(1)}k</td>)}
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">城市</td>
                        {selectedOffersData.map((offer) => <td key={offer.id} className="py-3 px-4 text-center">{offer.location}</td>)}
                      </tr>
                      {selectedOffersData.some(o => o.salary?.bonus) && (
                        <tr className="border-b border-[var(--border)]">
                          <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">年终奖</td>
                          {selectedOffersData.map((o) => <td key={o.id} className="py-3 px-4 text-center">{o.salary?.bonus || '-'}个月</td>)}
                        </tr>
                      )}
                      {selectedOffersData.some(o => o.salary?.stock) && (
                        <tr className="border-b border-[var(--border)]">
                          <td className="py-3 px-4 text-sm text-[var(--foreground-muted)]">股票</td>
                          {selectedOffersData.map((o) => <td key={o.id} className="py-3 px-4 text-center">{o.salary?.stock ? `¥${(o.salary.stock / 10000).toFixed(1)}万` : '-'}</td>)}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {aiAnalysis && (
                  <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🤖</span>
                      <div>
                        <p className="font-semibold text-lg">AI 分析报告</p>
                        <p className="text-white/80 text-sm">基于薪资、工作生活平衡、发展前景综合分析</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-white/70 text-sm mb-1">最高薪资</p>
                        <p className="font-semibold">{aiAnalysis.highestSalary.company}</p>
                        <p className="text-2xl font-bold">¥{(calculateAnnualPackage(aiAnalysis.highestSalary) / 10000).toFixed(1)}万</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-white/70 text-sm mb-1">薪资差距</p>
                        <p className="font-semibold">最高与最低相差</p>
                        <p className="text-2xl font-bold">{aiAnalysis.diff}万</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-white/10 rounded-xl p-4">
                      <p className="text-sm text-white/70 mb-1">💡 综合建议</p>
                      <p className="font-medium">{aiAnalysis.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">🧮 城市生活成本计算器</h3>
              <p className="text-[var(--foreground-light)] mb-6">不同城市的薪资不能直接对比，扣除生活成本后的实际可支配收入才是关键。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(cityCosts).map(([city, costs]) => {
                  const total = costs.rent + costs.meal + costs.transport;
                  return (
                    <div key={city} className="bg-[var(--muted)] rounded-xl p-4">
                      <h4 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2"><span className="text-xl">🏙️</span> {city}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[var(--foreground-light)]">租房（合租）</span><span className="text-[var(--foreground)]">¥{costs.rent}/月</span></div>
                        <div className="flex justify-between"><span className="text-[var(--foreground-light)]">餐饮</span><span className="text-[var(--foreground)]">¥{costs.meal}/月</span></div>
                        <div className="flex justify-between"><span className="text-[var(--foreground-light)]">交通</span><span className="text-[var(--foreground)]">¥{costs.transport}/月</span></div>
                        <div className="pt-2 border-t border-[var(--border)] flex justify-between font-semibold">
                          <span className="text-[var(--foreground)]">固定支出</span>
                          <span className="text-red-500">¥{total}/月 (¥{total * 12}/年)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加Offer</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
            </div>
            <div className="p-6"><AddOfferForm onSubmit={handleAddOffer} onCancel={() => setIsAddOpen(false)} /></div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
