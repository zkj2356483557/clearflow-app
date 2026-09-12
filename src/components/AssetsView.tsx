import React, { useState } from 'react';
import { AccountItem, Transaction } from '../types';
import { MONTHLY_BUDGET } from '../data/mockData';

interface AssetsViewProps {
  accounts: AccountItem[];
  transactions: Transaction[];
  onOpenAddAccount: () => void;
  onOpenAdjustBudget: () => void;
  onOpenCurrencyConverter: () => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  transactions,
  accounts,
  onOpenAddAccount,
  onOpenAdjustBudget,
  onOpenCurrencyConverter,
}) => {
  const [isPrivacyHidden, setIsPrivacyHidden] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);

  // Group accounts
  const cashAccounts = accounts.filter((a) => a.group === 'cash');
  const creditAccounts = accounts.filter((a) => a.group === 'credit');
  const investmentAccounts = accounts.filter((a) => a.group === 'investment');

  const totalCash = cashAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalCredit = creditAccounts.reduce((sum, a) => sum + a.balance, 0); // negative
  const totalInvestment = investmentAccounts.reduce((sum, a) => sum + a.balance, 0);

  const totalAssets = totalCash + totalInvestment;
  const monthExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const budgetRemaining = Math.max(MONTHLY_BUDGET - monthExpense, 0);
  const budgetUsedPercent = Math.min((monthExpense / MONTHLY_BUDGET) * 100, 100);
  const daysLeftInMonth = 7;
  const dailyRemainingQuota = budgetRemaining / daysLeftInMonth;
  const totalLiabilities = Math.abs(totalCredit);
  const netAssets = totalAssets - totalLiabilities;

  const formatAmount = (num: number) => {
    if (isPrivacyHidden) return '******';
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col w-full px-4 pb-8 space-y-4">
      {/* 净资产总览主卡片 */}
      <section className="relative overflow-hidden rounded-xl bg-white p-5 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#45464d] font-normal">净资产 (CNY)</span>
            <button
              id="toggle-privacy-btn"
              aria-label="切换隐私显示"
              onClick={() => setIsPrivacyHidden(!isPrivacyHidden)}
              className="text-[#45464d] hover:text-[#0b1c30] transition-colors flex items-center p-0.5 rounded-full hover:bg-slate-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]" id="privacy-icon">
                {isPrivacyHidden ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[11px] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
            资产稳健
          </span>
        </div>

        <div className="my-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] text-[#45464d] font-medium">¥</span>
            <span
              className="text-[32px] leading-10 text-[#0b1c30] font-bold tracking-tight tabular-nums"
              id="net-asset-val"
            >
              {formatAmount(netAssets)}
            </span>
          </div>
        </div>

        {/* 资产与负债细分对齐块 */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 bg-[#eff4ff] rounded-lg p-3">
          <div className="flex flex-col pl-1">
            <span className="text-[11px] text-[#45464d]">总资产</span>
            <span className="text-[18px] text-[#0b1c30] font-medium mt-0.5 tabular-nums">
              {isPrivacyHidden ? '******' : `¥ ${totalAssets.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
          <div className="flex flex-col border-l-0 pl-3">
            <span className="text-[11px] text-[#45464d]">总负债</span>
            <span className="text-[18px] text-[#f23d5c] font-medium mt-0.5 tabular-nums">
              {isPrivacyHidden
                ? '******'
                : `-¥ ${totalLiabilities.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
        </div>
      </section>

      {/* 预算健康度面板 */}
      <section className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#006c49]">donut_large</span>
            <span className="text-[14px] font-semibold text-[#0b1c30]">10月月度预算</span>
          </div>
          <button
            onClick={onOpenAdjustBudget}
            className="text-[11px] text-[#45464d] hover:text-[#0b1c30] transition-colors flex items-center gap-0.5"
          >
            调整限额
            <span className="material-symbols-outlined text-[14px]">arrow_forward_ios</span>
          </button>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-[13px] text-[#45464d]">剩余可用</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-[12px] text-[#0b1c30] font-medium">¥</span>
              <span className="text-[22px] font-bold text-[#0b1c30] tabular-nums">{formatAmount(budgetRemaining)}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[13px] text-[#45464d]">已支出 / 总额</span>
            <div className="text-[14px] text-[#0b1c30] font-medium mt-0.5 tabular-nums">
              ¥{formatAmount(monthExpense)} <span className="text-[#45464d] font-normal">/ ¥{MONTHLY_BUDGET.toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>

        {/* 极简分段进度条 */}
        <div className="pt-1">
          <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden flex">
            <div className="h-full bg-[#6cf8bb] rounded-l-full" style={{ width: `${budgetUsedPercent}%` }} />
            <div className="h-full bg-[#e5eeff] flex-1" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-[#006c49] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              预算健康度良好
            </span>
            <span className="text-[11px] text-[#45464d]">已用 {budgetUsedPercent.toFixed(1)}% · 距月底 {daysLeftInMonth} 天</span>
          </div>
        </div>

        {/* 预算陪伴式轻巧文案卡片 */}
        <div className="bg-[#eff4ff] rounded-lg p-3 flex items-start gap-2 mt-2">
          <span className="material-symbols-outlined text-[18px] text-[#006c49] mt-0.5">tips_and_updates</span>
          <p className="text-[13px] text-[#45464d] leading-relaxed">
            每日平均剩余配额约为 <strong className="text-[#0b1c30] font-semibold">¥{dailyRemainingQuota.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            ，保持当下的消费节奏即可实现本月储蓄目标。
          </p>
        </div>
      </section>

      {/* 账户与资产分类列表 */}
      <div className="space-y-4">
        {/* 分组 1: 现金与活期储蓄 */}
        <section className="rounded-xl bg-white p-4 shadow-xs border border-slate-100 space-y-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#0b1c30]">现金与活期储蓄</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#45464d]">
                {cashAccounts.length}个
              </span>
            </div>
            <span className="text-[12px] text-[#0b1c30] font-semibold tabular-nums">
              {isPrivacyHidden ? '******' : `¥ ${totalCash.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1">
            {cashAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#eff4ff]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[20px]">{acc.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-[#0b1c30]">{acc.name}</span>
                    <span className="text-[11px] text-[#45464d]">{acc.subText}</span>
                  </div>
                </div>
                <span className="text-[16px] text-[#0b1c30] font-semibold tabular-nums">
                  {isPrivacyHidden ? '******' : `¥ ${acc.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 分组 2: 信用卡与应付信贷 */}
        <section className="rounded-xl bg-white p-4 shadow-xs border border-slate-100 space-y-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#0b1c30]">信用卡与应还负债</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#ffdadb] text-[#40000d] font-medium">
                1笔待还
              </span>
            </div>
            <span className="text-[12px] text-[#f23d5c] font-semibold tabular-nums">
              {isPrivacyHidden
                ? '******'
                : `-¥ ${totalLiabilities.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1">
            {creditAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#eff4ff]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#ffdadb] flex items-center justify-center text-[#40000d]">
                    <span className="material-symbols-outlined text-[20px]">{acc.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-medium text-[#0b1c30]">{acc.name}</span>
                      {acc.extra && <span className="text-[11px] text-[#45464d]">{acc.extra}</span>}
                    </div>
                    <span className="text-[11px] text-[#45464d]">{acc.subText}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[16px] text-[#f23d5c] font-semibold tabular-nums">
                    {isPrivacyHidden
                      ? '******'
                      : `-¥ ${Math.abs(acc.balance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
                  </span>
                  {acc.creditLimit && (
                    <div className="text-[11px] text-[#45464d] tabular-nums">
                      额度 ¥{acc.creditLimit.toLocaleString('zh-CN')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 分组 3: 稳健理财与投资账户 */}
        <section className="rounded-xl bg-white p-4 shadow-xs border border-slate-100 space-y-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#0b1c30]">稳健投资与理财</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#6ffbbe] text-[#002113] font-medium">
                +5.2%
              </span>
            </div>
            <span className="text-[12px] text-[#0b1c30] font-semibold tabular-nums">
              {isPrivacyHidden
                ? '******'
                : `¥ ${totalInvestment.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1">
            {investmentAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#eff4ff]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#006c49]">
                    <span className="material-symbols-outlined text-[20px]">{acc.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-medium text-[#0b1c30]">{acc.name}</span>
                      <span className="text-[11px] px-1 rounded bg-[#e5eeff] text-[#006c49] font-medium">
                        盈利中
                      </span>
                    </div>
                    <span className="text-[11px] text-[#45464d]">{acc.subText}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[16px] text-[#0b1c30] font-semibold tabular-nums">
                    {isPrivacyHidden
                      ? '******'
                      : `¥ ${acc.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
                  </span>
                  {acc.extra && (
                    <div className="text-[11px] text-[#006c49] font-medium tabular-nums">{acc.extra}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 底部精简快捷入口群 */}
      <section className="rounded-xl bg-white p-2 shadow-xs border border-slate-100">
        <div className="grid grid-cols-3 gap-2 py-1">
          <button
            onClick={onOpenAddAccount}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#eff4ff] transition-colors text-[#45464d] hover:text-[#0b1c30] active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px] mb-1 text-[#0b1c30]">add_card</span>
            <span className="text-[11px] font-medium">新增账户</span>
          </button>
          <button
            onClick={onOpenAdjustBudget}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#eff4ff] transition-colors text-[#45464d] hover:text-[#0b1c30] active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px] mb-1 text-[#0b1c30]">tune</span>
            <span className="text-[11px] font-medium">调整预算</span>
          </button>
          <button
            onClick={onOpenCurrencyConverter}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#eff4ff] transition-colors text-[#45464d] hover:text-[#0b1c30] active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px] mb-1 text-[#0b1c30]">currency_exchange</span>
            <span className="text-[11px] font-medium">汇率折算</span>
          </button>
        </div>
      </section>

      {/* Account detail modal if selected */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#45464d]">账户详情</span>
              <button
                onClick={() => setSelectedAccount(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center py-2 text-center">
              <div className="w-14 h-14 rounded-full bg-[#eff4ff] text-[#0b1c30] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[28px]">{selectedAccount.icon}</span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#0b1c30]">{selectedAccount.name}</h3>
              <p className="text-[12px] text-[#45464d] mt-0.5">{selectedAccount.subText}</p>
              <p className="text-[26px] font-bold tabular-nums mt-2 text-[#0b1c30]">
                {selectedAccount.balance >= 0 ? '' : '-'}¥{Math.abs(selectedAccount.balance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-[#eff4ff] rounded-xl p-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#45464d]">账户分类</span>
                <span className="font-medium text-[#0b1c30]">
                  {selectedAccount.group === 'cash'
                    ? '现金与活期'
                    : selectedAccount.group === 'credit'
                    ? '信用卡/信贷'
                    : '理财/投资'}
                </span>
              </div>
              {selectedAccount.creditLimit && (
                <div className="flex justify-between">
                  <span className="text-[#45464d]">信用总额度</span>
                  <span className="font-medium text-[#0b1c30]">¥{selectedAccount.creditLimit.toLocaleString('zh-CN')}</span>
                </div>
              )}
              {selectedAccount.returnRate && (
                <div className="flex justify-between">
                  <span className="text-[#45464d]">近一年收益率</span>
                  <span className="font-medium text-[#006c49]">{selectedAccount.returnRate}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAccount(null)}
              className="w-full py-2.5 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-slate-800 active:scale-98 transition-all"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
