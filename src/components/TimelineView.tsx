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
    return transactions.filter(
      (tx) => tx.category === selectedFilter
    );
  }, [transactions, selectedFilter]);

  // Calculate totals from transactions
  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
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
          className="flex items-center gap-1.5 cursor-pointer group select-none py-1"
        >
          <div className="flex items-center gap-1">
            <span className="text-[18px] text-[#0b1c30] tracking-tight font-semibold">{selectedMonth}</span>
            <span className="material-symbols-outlined text-[18px] text-[#45464d] transition-transform group-hover:translate-y-0.5">
              expand_more
            </span>
          </div>
          <span className="bg-[#6cf8bb] text-[#00714d] text-[11px] px-2 py-0.5 rounded-full font-medium ml-1">
            本月进行中
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="timeline-search-btn"
            aria-label="搜索账目"
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:bg-[#eff4ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button
            id="timeline-calendar-btn"
            aria-label="日历视图"
            onClick={onOpenCalendar}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:bg-[#eff4ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card: Nordic-Japanese Serene Balance */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 relative overflow-hidden">
        {/* Ambient Graphic Motif */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#6cf8bb]/15 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col space-y-4">
          {/* Balance Group */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-[#45464d] font-normal">10月净结余</span>
              <div className="flex items-center gap-1 text-[#006c49] text-[11px] font-medium bg-[#eff4ff] px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                <span>较上月环比 +8.4%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-medium text-[#0b1c30]">¥</span>
              <span className="text-[32px] leading-10 font-bold text-[#0b1c30] tracking-tight tabular-nums">
                {netBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Linear Budget Meter */}
          <div className="flex flex-col space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#45464d]">月度预算已用 {budgetUsedPercent.toFixed(1)}%</span>
              <span className="text-[#45464d]">剩余额度 ¥{budgetRemaining.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden flex">
          <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${budgetUsedPercent}%` }} />
            </div>
          </div>

          {/* Income & Outflow Split Sub-cards */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Outflow */}
            <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#45464d]">
                  <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
                </span>
                <span className="text-[12px] text-[#45464d]">总支出</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[11px] text-[#0b1c30] font-medium">¥</span>
                <span className="text-[18px] font-semibold text-[#0b1c30] tabular-nums">
                  {totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Inflow */}
            <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#006c49]">
                  <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                </span>
                <span className="text-[12px] text-[#45464d]">总收入</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[11px] text-[#006c49] font-medium">¥</span>
                <span className="text-[18px] font-semibold text-[#006c49] tabular-nums">
                  {totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 scrollbar-none" id="filter-container">
        {filterOptions.map((f) => {
          const isActive = selectedFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]'
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
          const dayExpense = items
            .filter((i) => i.type === 'expense')
            .reduce((sum, i) => sum + i.amount, 0);
          const dayIncome = items
            .filter((i) => i.type === 'income')
            .reduce((sum, i) => sum + i.amount, 0);

          return (
            <div key={dateStr} className="flex flex-col space-y-2">
              {/* Section Date Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-[#0b1c30]">{main}</span>
                  {sub && <span className="text-[11px] text-[#45464d] font-normal">{sub}</span>}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#45464d] tabular-nums font-medium">
                  {dayIncome > 0 && <span className="text-[#006c49]">收 ¥{dayIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>}
                  {dayIncome > 0 && dayExpense > 0 && <span>·</span>}
                  {dayExpense > 0 && <span>支 ¥{dayExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>}
                </div>
              </div>

              {/* Transaction Card Stack */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-100 px-3.5 py-1 flex flex-col">
                {items.map((item, idx) => {
                  const isIncome = item.type === 'income';
                  return (
                    <React.Fragment key={item.id}>
                      <div
                        onClick={() => setSelectedTx(item)}
                        className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#eff4ff]/50 rounded-lg px-1.5 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              isIncome ? 'bg-[#6cf8bb]/30 text-[#006c49]' : 'bg-[#eff4ff] text-[#0b1c30]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {item.categoryIcon || (isIncome ? 'palette' : 'local_mall')}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-medium text-[#0b1c30] truncate group-hover:text-black">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-[#45464d] truncate">
                              {item.note ? `${item.note} · ` : ''}
                              {item.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 pl-3">
                          <span
                            className={`text-[16px] font-semibold tabular-nums ${
                              isIncome ? 'text-[#006c49]' : 'text-[#0b1c30]'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {item.amount.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-[#45464d]">{item.account}</span>
                        </div>
                      </div>
                      {idx < items.length - 1 && <div className="w-full h-px bg-[#eff4ff]" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* End of Timeline Tranquil Note */}
      <div className="py-6 flex flex-col items-center justify-center space-y-1.5 text-center">
        <div className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#45464d]">
          <span className="material-symbols-outlined text-[16px]">spa</span>
        </div>
        <span className="text-[11px] text-[#45464d] tracking-wide">万物清流 · 认真对待每笔收支</span>
      </div>

      {/* Transaction Detail Popup if clicked */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#45464d]">交易详情</span>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center py-2 text-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                  selectedTx.type === 'income' ? 'bg-[#6cf8bb]/30 text-[#006c49]' : 'bg-[#eff4ff] text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[28px]">{selectedTx.categoryIcon}</span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#0b1c30]">{selectedTx.title}</h3>
              <p
                className={`text-[28px] font-bold tabular-nums mt-1 ${
                  selectedTx.type === 'income' ? 'text-[#006c49]' : 'text-[#0b1c30]'
                }`}
              >
                {selectedTx.type === 'income' ? '+' : '-'}¥{selectedTx.amount.toFixed(2)}
              </p>
            </div>

            <div className="bg-[#eff4ff] rounded-xl p-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#45464d]">分类</span>
                <span className="font-medium text-[#0b1c30]">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">支付方式</span>
                <span className="font-medium text-[#0b1c30]">{selectedTx.account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">日期时间</span>
                <span className="font-medium text-[#0b1c30]">{selectedTx.date} {selectedTx.time}</span>
              </div>
              {selectedTx.note && (
                <div className="flex justify-between">
                  <span className="text-[#45464d]">备注</span>
                  <span className="font-medium text-[#0b1c30]">{selectedTx.note}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-slate-800 active:scale-98 transition-all"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
