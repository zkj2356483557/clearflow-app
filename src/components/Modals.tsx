import React, { useState } from 'react';
import { AccountItem, Transaction } from '../types';
import { APP_AVATAR } from '../data/mockData';

/* ------------------------------------------------------------------
   Shared iOS sheet styling
   ------------------------------------------------------------------ */
const SHEET_WRAP = 'fixed inset-0 z-50 flex items-end justify-center bg-label/25 backdrop-blur-md';
const SHEET_PANEL =
  'glass glass-strong w-full max-w-md rounded-t-[34px] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] animate-sheetUp';
const PRIMARY_BTN =
  'w-full py-3 rounded-[18px] text-white text-[15px] font-semibold bg-[linear-gradient(180deg,#4aa4ff,#007aff)] ring-1 ring-white/40 shadow-[0_12px_26px_-10px_rgba(0,122,255,0.7)] active:scale-[0.98] transition-transform disabled:opacity-50';
const SECONDARY_BTN =
  'w-full py-3 rounded-[18px] glass glass-soft text-label text-[15px] font-medium active:scale-[0.98] transition-transform';
const FIELD =
  'w-full glass glass-soft rounded-[16px] px-3.5 py-3 text-[14px] text-label placeholder:text-label-3 focus:outline-none focus:ring-2 focus:ring-ios-blue/40';
const ROW = 'glass glass-soft rounded-[18px] px-3.5 py-3 flex items-center justify-between text-[13px]';

const SheetHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between pt-4 pb-3">
    <h3 className="text-[17px] font-semibold text-label tracking-tight">{title}</h3>
    <button
      onClick={onClose}
      aria-label="关闭"
      className="glass glass-thin w-8 h-8 rounded-full flex items-center justify-center text-label-2 active:scale-95 transition-transform"
    >
      <span className="material-symbols-rounded text-[18px]">close</span>
    </button>
  </div>
);

// 1. Search Modal
export const SearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}> = ({ isOpen, onClose, transactions }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? transactions.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()) ||
          (t.note && t.note.toLowerCase().includes(query.toLowerCase())) ||
          t.account.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-label/25 backdrop-blur-md px-3 pt-[max(env(safe-area-inset-top),12px)]"
      onClick={onClose}
    >
      <div
        className="glass glass-strong w-full max-w-md rounded-[28px] p-3 animate-fadeIn space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <div className="glass glass-soft flex items-center gap-2 flex-1 px-3 py-2.5 rounded-[16px]">
            <span className="material-symbols-rounded text-[20px] text-label-3">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索账单、商户、分类或备注..."
              autoFocus
              className="w-full bg-transparent text-[14px] text-label placeholder:text-label-3 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="清空" className="text-label-3 active:scale-90 transition-transform">
                <span className="material-symbols-rounded text-[18px]">cancel</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[14px] text-ios-blue font-medium px-1 py-1 active:scale-95 transition-transform"
          >
            取消
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-1.5 pb-1">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-label-3 text-[13px]">输入关键词搜索交易明细</div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-label-3 text-[13px]">未找到相关记账记录</div>
          ) : (
            results.map((tx) => (
              <div key={tx.id} className={`${ROW} !py-2.5`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white/60 ring-1 ring-white/70 flex items-center justify-center text-label shrink-0">
                    <span className="material-symbols-rounded text-[18px]">{tx.categoryIcon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-medium text-label truncate">{tx.title}</span>
                    <span className="text-[11px] text-label-2">
                      {tx.date} · {tx.account}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[14px] font-semibold tabular-nums shrink-0 pl-2 ${
                    tx.type === 'income' ? 'text-ios-green-ink' : 'text-label'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}¥{tx.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Month Picker Modal
export const MonthPickerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  onSelectMonth: (m: string) => void;
}> = ({ isOpen, onClose, selectedMonth, onSelectMonth }) => {
  if (!isOpen) return null;

  const months = [
    '2024年 10月',
    '2024年 09月',
    '2024年 08月',
    '2024年 07月',
    '2024年 06月',
    '2024年 05月',
  ];

  return (
    <div className={SHEET_WRAP} onClick={onClose}>
      <div className={SHEET_PANEL} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber mx-auto" />
        <SheetHeader title="选择账单月份" onClose={onClose} />

        <div className="space-y-2 pb-2">
          {months.map((m) => {
            const isSelected = selectedMonth === m;
            return (
              <button
                key={m}
                onClick={() => {
                  onSelectMonth(m);
                  onClose();
                }}
                className={`w-full py-3 px-4 rounded-[18px] text-[14px] flex items-center justify-between transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-ios-blue/15 text-ios-blue font-semibold ring-1 ring-ios-blue/25'
                    : 'glass glass-soft text-label'
                }`}
              >
                <span>{m}</span>
                {isSelected && <span className="material-symbols-rounded filled text-[19px]">check_circle</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 3. User Profile Modal
export const ProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  return (
    <div className={SHEET_WRAP} onClick={onClose}>
      <div className={SHEET_PANEL} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber mx-auto" />
        <SheetHeader title="个人账户" onClose={onClose} />

        <div className="flex flex-col items-center pb-4 text-center">
          <img
            src={APP_AVATAR}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-3 ring-white/70 shadow-[0_10px_26px_-12px_rgba(14,32,70,0.5)] mb-3"
          />
          <h3 className="text-[18px] font-semibold text-label">清流修行者</h3>
          <span className="text-[12px] text-label-2 mt-0.5">zkj2356483557@gmail.com</span>
          <span className="glass glass-thin mt-2.5 px-3 py-1 rounded-full text-ios-green-ink text-[11px] font-medium">
            已连续正念记账 42 天
          </span>
        </div>

        <div className="glass glass-soft rounded-[20px] p-4 space-y-3 text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-label-2">账本数据安全</span>
            <span className="text-ios-green-ink font-medium flex items-center gap-1">
              <span className="material-symbols-rounded filled text-[16px]">verified_user</span> 已本地加密
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-2">当前货币标准</span>
            <span className="font-medium text-label">人民币 (CNY ¥)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-2">心境提醒</span>
            <span className="font-medium text-label">每日 21:00 每日复盘</span>
          </div>
        </div>

        <button
          onClick={() => {
            onShowToast('正在备份当前账目数据...');
            onClose();
          }}
          className={`${PRIMARY_BTN} mt-4`}
        >
          导出本地账本备份
        </button>
      </div>
    </div>
  );
};

// 4. Add Account Modal
export const AddAccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: AccountItem) => void;
  onShowToast: (msg: string) => void;
}> = ({ isOpen, onClose, onAddAccount, onShowToast }) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState<'cash' | 'credit' | 'investment'>('cash');
  const [balance, setBalance] = useState('');
  const [subText, setSubText] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      onShowToast('请输入账户名称');
      return;
    }
    const num = parseFloat(balance) || 0;
    const icons = {
      cash: 'account_balance',
      credit: 'credit_card',
      investment: 'trending_up',
    };

    onAddAccount({
      id: `acc-${Date.now()}`,
      name: name.trim(),
      group: group,
      subText: subText.trim() || (group === 'cash' ? '日常活期' : group === 'credit' ? '信用额度' : '理财定投'),
      balance: group === 'credit' ? -Math.abs(num) : num,
      icon: icons[group],
    });

    onShowToast(`已新增账户：${name.trim()}`);
    setName('');
    setBalance('');
    setSubText('');
    onClose();
  };

  const groupOptions: { key: 'cash' | 'credit' | 'investment'; label: string }[] = [
    { key: 'cash', label: '现金活期' },
    { key: 'credit', label: '信用卡信贷' },
    { key: 'investment', label: '投资理财' },
  ];

  return (
    <div className={SHEET_WRAP} onClick={onClose}>
      <div className={SHEET_PANEL} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber mx-auto" />
        <SheetHeader title="新增资金账户" onClose={onClose} />

        <div className="space-y-3.5 pb-1">
          <div>
            <label className="text-[12px] text-label-2 block mb-1.5 pl-1">账户类型</label>
            <div className="glass glass-soft grid grid-cols-3 gap-1.5 p-1.5 rounded-[18px]">
              {groupOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setGroup(item.key)}
                  className={`py-2 rounded-[14px] text-[12px] transition-all duration-200 ${
                    group === item.key
                      ? 'bg-white/90 text-label font-semibold shadow-[0_2px_6px_rgba(14,32,70,0.14)] ring-1 ring-white/70'
                      : 'text-label-2 active:scale-95'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] text-label-2 block mb-1.5 pl-1">账户名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：建设银行储蓄卡、京东白条"
              className={FIELD}
            />
          </div>

          <div>
            <label className="text-[12px] text-label-2 block mb-1.5 pl-1">初始金额 (¥)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              className={FIELD}
            />
          </div>

          <div>
            <label className="text-[12px] text-label-2 block mb-1.5 pl-1">说明备注 (选填)</label>
            <input
              type="text"
              value={subText}
              onChange={(e) => setSubText(e.target.value)}
              placeholder="如：尾号 9812 · 备用金"
              className={FIELD}
            />
          </div>
        </div>

        <div className="pt-4 flex gap-2">
          <button onClick={onClose} className={SECONDARY_BTN}>
            取消
          </button>
          <button onClick={handleSave} className={PRIMARY_BTN}>
            保存账户
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Adjust Budget Modal
export const AdjustBudgetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}> = ({ isOpen, onClose, onShowToast }) => {
  const [budgetVal, setBudgetVal] = useState('8000');

  if (!isOpen) return null;

  return (
    <div className={SHEET_WRAP} onClick={onClose}>
      <div className={SHEET_PANEL} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber mx-auto" />
        <SheetHeader title="设定月度预算限额" onClose={onClose} />

        <div className="space-y-2 pb-1">
          <div className="text-center py-2">
            <span className="text-[12px] text-label-2">10月预算总额</span>
            <div className="text-[34px] font-bold text-label tabular-nums mt-1 tracking-tight">
              ¥{parseFloat(budgetVal || '0').toLocaleString('zh-CN')}
            </div>
          </div>

          <input
            type="range"
            min="3000"
            max="30000"
            step="500"
            value={budgetVal}
            onChange={(e) => setBudgetVal(e.target.value)}
            className="ios-slider"
            aria-label="月度预算限额"
          />

          <div className="flex justify-between text-[11px] text-label-2 px-1">
            <span>¥3,000</span>
            <span>¥15,000</span>
            <span>¥30,000</span>
          </div>
        </div>

        <button
          onClick={() => {
            onShowToast(`已更新月度预算为 ¥${parseFloat(budgetVal).toLocaleString('zh-CN')}`);
            onClose();
          }}
          className={`${PRIMARY_BTN} mt-4`}
        >
          保存限额
        </button>
      </div>
    </div>
  );
};

// 6. Currency Converter Modal
export const CurrencyConverterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [cnyAmount, setCnyAmount] = useState('1000');

  if (!isOpen) return null;

  const num = parseFloat(cnyAmount) || 0;
  const rates = [
    { code: 'USD', name: '美元', symbol: '$', rate: 0.141 },
    { code: 'EUR', name: '欧元', symbol: '€', rate: 0.129 },
    { code: 'JPY', name: '日元', symbol: '¥', rate: 21.3 },
    { code: 'HKD', name: '港币', symbol: 'HK$', rate: 1.102 },
    { code: 'GBP', name: '英镑', symbol: '£', rate: 0.111 },
  ];

  return (
    <div className={SHEET_WRAP} onClick={onClose}>
      <div className={SHEET_PANEL} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber mx-auto" />
        <SheetHeader title="实时汇率折算" onClose={onClose} />

        <div className={`${ROW} mb-3`}>
          <span className="text-[13px] text-label-2">人民币 (CNY)</span>
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-medium text-label">¥</span>
            <input
              type="number"
              value={cnyAmount}
              onChange={(e) => setCnyAmount(e.target.value)}
              className="w-24 text-right bg-white/70 px-2.5 py-1.5 rounded-[12px] text-[14px] font-semibold text-label focus:outline-none focus:ring-2 focus:ring-ios-blue/40"
            />
          </div>
        </div>

        <div className="space-y-2 max-h-[46vh] overflow-y-auto pb-1">
          {rates.map((r) => {
            const converted = (num * r.rate).toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return (
              <div key={r.code} className={ROW}>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-label">
                    {r.name} ({r.code})
                  </span>
                  <span className="text-[11px] text-label-2">
                    汇率约 1 CNY = {r.rate} {r.code}
                  </span>
                </div>
                <span className="text-[15px] font-bold text-label tabular-nums">
                  {r.symbol} {converted}
                </span>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className={`${PRIMARY_BTN} mt-4`}>
          完成
        </button>
      </div>
    </div>
  );
};
