import React, { useState } from 'react';
import { CATEGORY_EXPENSES_BREAKDOWN, LAST_7_DAYS_TREND, MONTHLY_BUDGET } from '../data/mockData';

interface AnalyticsViewProps {
  onOpenMonthPicker: () => void;
  selectedMonth: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onOpenMonthPicker, selectedMonth }) => {
  const [timeScope, setTimeScope] = useState<'周' | '月' | '年' | '自定义'>('月');
  const [viewType, setViewType] = useState<'amount' | 'percent'>('amount');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    餐饮美食: false,
    居家日用: false,
  });
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  const toggleCategoryExpand = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const activeCategory = CATEGORY_EXPENSES_BREAKDOWN[activeCategoryIndex] || CATEGORY_EXPENSES_BREAKDOWN[0];
  const monthExpenseTotal = CATEGORY_EXPENSES_BREAKDOWN.reduce((sum, c) => sum + c.amount, 0);
  const monthBudgetRemaining = Math.max(MONTHLY_BUDGET - monthExpenseTotal, 0);
  const monthDailyAverage = monthExpenseTotal / 31;

  return (
    <div className="flex flex-col w-full px-4 pb-8 space-y-4">
      {/* Time Segment Selector & Month Selector Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-full">
          {(['周', '月', '年', '自定义'] as const).map((scope) => (
            <button
              key={scope}
              onClick={() => setTimeScope(scope)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all duration-150 ${
                timeScope === scope
                  ? 'bg-white text-[#0b1c30] shadow-xs font-semibold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenMonthPicker}
          aria-label="切换月份"
          className="flex items-center gap-1 bg-[#eff4ff] px-3 py-1.5 rounded-full text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
        >
          <span className="text-[12px] font-semibold tracking-tight">{selectedMonth}</span>
          <span className="material-symbols-outlined text-[16px] text-[#45464d]">keyboard_arrow_down</span>
        </button>
      </div>

      {/* Spending Summary Card */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#45464d] uppercase tracking-wider">当月总支出</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[18px] text-[#0b1c30] font-normal">¥</span>
              <span className="text-[32px] leading-10 font-bold text-[#0b1c30] tracking-tight tabular-nums">
                {monthExpenseTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#6cf8bb]/40 text-[#00714d] px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            <span className="text-[11px] font-semibold">-12.4% 较上月</span>
          </div>
        </div>

        <div className="mt-4 pt-3 bg-[#eff4ff]/60 -mx-4 -mb-4 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
            <span className="text-[13px] text-[#45464d]">日均支出</span>
            <span className="text-[14px] text-[#0b1c30] font-semibold tabular-nums">¥{monthDailyAverage.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#565e74]" />
            <span className="text-[13px] text-[#45464d]">预算剩余</span>
            <span className="text-[14px] text-[#0b1c30] font-semibold tabular-nums">¥{monthBudgetRemaining.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Donut Distribution Chart Section */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#0b1c30]">支出分类分布</h2>
            <span className="text-[11px] bg-[#e5eeff] px-2 py-0.5 rounded-full text-[#45464d]">共 83 笔</span>
          </div>
          <button
            id="toggle-view-type"
            onClick={() => setViewType(viewType === 'amount' ? 'percent' : 'amount')}
            className="text-[11px] text-[#45464d] flex items-center gap-0.5 hover:text-[#0b1c30] transition-colors"
          >
            <span>{viewType === 'amount' ? '金额视图' : '百分比'}</span>
            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
          {/* Interactive SVG Donut Chart */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Base background circle */}
              <circle cx="60" cy="60" fill="transparent" r="46" stroke="#eff4ff" strokeWidth="12" />

              {/* Segment 1: 餐饮美食 42% (circumference ~ 289.02, length ~ 121.38) */}
              <circle
                onClick={() => setActiveCategoryIndex(0)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#0b1c30"
                strokeDasharray="121.38 289.02"
                strokeDashoffset="0"
                strokeWidth={activeCategoryIndex === 0 ? '14' : '12'}
              />

              {/* Segment 2: 居家日用 24% (length ~ 69.36) */}
              <circle
                onClick={() => setActiveCategoryIndex(1)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#006c49"
                strokeDasharray="69.36 289.02"
                strokeDashoffset="-123.38"
                strokeWidth={activeCategoryIndex === 1 ? '14' : '12'}
              />

              {/* Segment 3: 数码数娱 18% (length ~ 52.02) */}
              <circle
                onClick={() => setActiveCategoryIndex(2)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#565e74"
                strokeDasharray="52.02 289.02"
                strokeDashoffset="-194.74"
                strokeWidth={activeCategoryIndex === 2 ? '14' : '12'}
              />

              {/* Segment 4: 交通出行 10% (length ~ 28.9) */}
              <circle
                onClick={() => setActiveCategoryIndex(3)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#8da0c0"
                strokeDasharray="28.9 289.02"
                strokeDashoffset="-248.76"
                strokeWidth={activeCategoryIndex === 3 ? '14' : '12'}
              />

              {/* Segment 5: 其他 6% (length ~ 17.34) */}
              <circle
                onClick={() => setActiveCategoryIndex(4)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#c6c6cd"
                strokeDasharray="17.34 289.02"
                strokeDashoffset="-279.66"
                strokeWidth={activeCategoryIndex === 4 ? '14' : '12'}
              />
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-[#45464d]">首要支出</span>
              <span className="text-[16px] font-bold text-[#0b1c30]">{activeCategory.name}</span>
              <span className="text-[12px] text-[#45464d] font-medium">{activeCategory.percent}%</span>
            </div>
          </div>

          {/* Legend Pills Grid */}
          <div className="flex flex-col gap-1.5 w-full">
            {CATEGORY_EXPENSES_BREAKDOWN.map((cat, idx) => {
              const isSelected = activeCategoryIndex === idx;
              return (
                <div
                  key={cat.name}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#eff4ff]' : 'hover:bg-[#eff4ff]/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-[13px] text-[#0b1c30] font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#45464d]">{cat.percent}%</span>
                    <span className="text-[12px] font-semibold text-[#0b1c30] tabular-nums">
                      ¥{cat.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spending Trend Sparkline & Bars Section */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-semibold text-[#0b1c30]">近7天支出趋势</h2>
            <span className="text-[11px] text-[#45464d]">峰值集中在周末家庭聚餐与购物</span>
          </div>
          <div className="flex items-center gap-1 bg-[#eff4ff] px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
            <span className="text-[11px] text-[#45464d]">峰值 10/21: ¥682</span>
          </div>
        </div>

        {/* Histogram & Trend Area Chart */}
        <div className="pt-2 pb-1 flex flex-col">
          <div className="h-32 w-full flex items-end justify-between gap-2 px-1">
            {LAST_7_DAYS_TREND.map((bar, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div
                  key={bar.date}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                >
                  <span
                    className={`text-[11px] transition-opacity tabular-nums ${
                      bar.isPeak || isHovered
                        ? 'opacity-100 font-semibold text-[#0b1c30]'
                        : 'opacity-0 text-[#45464d]'
                    }`}
                  >
                    ¥{bar.amount}
                  </span>

                  <div
                    className={`w-full rounded-t-lg relative transition-all ${
                      bar.isPeak
                        ? 'bg-black shadow-xs'
                        : isHovered
                        ? 'bg-black'
                        : 'bg-[#e5eeff] hover:bg-black'
                    }`}
                    style={{ height: bar.height }}
                  >
                    {bar.isPeak && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#6ffbbe]" />
                    )}
                  </div>

                  <span
                    className={`text-[11px] tabular-nums ${
                      bar.isPeak ? 'font-semibold text-[#0b1c30]' : 'text-[#45464d]'
                    }`}
                  >
                    {bar.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spending Leaderboard List */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-[18px] font-semibold text-[#0b1c30]">支出分类排行</h2>
          <span className="text-[11px] text-[#45464d]">按金额降序</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {CATEGORY_EXPENSES_BREAKDOWN.map((cat) => {
            const isExpanded = !!expandedCategories[cat.name];
            return (
              <div
                key={cat.name}
                onClick={() => toggleCategoryExpand(cat.name)}
                className="group rounded-xl p-2.5 hover:bg-[#eff4ff]/60 transition-all cursor-pointer border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[#0b1c30]">{cat.name}</span>
                      <span className="text-[11px] text-[#45464d]">
                        {cat.count} 笔消费 · 均笔 ¥{cat.avg.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-semibold text-[#0b1c30] tabular-nums">
                      ¥{cat.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-[#45464d]">{cat.percent}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#e5eeff] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>

                {/* Expandable Sub-details Drawer */}
                {isExpanded && cat.subDetails && (
                  <div className="pt-3 mt-2 grid grid-cols-2 gap-2 text-[#45464d] text-[13px] animate-fadeIn">
                    {cat.subDetails.map((sub) => (
                      <div
                        key={sub.name}
                        className="bg-[#f8f9ff] p-2 rounded-lg flex justify-between border border-slate-100"
                      >
                        <span>{sub.name}</span>
                        <span className="font-semibold text-[#0b1c30] tabular-nums">¥{sub.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mindful Finance Insight Tip Pill */}
      <div className="bg-[#eff4ff]/80 rounded-xl p-4 flex items-start gap-2.5 border border-slate-100 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/40 text-[#00714d] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px]">spa</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-[#0b1c30]">清流心境洞察</span>
          <p className="text-[13px] text-[#45464d] mt-0.5 leading-relaxed">
            十月餐饮支出占比超 40%，外卖消费占其中近半。下月若尝试每周减少一次外卖并自制简餐，预计可轻松结余约 ¥400.00。
          </p>
        </div>
      </div>
    </div>
  );
};
