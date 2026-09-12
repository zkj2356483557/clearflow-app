import React, { useState } from 'react';
import { AccountItem, Transaction, TransactionType } from '../types';
import { QUICK_ADD_CATEGORIES } from '../data/mockData';

interface QuickAddViewProps {
  accounts: AccountItem[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

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

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-8">
      {/* Top Segmented Control */}
      <div className="flex items-center justify-center pt-1 pb-3">
        <div className="inline-flex p-1 rounded-full bg-[#e5eeff] gap-1 shadow-xs">
          <button
            id="tab-expense"
            type="button"
            onClick={() => setActiveMode('expense')}
            className={`px-5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
              activeMode === 'expense'
                ? 'bg-black text-white shadow-xs font-semibold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            支出
          </button>
          <button
            id="tab-income"
            type="button"
            onClick={() => setActiveMode('income')}
            className={`px-5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
              activeMode === 'income'
                ? 'bg-black text-white shadow-xs font-semibold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            收入
          </button>
          <button
            id="tab-transfer"
            type="button"
            onClick={() => setActiveMode('transfer')}
            className={`px-5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
              activeMode === 'transfer'
                ? 'bg-black text-white shadow-xs font-semibold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            转账
          </button>
        </div>
      </div>

      {/* Large Amount Display Area */}
      <div className="bg-white rounded-xl p-5 mb-3.5 shadow-xs border border-slate-100 flex flex-col justify-center relative overflow-hidden transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#45464d] tracking-wider uppercase" id="amount-label">
            {activeMode === 'expense'
              ? '当前支出金额'
              : activeMode === 'income'
              ? '当前收入金额'
              : '当前转账金额'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#006c49]" />
            <span className="text-[11px] text-[#006c49] font-medium" id="category-badge-name">
              {selectedCategory.name}
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-1.5 overflow-x-auto select-none py-1 scrollbar-none">
            <span className="text-[28px] text-[#0b1c30] font-semibold tracking-tight">¥</span>
            <span
              className="text-[36px] leading-tight text-[#0b1c30] font-bold tracking-tight tabular-nums"
              id="display-amount"
            >
              {currentVal === '' ? '0' : currentVal}
            </span>
            <span className="inline-block w-[2.5px] h-8 bg-black rounded-full animate-pulse ml-0.5 self-center" />
          </div>

          {/* Backspace Button */}
          <button
            aria-label="清空金额"
            type="button"
            onClick={clearAmount}
            className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#45464d] flex items-center justify-center hover:bg-[#e5eeff] active:scale-90 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">backspace</span>
          </button>
        </div>
      </div>

      {/* Categories Matrix */}
      <div className="bg-white rounded-xl p-4 mb-3.5 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[12px] text-[#0b1c30] font-semibold">选择交易类别</span>
          <span className="text-[11px] text-[#45464d]">点击快速选择</span>
        </div>

        <div className="grid grid-cols-5 gap-y-3 gap-x-2 text-center" id="category-grid">
          {QUICK_ADD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.name === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="category-btn group flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 transform group-active:scale-95 ${
                    isSelected
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                </div>
                <span
                  className={`text-[11px] ${
                    isSelected ? 'text-[#0b1c30] font-semibold' : 'text-[#45464d]'
                  }`}
                >
                  {cat.shortName}
                </span>
              </button>
            );
          })}

          {/* More Categories Button */}
          <button
            type="button"
            onClick={() => onShowToast('更多自定义标签库加载中...')}
            className="group flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#45464d] flex items-center justify-center shadow-none transition-all duration-150 group-active:scale-95 hover:text-[#0b1c30]">
              <span className="material-symbols-outlined text-[22px]">more_horiz</span>
            </div>
            <span className="text-[11px] text-[#45464d]">更多</span>
          </button>
        </div>
      </div>

      {/* Account, Date, and Note Pills */}
      <div className="bg-white rounded-xl p-3 mb-3.5 shadow-xs border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Account Selector */}
          <button
            id="account-pill"
            type="button"
            onClick={cycleAccount}
            className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-black">credit_card</span>
              <span className="text-[11px] text-[#0b1c30] font-medium truncate" id="account-text">
                {selectedAccount}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#45464d]">expand_more</span>
          </button>

          {/* Date Selector */}
          <button
            id="date-pill"
            type="button"
            onClick={cycleDate}
            className="w-28 flex items-center justify-between px-3 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-black">calendar_today</span>
              <span className="text-[11px] text-[#0b1c30] font-medium" id="date-text">
                {selectedDate}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#45464d]">expand_more</span>
          </button>
        </div>

        {/* Note Input Field */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#eff4ff]">
          <span className="material-symbols-outlined text-[18px] text-[#45464d]">edit_note</span>
          <input
            id="note-input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitEntry();
            }}
            placeholder="添加备注（如：同事聚餐、超市生鲜）"
            className="w-full bg-transparent text-[13px] text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none"
          />
        </div>
      </div>

      {/* Custom Minimalist Numeric Keypad */}
      <div className="grid grid-cols-4 gap-2 select-none">
        {/* Row 1 */}
        <button
          type="button"
          onClick={() => inputKey('7')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => inputKey('8')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => inputKey('9')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => inputKey('+')}
          className="h-12 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[20px] font-medium shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => inputKey('4')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => inputKey('5')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => inputKey('6')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => inputKey('-')}
          className="h-12 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[20px] font-medium shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[22px]">remove</span>
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => inputKey('1')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => inputKey('2')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => inputKey('3')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          3
        </button>
        <button
          type="button"
          onClick={deleteDigit}
          className="h-12 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[20px] font-medium shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[22px]">backspace</span>
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => inputKey('.')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-bold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => inputKey('0')}
          className="h-12 py-2.5 rounded-xl bg-white text-[#0b1c30] text-[20px] font-semibold shadow-xs border border-slate-100 active:bg-[#e5eeff] active:scale-98 transition-all flex items-center justify-center"
        >
          0
        </button>

        {/* Submit Button (Col Span 2) */}
        <button
          id="submit-btn"
          type="button"
          onClick={submitEntry}
          className="col-span-2 h-12 py-2.5 rounded-xl bg-black text-white text-[14px] font-semibold shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 hover:bg-slate-900"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
          <span>完成记账</span>
        </button>
      </div>
    </div>
  );
};
