import React, { useState } from 'react';
import { AccountItem, Transaction } from '../types';
import { APP_AVATAR } from '../data/mockData';

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-[22px] text-slate-400">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索账单、商户、分类或备注..."
            autoFocus
            className="w-full bg-transparent text-[14px] text-[#0b1c30] placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[13px] text-[#45464d] hover:text-[#0b1c30] px-2 py-1"
          >
            取消
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-[13px]">
              输入关键词搜索交易明细
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-[13px]">
              未找到相关记账记录
            </div>
          ) : (
            results.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[18px]">{tx.categoryIcon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-medium text-[#0b1c30] truncate">{tx.title}</span>
                    <span className="text-[11px] text-[#45464d]">{tx.date} · {tx.account}</span>
                  </div>
                </div>
                <span
                  className={`text-[14px] font-semibold tabular-nums ${
                    tx.type === 'income' ? 'text-[#006c49]' : 'text-[#0b1c30]'
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-[15px] font-semibold text-[#0b1c30]">选择账单月份</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-1.5 py-1">
          {months.map((m) => {
            const isSelected = selectedMonth === m;
            return (
              <button
                key={m}
                onClick={() => {
                  onSelectMonth(m);
                  onClose();
                }}
                className={`w-full py-2.5 px-3.5 rounded-xl text-[13px] flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-black text-white font-medium shadow-xs'
                    : 'bg-[#eff4ff]/60 hover:bg-[#eff4ff] text-[#0b1c30]'
                }`}
              >
                <span>{m}</span>
                {isSelected && <span className="material-symbols-outlined text-[18px]">check</span>}
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#45464d]">个人账户</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col items-center py-2 text-center">
          <img
            src={APP_AVATAR}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover ring-3 ring-slate-100 shadow-md mb-2.5"
          />
          <h3 className="text-[17px] font-semibold text-[#0b1c30]">清流修行者</h3>
          <span className="text-[12px] text-[#45464d] mt-0.5">zkj2356483557@gmail.com</span>
          <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#00714d] text-[11px] font-medium">
            已连续正念记账 42 天
          </span>
        </div>

        <div className="bg-[#eff4ff] rounded-xl p-3.5 space-y-2.5 text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-[#45464d]">账本数据安全</span>
            <span className="text-[#006c49] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span> 已本地加密
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#45464d]">当前货币标准</span>
            <span className="font-medium text-[#0b1c30]">人民币 (CNY ¥)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#45464d]">心境提醒</span>
            <span className="font-medium text-[#0b1c30]">每日 21:00 每日复盘</span>
          </div>
        </div>

        <button
          onClick={() => {
            onShowToast('正在备份当前账目数据...');
            onClose();
          }}
          className="w-full py-2.5 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-slate-800 active:scale-98 transition-all"
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-[16px] font-semibold text-[#0b1c30]">新增资金账户</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[12px] text-[#45464d] block mb-1">账户类型</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'cash', label: '现金活期' },
                { key: 'credit', label: '信用卡信贷' },
                { key: 'investment', label: '投资理财' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setGroup(item.key as any)}
                  className={`py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                    group === item.key
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] text-[#45464d] block mb-1">账户名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：建设银行储蓄卡、京东白条"
              className="w-full bg-[#eff4ff] rounded-xl px-3 py-2 text-[13px] text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-[12px] text-[#45464d] block mb-1">初始金额 (¥)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#eff4ff] rounded-xl px-3 py-2 text-[13px] text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-[12px] text-[#45464d] block mb-1">说明备注 (选填)</label>
            <input
              type="text"
              value={subText}
              onChange={(e) => setSubText(e.target.value)}
              placeholder="如：尾号 9812 · 备用金"
              className="w-full bg-[#eff4ff] rounded-xl px-3 py-2 text-[13px] text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-slate-100 text-[#45464d] text-[13px] hover:bg-slate-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-black text-white text-[13px] font-medium hover:bg-slate-800"
          >
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-[16px] font-semibold text-[#0b1c30]">设定月度预算限额</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 py-2">
          <div className="text-center">
            <span className="text-[12px] text-[#45464d]">10月预算总额</span>
            <div className="text-[32px] font-bold text-[#0b1c30] tabular-nums mt-1">
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
            className="w-full accent-black cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-[#45464d]">
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
          className="w-full py-2.5 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-slate-800"
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#006c49]">currency_exchange</span>
            <h3 className="text-[16px] font-semibold text-[#0b1c30]">实时汇率折算</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="bg-[#eff4ff] p-3 rounded-xl flex items-center justify-between">
          <span className="text-[13px] text-[#45464d]">人民币 (CNY)</span>
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-medium">¥</span>
            <input
              type="number"
              value={cnyAmount}
              onChange={(e) => setCnyAmount(e.target.value)}
              className="w-24 text-right bg-white px-2 py-1 rounded-lg text-[14px] font-semibold text-[#0b1c30] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          {rates.map((r) => {
            const converted = (num * r.rate).toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return (
              <div
                key={r.code}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#0b1c30]">{r.name} ({r.code})</span>
                  <span className="text-[11px] text-[#45464d]">汇率约 1 CNY = {r.rate} {r.code}</span>
                </div>
                <span className="text-[15px] font-bold text-[#0b1c30] tabular-nums">
                  {r.symbol} {converted}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-slate-800"
        >
          完成
        </button>
      </div>
    </div>
  );
};
