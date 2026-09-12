import React, { useState } from 'react';
import { AccountItem, Transaction, TransactionType } from '../types';
import { QUICK_ADD_CATEGORIES } from '../data/mockData';

interface QuickAddViewProps {
  accounts: AccountItem[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

const MODES: { key: TransactionType; label: string }[] = [
  { key: 'expense', label: '支出' },
  { key: 'income', label: '收入' },
  { key: 'transfer', label: '转账' },
];

export const QuickAddView: React.FC<QuickAddViewProps> = ({ accounts, onAddTransaction, onShowToast }) => {
  const [activeMode, setActiveMode] = useState<TransactionType>('expense');
  const [currentVal, setCurrentVal] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState({
    name: '餐饮美食',
    shortName: '餐饮',
    icon: 'restaurant',
  });
  const accountNames = accounts.filter((a) => a.group !== 'investment').map((a) => a.name);
  const [selectedAccount, setSelectedAccount] = useState<string>(accountNames[0] || '');
  const [selectedDate, setSelectedDate] = useState<string>('今天');
  const [note, setNote] = useState<string>('');

  const dates = ['今天', '昨天', '前天'];

  const cycleAccount = () => {
    if (accountNames.length === 0) return;
    const idx = accountNames.indexOf(selectedAccount);
    const nextIdx = (idx + 1) % accountNames.length;
    setSelectedAccount(accountNames[nextIdx]);
  };

  const cycleDate = () => {
    const idx = dates.indexOf(selectedDate);
    const nextIdx = (idx + 1) % dates.length;
    setSelectedDate(dates[nextIdx]);
  };

  const evaluateExpression = (val: string): string => {
    try {
      const sanitized = val.replace(/[^0-9.+-]/g, '');
      if (sanitized && !['+', '-'].includes(sanitized.slice(-1))) {
        // Safe evaluation of simple addition/subtraction
        const parts = sanitized.split(/([+-])/);
        let result = parseFloat(parts[0]) || 0;
        for (let i = 1; i < parts.length; i += 2) {
          const op = parts[i];
          const nextNum = parseFloat(parts[i + 1]) || 0;
          if (op === '+') result += nextNum;
          if (op === '-') result -= nextNum;
        }
        if (!isNaN(result) && isFinite(result)) {
          return String(Math.round(result * 100) / 100);
        }
      }
    } catch {
      // ignore
    }
    return val;
  };

  const inputKey = (key: string) => {
    if (key === '.') {
      if (currentVal.includes('.')) return;
      if (currentVal === '0' || currentVal === '') {
        setCurrentVal('0.');
      } else {
        setCurrentVal((prev) => prev + '.');
      }
    } else if (key === '+' || key === '-') {
      const lastChar = currentVal.slice(-1);
      if (lastChar === '+' || lastChar === '-') {
        setCurrentVal((prev) => prev.slice(0, -1) + key);
      } else {
        const calculated = evaluateExpression(currentVal);
        setCurrentVal(calculated + key);
      }
    } else {
      if (currentVal === '0') {
        setCurrentVal(key);
      } else {
        const parts = currentVal.split(/[+-]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.') && lastPart.split('.')[1].length >= 2) {
          return; // Max 2 decimal digits
        }
        setCurrentVal((prev) => prev + key);
      }
    }
  };

  const deleteDigit = () => {
    if (currentVal.length <= 1) {
      setCurrentVal('0');
    } else {
      setCurrentVal((prev) => prev.slice(0, -1));
    }
  };

  const clearAmount = () => {
    setCurrentVal('0');
  };

  const submitEntry = () => {
    const calculated = evaluateExpression(currentVal);
    const amount = parseFloat(calculated);
    if (!amount || isNaN(amount) || amount <= 0) {
      onShowToast('请输入有效金额');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    let dateStr = '2024-10-24';
    if (selectedDate === '昨天') dateStr = '2024-10-23';
    if (selectedDate === '前天') dateStr = '2024-10-22';

    onAddTransaction({
      title: note ? note : selectedCategory.name,
      category: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      amount: amount,
      type: activeMode,
      date: dateStr,
      time: timeStr,
      note: note || undefined,
      account: selectedAccount,
    });

    const memo = note ? ` (${note})` : '';
    onShowToast(`已成功入账：¥${amount.toFixed(2)} - ${selectedCategory.name}${memo}`);

    // Reset fields
    setCurrentVal('0');
    setNote('');
  };

  const keyBase =
    'h-[54px] rounded-[18px] text-[22px] font-medium flex items-center justify-center active:scale-[0.96] transition-transform duration-150';
  const numberKey = `${keyBase} glass glass-thin text-label active:bg-white/80`;
  const operatorKey = `${keyBase} glass glass-soft text-ios-blue active:bg-white/80`;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-8">
      {/* Top Segmented Control */}
      <div className="flex items-center justify-center pt-1 pb-3">
        <div className="glass glass-soft inline-flex p-1 rounded-full gap-1">
          {MODES.map((mode) => {
            const isActive = activeMode === mode.key;
            return (
              <button
                key={mode.key}
                id={`tab-${mode.key}`}
                type="button"
                onClick={() => setActiveMode(mode.key)}
                className={`px-5 py-1.5 rounded-full text-[12px] transition-all duration-200 ${
                  isActive
                    ? 'bg-white/90 text-label font-semibold shadow-[0_2px_6px_rgba(14,32,70,0.14)] ring-1 ring-white/70'
                    : 'text-label-2 active:scale-95'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large Amount Display */}
      <div className="glass rounded-[28px] p-5 mb-3.5 flex flex-col justify-center relative overflow-hidden transition-all duration-200">
        <div className="absolute -right-12 -top-14 w-36 h-36 rounded-full bg-ios-blue/25 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <span className="text-[11px] text-label-2 tracking-wider uppercase" id="amount-label">
            {activeMode === 'expense'
              ? '当前支出金额'
              : activeMode === 'income'
              ? '当前收入金额'
              : '当前转账金额'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-ios-blue" />
            <span className="text-[11px] text-label-2 font-medium" id="category-badge-name">
              {selectedCategory.name}
            </span>
          </div>
        </div>

        <div className="relative flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-1.5 overflow-x-auto select-none py-1 scrollbar-none">
            <span className="text-[28px] text-label font-semibold tracking-tight">¥</span>
            <span
              className="text-[36px] leading-tight text-label font-bold tracking-tight tabular-nums"
              id="display-amount"
            >
              {currentVal === '' ? '0' : currentVal}
            </span>
            <span className="inline-block w-[2.5px] h-8 bg-ios-blue rounded-full animate-pulse ml-0.5 self-center" />
          </div>

          {/* Clear Button */}
          <button
            aria-label="清空金额"
            type="button"
            onClick={clearAmount}
            className="glass glass-thin w-10 h-10 rounded-full text-label-2 flex items-center justify-center active:scale-90 transition-transform shrink-0"
          >
            <span className="material-symbols-rounded text-[19px]">backspace</span>
          </button>
        </div>
      </div>

      {/* Category Matrix */}
      <div className="glass rounded-[26px] p-4 mb-3.5">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[12px] text-label font-semibold">选择交易类别</span>
          <span className="text-[11px] text-label-3">点击快速选择</span>
        </div>

        <div className="grid grid-cols-5 gap-y-3 gap-x-2 text-center" id="category-grid">
          {QUICK_ADD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.name === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                aria-label={cat.name}
                onClick={() => setSelectedCategory(cat)}
                className="category-btn group flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 group-active:scale-95 ${
                    isSelected
                      ? 'text-white bg-[linear-gradient(180deg,#4aa4ff,#007aff)] ring-1 ring-white/50 shadow-[0_10px_22px_-8px_rgba(0,122,255,0.75),inset_0_1px_0_rgba(255,255,255,0.5)]'
                      : 'glass glass-thin text-label'
                  }`}
                >
                  <span className={`material-symbols-rounded text-[22px] ${isSelected ? 'filled' : ''}`}>
                    {cat.icon}
                  </span>
                </div>
                <span className={`text-[11px] ${isSelected ? 'text-ios-blue font-semibold' : 'text-label-2'}`}>
                  {cat.shortName}
                </span>
              </button>
            );
          })}

          {/* More Categories */}
          <button
            type="button"
            onClick={() => onShowToast('更多自定义标签库加载中...')}
            className="group flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <div className="glass glass-soft w-12 h-12 rounded-full text-label-2 flex items-center justify-center transition-all duration-150 group-active:scale-95">
              <span className="material-symbols-rounded text-[22px]">more_horiz</span>
            </div>
            <span className="text-[11px] text-label-2">更多</span>
          </button>
        </div>
      </div>

      {/* Account, Date, and Note Pills */}
      <div className="glass rounded-[26px] p-3 mb-3.5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Account Selector */}
          <button
            id="account-pill"
            type="button"
            onClick={cycleAccount}
            className="glass glass-soft flex-1 flex items-center justify-between px-3 py-2.5 rounded-[16px] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-rounded text-[18px] text-ios-blue">credit_card</span>
              <span className="text-[12px] text-label font-medium truncate" id="account-text">
                {selectedAccount}
              </span>
            </div>
            <span className="material-symbols-rounded text-[17px] text-label-2">expand_more</span>
          </button>

          {/* Date Selector */}
          <button
            id="date-pill"
            type="button"
            onClick={cycleDate}
            className="glass glass-soft w-28 flex items-center justify-between px-3 py-2.5 rounded-[16px] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-rounded text-[18px] text-ios-blue">calendar_month</span>
              <span className="text-[12px] text-label font-medium" id="date-text">
                {selectedDate}
              </span>
            </div>
            <span className="material-symbols-rounded text-[17px] text-label-2">expand_more</span>
          </button>
        </div>

        {/* Note Input */}
        <div className="glass glass-soft flex items-center gap-2 px-3 py-2.5 rounded-[16px]">
          <span className="material-symbols-rounded text-[18px] text-label-3">edit_note</span>
          <input
            id="note-input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitEntry();
            }}
            placeholder="添加备注（如：同事聚餐、超市生鲜）"
            className="w-full bg-transparent text-[13px] text-label placeholder:text-label-3 focus:outline-none"
          />
        </div>
      </div>

      {/* Custom Numeric Keypad */}
      <div className="grid grid-cols-4 gap-2 select-none">
        {/* Row 1 */}
        <button type="button" onClick={() => inputKey('7')} className={numberKey}>
          7
        </button>
        <button type="button" onClick={() => inputKey('8')} className={numberKey}>
          8
        </button>
        <button type="button" onClick={() => inputKey('9')} className={numberKey}>
          9
        </button>
        <button type="button" aria-label="加" onClick={() => inputKey('+')} className={operatorKey}>
          <span className="material-symbols-rounded text-[22px]">add</span>
        </button>

        {/* Row 2 */}
        <button type="button" onClick={() => inputKey('4')} className={numberKey}>
          4
        </button>
        <button type="button" onClick={() => inputKey('5')} className={numberKey}>
          5
        </button>
        <button type="button" onClick={() => inputKey('6')} className={numberKey}>
          6
        </button>
        <button type="button" aria-label="减" onClick={() => inputKey('-')} className={operatorKey}>
          <span className="material-symbols-rounded text-[22px]">remove</span>
        </button>

        {/* Row 3 */}
        <button type="button" onClick={() => inputKey('1')} className={numberKey}>
          1
        </button>
        <button type="button" onClick={() => inputKey('2')} className={numberKey}>
          2
        </button>
        <button type="button" onClick={() => inputKey('3')} className={numberKey}>
          3
        </button>
        <button type="button" aria-label="退格" onClick={deleteDigit} className={operatorKey}>
          <span className="material-symbols-rounded text-[22px]">backspace</span>
        </button>

        {/* Row 4 */}
        <button type="button" onClick={() => inputKey('.')} className={numberKey}>
          .
        </button>
        <button type="button" onClick={() => inputKey('0')} className={numberKey}>
          0
        </button>

        {/* Submit (Col Span 2) */}
        <button
          id="submit-btn"
          type="button"
          onClick={submitEntry}
          className="col-span-2 h-[54px] rounded-[18px] text-white text-[15px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform bg-[linear-gradient(180deg,#4aa4ff,#007aff)] ring-1 ring-white/40 shadow-[0_14px_28px_-10px_rgba(0,122,255,0.75),inset_0_1px_0_rgba(255,255,255,0.5)]"
        >
          <span className="material-symbols-rounded filled text-[21px]">check_circle</span>
          <span>完成记账</span>
        </button>
      </div>
    </div>
  );
};
