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
        <div className="glass glass-soft flex items-center gap-1 p-1 rounded-full">
          {(['周', '月', '年', '自定义'] as const).map((scope) => (
            <button
              key={scope}
              onClick={() => setTimeScope(scope)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all duration-200 ${
                timeScope === scope
                  ? 'bg-white/90 text-label font-semibold shadow-[0_2px_6px_rgba(14,32,70,0.14)] ring-1 ring-white/70'
                  : 'text-label-2 active:scale-95'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenMonthPicker}
          aria-label="切换月份"
          className="glass glass-thin flex items-center gap-1 px-3 py-1.5 rounded-full text-label active:scale-95 transition-transform"
        >
          <span className="text-[12px] font-semibold tracking-tight">{selectedMonth}</span>
          <span className="material-symbols-rounded text-[17px] text-label-2">keyboard_arrow_down</span>
        </button>
      </div>

      {/* Spending Summary Card */}
      <div className="glass rounded-[28px] p-4 overflow-hidden">
        <div className="absolute -right-10 -top-12 w-32 h-32 rounded-full bg-ios-orange/20 blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-label-2 uppercase tracking-wider">当月总支出</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[18px] text-label font-normal">¥</span>
              <span className="text-[32px] leading-10 font-bold text-label tracking-tight tabular-nums">
                {monthExpenseTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="glass glass-thin flex items-center gap-1 text-ios-green-ink px-2.5 py-1 rounded-full">
            <span className="material-symbols-rounded text-[15px]">arrow_downward</span>
            <span className="text-[11px] font-semibold">-12.4% 较上月</span>
          </div>
        </div>

        <div className="glass glass-soft relative mt-4 -mx-4 -mb-4 px-4 py-3 flex items-center justify-between rounded-t-none border-x-0 border-b-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ios-blue" />
            <span className="text-[13px] text-label-2">日均支出</span>
            <span className="text-[14px] text-label font-semibold tabular-nums">
              ¥
              {monthDailyAverage.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ios-green" />
            <span className="text-[13px] text-label-2">预算剩余</span>
            <span className="text-[14px] text-label font-semibold tabular-nums">
              ¥
              {monthBudgetRemaining.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Donut Distribution Chart */}
      <div className="glass rounded-[28px] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-label">支出分类分布</h2>
            <span className="glass glass-thin text-[11px] px-2 py-0.5 rounded-full text-label-2">共 83 笔</span>
          </div>
          <button
            id="toggle-view-type"
            onClick={() => setViewType(viewType === 'amount' ? 'percent' : 'amount')}
            className="text-[11px] text-label-2 flex items-center gap-0.5 active:scale-95 transition-transform"
          >
            <span>{viewType === 'amount' ? '金额视图' : '百分比'}</span>
            <span className="material-symbols-rounded text-[16px]">swap_horiz</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
          {/* Interactive SVG Donut Chart */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Base track */}
              <circle cx="60" cy="60" fill="transparent" r="46" stroke="rgba(255,255,255,0.5)" strokeWidth="12" />

              {/* Segment 1: 餐饮美食 42% */}
              <circle
                onClick={() => setActiveCategoryIndex(0)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#007aff"
                strokeDasharray="121.38 289.02"
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth={activeCategoryIndex === 0 ? '14' : '12'}
              />

              {/* Segment 2: 居家日用 24% */}
              <circle
                onClick={() => setActiveCategoryIndex(1)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#30b0c7"
                strokeDasharray="69.36 289.02"
                strokeDashoffset="-123.38"
                strokeWidth={activeCategoryIndex === 1 ? '14' : '12'}
              />

              {/* Segment 3: 数码数娱 18% */}
              <circle
                onClick={() => setActiveCategoryIndex(2)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#af52de"
                strokeDasharray="52.02 289.02"
                strokeDashoffset="-194.74"
                strokeWidth={activeCategoryIndex === 2 ? '14' : '12'}
              />

              {/* Segment 4: 交通出行 10% */}
              <circle
                onClick={() => setActiveCategoryIndex(3)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#ff9500"
                strokeDasharray="28.9 289.02"
                strokeDashoffset="-248.76"
                strokeWidth={activeCategoryIndex === 3 ? '14' : '12'}
              />

              {/* Segment 5: 其他 6% */}
              <circle
                onClick={() => setActiveCategoryIndex(4)}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                cx="60"
                cy="60"
                fill="transparent"
                r="46"
                stroke="#8e8e93"
                strokeDasharray="17.34 289.02"
                strokeDashoffset="-279.66"
                strokeWidth={activeCategoryIndex === 4 ? '14' : '12'}
              />
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-label-2">首要支出</span>
              <span className="text-[16px] font-bold text-label">{activeCategory.name}</span>
              <span className="text-[12px] text-label-2 font-medium">{activeCategory.percent}%</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="flex flex-col gap-1.5 w-full">
            {CATEGORY_EXPENSES_BREAKDOWN.map((cat, idx) => {
              const isSelected = activeCategoryIndex === idx;
              return (
                <div
                  key={cat.name}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`flex items-center justify-between p-2 rounded-[16px] cursor-pointer transition-all ${
                    isSelected ? 'glass glass-soft' : 'hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-[13px] text-label font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-label-2">{cat.percent}%</span>
                    <span className="text-[12px] font-semibold text-label tabular-nums">
                      ¥{cat.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spending Trend Bars */}
      <div className="glass rounded-[28px] p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-semibold text-label">近7天支出趋势</h2>
            <span className="text-[11px] text-label-2">峰值集中在周末家庭聚餐与购物</span>
          </div>
          <div className="glass glass-thin flex items-center gap-1 px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-ios-blue" />
            <span className="text-[11px] text-label-2">峰值 10/21: ¥682</span>
          </div>
        </div>

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
                      bar.isPeak || isHovered ? 'opacity-100 font-semibold text-label' : 'opacity-0 text-label-2'
                    }`}
                  >
                    ¥{bar.amount}
                  </span>

                  <div
                    className={`w-full rounded-t-[10px] relative transition-all ${
                      bar.isPeak || isHovered
                        ? 'bg-[linear-gradient(180deg,#4aa4ff,#007aff)] shadow-[0_6px_18px_-6px_rgba(0,122,255,0.75)]'
                        : 'bg-white/50'
                    }`}
                    style={{ height: bar.height }}
                  >
                    {bar.isPeak && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-ios-blue" />
                    )}
                  </div>

                  <span
                    className={`text-[11px] tabular-nums ${
                      bar.isPeak ? 'font-semibold text-label' : 'text-label-2'
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

      {/* Spending Leaderboard */}
      <div className="glass rounded-[28px] p-4 flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-[18px] font-semibold text-label">支出分类排行</h2>
          <span className="text-[11px] text-label-2">按金额降序</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {CATEGORY_EXPENSES_BREAKDOWN.map((cat) => {
            const isExpanded = !!expandedCategories[cat.name];
            return (
              <div
                key={cat.name}
                onClick={() => toggleCategoryExpand(cat.name)}
                className={`group rounded-[20px] p-2.5 transition-all cursor-pointer ${
                  isExpanded ? 'glass glass-soft' : 'hover:bg-white/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                      style={{ backgroundColor: cat.color }}
                    >
                      <span className="material-symbols-rounded text-[20px]">{cat.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-label">{cat.name}</span>
                      <span className="text-[11px] text-label-2">
                        {cat.count} 笔消费 · 均笔 ¥{cat.avg.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-semibold text-label tabular-nums">
                      ¥{cat.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-label-2">{cat.percent}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/50 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>

                {/* Expandable Sub-details */}
                {isExpanded && cat.subDetails && (
                  <div className="pt-3 mt-2 grid grid-cols-2 gap-2 text-label-2 text-[13px] animate-fadeIn">
                    {cat.subDetails.map((sub) => (
                      <div
                        key={sub.name}
                        className="glass glass-soft p-2.5 rounded-[14px] flex justify-between"
                      >
                        <span>{sub.name}</span>
                        <span className="font-semibold text-label tabular-nums">¥{sub.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight Tip Pill */}
      <div className="glass rounded-[24px] p-4 flex items-start gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-full bg-ios-green/20 text-ios-green-ink flex items-center justify-center shrink-0">
          <span className="material-symbols-rounded text-[19px]">spa</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-label">清流心境洞察</span>
          <p className="text-[13px] text-label-2 mt-0.5 leading-relaxed">
            十月餐饮支出占比超 40%，外卖消费占其中近半。下月若尝试每周减少一次外卖并自制简餐，预计可轻松结余约 ¥400.00。
          </p>
        </div>
      </div>
    </div>
  );
};
