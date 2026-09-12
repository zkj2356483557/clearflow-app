import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { MONTHLY_BUDGET } from '../data/mockData';

interface TimelineViewProps {
  transactions: Transaction[];
  selectedMonth: string;
  onOpenSearch: () => void;
  onOpenCalendar: () => void;
  onOpenMonthPicker: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  transactions,
  onOpenSearch,
  onOpenCalendar,
  onOpenMonthPicker,
  selectedMonth,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filterOptions = [
    { key: 'all', label: '全部' },
    { key: '餐饮美食', label: '餐饮美食' },
    { key: '日常杂货', label: '日常杂货' },
    { key: '交通出行', label: '交通出行' },
    { key: '数码数娱', label: '休闲娱乐' },
    { key: '薪资理财', label: '薪资副业' },
  ];

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'all') return transactions;
    return transactions.filter((tx) => tx.category === selectedFilter);
  }, [transactions, selectedFilter]);

  // Calculate totals from transactions
  const totalExpense = useMemo(() => {
    return transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;
  const budgetUsedAmount = Math.max(totalExpense, 0);
  const budgetUsedPercent = Math.min((budgetUsedAmount / MONTHLY_BUDGET) * 100, 100);
  const budgetRemaining = Math.max(MONTHLY_BUDGET - budgetUsedAmount, 0);

  // Group transactions by date
  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const tx of filteredTransactions) {
      const list = map.get(tx.date) || [];
      list.push(tx);
      map.set(tx.date, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredTransactions]);

  const getDateLabel = (dateStr: string) => {
    const today = '2024-10-24';
    const yesterday = '2024-10-23';
    if (dateStr === today) {
      return { main: '今天', sub: '10月24日 星期四' };
    }
    if (dateStr === yesterday) {
      return { main: '昨天', sub: '10月23日 星期三' };
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
    return { main: `${m}月${d}日`, sub: weekday };
  };

  return (
    <div className="flex flex-col w-full px-4 pb-8 space-y-4">
      {/* Month Switcher & Minimalist Atmosphere Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div
          id="month-picker-trigger"
          onClick={onOpenMonthPicker}
          className="flex items-center gap-2 cursor-pointer select-none py-1 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-[19px] text-label tracking-tight font-semibold">{selectedMonth}</span>
            <span className="material-symbols-rounded text-[20px] text-label-2">expand_more</span>
          </div>
          <span className="glass glass-thin rounded-full px-2.5 py-1 text-[11px] font-medium text-ios-green-ink">
            本月进行中
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="timeline-search-btn"
            aria-label="搜索账目"
            onClick={onOpenSearch}
            className="glass glass-thin w-9 h-9 rounded-full flex items-center justify-center text-label-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-rounded text-[19px]">search</span>
          </button>
          <button
            id="timeline-calendar-btn"
            aria-label="日历视图"
            onClick={onOpenCalendar}
            className="glass glass-thin w-9 h-9 rounded-full flex items-center justify-center text-label-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-rounded text-[19px]">calendar_month</span>
          </button>
        </div>
      </div>

      {/* Hero overview card */}
      <div className="glass rounded-[28px] p-5 overflow-hidden">
        {/* Ambient colour bleeding through the glass */}
        <div className="absolute -right-10 -top-12 w-36 h-36 rounded-full bg-ios-blue/30 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-14 w-32 h-32 rounded-full bg-ios-green/25 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col space-y-4">
          {/* Balance Group */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-label-2 font-normal">10月净结余</span>
              <div className="glass glass-thin flex items-center gap-1 text-ios-green-ink text-[11px] font-medium px-2 py-0.5 rounded-full">
                <span className="material-symbols-rounded text-[14px]">trending_up</span>
                <span>较上月环比 +8.4%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-medium text-label">¥</span>
              <span className="text-[32px] leading-10 font-bold text-label tracking-tight tabular-nums">
                {netBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Linear Budget Meter */}
          <div className="flex flex-col space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] text-label-2">
              <span>月度预算已用 {budgetUsedPercent.toFixed(1)}%</span>
              <span>
                剩余额度 ¥
                {budgetRemaining.toLocaleString('zh-CN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-full h-2 bg-white/55 rounded-full overflow-hidden flex shadow-[inset_0_1px_2px_rgba(14,32,70,0.08)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#5ab0ff,#007aff)] transition-all duration-500 shadow-[0_0_10px_rgba(0,122,255,0.5)]"
                style={{ width: `${budgetUsedPercent}%` }}
              />
            </div>
          </div>

          {/* Income & Outflow Split Sub-cards */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Outflow */}
            <div className="glass glass-soft rounded-[20px] p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-ios-red/15 flex items-center justify-center text-ios-red-ink">
                  <span className="material-symbols-rounded text-[15px]">arrow_upward</span>
                </span>
                <span className="text-[12px] text-label-2">总支出</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[11px] text-label font-medium">¥</span>
                <span className="text-[18px] font-semibold text-label tabular-nums">
                  {totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Inflow */}
            <div className="glass glass-soft rounded-[20px] p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-ios-green/20 flex items-center justify-center text-ios-green-ink">
                  <span className="material-symbols-rounded text-[15px]">arrow_downward</span>
                </span>
                <span className="text-[12px] text-label-2">总收入</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[11px] text-ios-green-ink font-medium">¥</span>
                <span className="text-[18px] font-semibold text-ios-green-ink tabular-nums">
                  {totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pill Carousel */}
      <div
        className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 scrollbar-none"
        id="filter-container"
      >
        {filterOptions.map((f) => {
          const isActive = selectedFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/85 text-label font-semibold shadow-[0_2px_8px_rgba(14,32,70,0.12)] ring-1 ring-white/70'
                  : 'glass glass-thin text-label-2 active:scale-95'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Timeline Flow Section */}
      <div className="flex flex-col space-y-4 pt-1">
        {groups.map(([dateStr, items]) => {
          const { main, sub } = getDateLabel(dateStr);
          const dayExpense = items.filter((i) => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
          const dayIncome = items.filter((i) => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);

          return (
            <div key={dateStr} className="flex flex-col space-y-2">
              {/* Section Date Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-label">{main}</span>
                  {sub && <span className="text-[11px] text-label-2 font-normal">{sub}</span>}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-label-2 tabular-nums font-medium">
                  {dayIncome > 0 && (
                    <span className="text-ios-green-ink">
                      收 ¥{dayIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  {dayIncome > 0 && dayExpense > 0 && <span>·</span>}
                  {dayExpense > 0 && (
                    <span>支 ¥{dayExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                  )}
                </div>
              </div>

              {/* Transaction Card Stack */}
              <div className="glass rounded-[24px] px-2 py-1.5 flex flex-col">
                {items.map((item, idx) => {
                  const isIncome = item.type === 'income';
                  return (
                    <React.Fragment key={item.id}>
                      <div
                        onClick={() => setSelectedTx(item)}
                        className="flex items-center justify-between py-2.5 px-2 cursor-pointer rounded-[18px] active:bg-white/55 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-ios-green/20 text-ios-green-ink'
                                : 'bg-white/60 text-label ring-1 ring-white/70'
                            }`}
                          >
                            <span className="material-symbols-rounded text-[19px]">
                              {item.categoryIcon || (isIncome ? 'savings' : 'shopping_bag')}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-medium text-label truncate">{item.title}</span>
                            <span className="text-[11px] text-label-2 truncate">
                              {item.note ? `${item.note} · ` : ''}
                              {item.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 pl-3">
                          <span
                            className={`text-[16px] font-semibold tabular-nums ${
                              isIncome ? 'text-ios-green-ink' : 'text-label'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {item.amount.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-label-2">{item.account}</span>
                        </div>
                      </div>
                      {idx < items.length - 1 && <div className="h-px bg-label/8 mx-3" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* End of Timeline Tranquil Note */}
      <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
        <div className="glass glass-thin w-9 h-9 rounded-full flex items-center justify-center text-label-2">
          <span className="material-symbols-rounded text-[17px]">spa</span>
        </div>
        <span className="text-[11px] text-label-2 tracking-wide">万物清流 · 认真对待每笔收支</span>
      </div>

      {/* Transaction detail sheet */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-label/25 backdrop-blur-md"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="glass glass-strong w-full max-w-md rounded-t-[34px] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] animate-sheetUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-grabber mx-auto" />

            <div className="flex items-center justify-between pt-4">
              <span className="text-[12px] text-label-2">交易详情</span>
              <button
                onClick={() => setSelectedTx(null)}
                aria-label="关闭"
                className="glass glass-thin w-8 h-8 rounded-full flex items-center justify-center text-label-2 active:scale-95 transition-transform"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center py-4 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  selectedTx.type === 'income'
                    ? 'bg-ios-green/20 text-ios-green-ink'
                    : 'bg-white/60 text-label ring-1 ring-white/70'
                }`}
              >
                <span className="material-symbols-rounded text-[30px]">{selectedTx.categoryIcon}</span>
              </div>
              <h3 className="text-[18px] font-semibold text-label">{selectedTx.title}</h3>
              <p
                className={`text-[30px] font-bold tabular-nums mt-1 tracking-tight ${
                  selectedTx.type === 'income' ? 'text-ios-green-ink' : 'text-label'
                }`}
              >
                {selectedTx.type === 'income' ? '+' : '-'}¥{selectedTx.amount.toFixed(2)}
              </p>
            </div>

            <div className="glass glass-soft rounded-[18px] p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-label-2">分类</span>
                <span className="font-medium text-label">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-2">支付方式</span>
                <span className="font-medium text-label">{selectedTx.account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-2">日期时间</span>
                <span className="font-medium text-label">
                  {selectedTx.date} {selectedTx.time}
                </span>
              </div>
              {selectedTx.note && (
                <div className="flex justify-between">
                  <span className="text-label-2">备注</span>
                  <span className="font-medium text-label">{selectedTx.note}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full mt-4 py-3 rounded-[18px] text-white text-[15px] font-semibold bg-[linear-gradient(180deg,#4aa4ff,#007aff)] ring-1 ring-white/40 shadow-[0_12px_26px_-10px_rgba(0,122,255,0.7)] active:scale-[0.98] transition-transform"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
