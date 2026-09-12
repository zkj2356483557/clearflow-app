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
  const monthExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
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

  const renderAccountRow = (acc: AccountItem, tone: 'neutral' | 'negative' | 'positive') => {
    const iconTone =
      tone === 'negative'
        ? 'bg-ios-red/15 text-ios-red-ink'
        : tone === 'positive'
        ? 'bg-ios-green/20 text-ios-green-ink'
        : 'bg-ios-blue/12 text-ios-blue';

    const valueTone = tone === 'negative' ? 'text-ios-red-ink' : 'text-label';

    return (
      <div
        key={acc.id}
        onClick={() => setSelectedAccount(acc)}
        className="flex items-center justify-between p-2.5 rounded-[18px] active:bg-white/55 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconTone}`}>
            <span className="material-symbols-rounded text-[20px]">{acc.icon}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-medium text-label truncate">{acc.name}</span>
              {acc.extra && tone !== 'positive' && (
                <span className="text-[11px] text-label-2 shrink-0">{acc.extra}</span>
              )}
            </div>
            <span className="text-[11px] text-label-2 truncate">{acc.subText}</span>
          </div>
        </div>

        <div className="text-right shrink-0 pl-3">
          <span className={`text-[16px] font-semibold tabular-nums ${valueTone}`}>
            {isPrivacyHidden
              ? '******'
              : tone === 'negative'
              ? `-¥ ${Math.abs(acc.balance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
              : `¥ ${acc.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
          </span>
          {acc.creditLimit && (
            <div className="text-[11px] text-label-2 tabular-nums">
              额度 ¥{acc.creditLimit.toLocaleString('zh-CN')}
            </div>
          )}
          {tone === 'positive' && acc.extra && (
            <div className="text-[11px] text-ios-green-ink font-medium tabular-nums">{acc.extra}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full px-4 pb-8 space-y-4">
      {/* 净资产总览主卡片 */}
      <section className="glass relative overflow-hidden rounded-[28px] p-5">
        <div className="absolute -left-12 -top-14 w-40 h-40 rounded-full bg-ios-indigo/25 blur-3xl pointer-events-none" />
        <div className="absolute -right-10 bottom-0 w-32 h-32 rounded-full bg-ios-teal/25 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-label-2 font-normal">净资产 (CNY)</span>
              <button
                id="toggle-privacy-btn"
                aria-label="切换隐私显示"
                onClick={() => setIsPrivacyHidden(!isPrivacyHidden)}
                className="text-label-2 active:scale-95 transition-transform flex items-center p-0.5"
              >
                <span className="material-symbols-rounded text-[18px]" id="privacy-icon">
                  {isPrivacyHidden ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <span className="glass glass-thin px-2.5 py-1 rounded-full text-ios-green-ink text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ios-green" />
              资产稳健
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] text-label-2 font-medium">¥</span>
              <span
                className="text-[32px] leading-10 text-label font-bold tracking-tight tabular-nums"
                id="net-asset-val"
              >
                {formatAmount(netAssets)}
              </span>
            </div>
          </div>

          {/* 资产与负债细分对齐块 */}
          <div className="glass glass-soft grid grid-cols-2 gap-2 mt-4 rounded-[20px] p-3">
            <div className="flex flex-col pl-1">
              <span className="text-[11px] text-label-2">总资产</span>
              <span className="text-[18px] text-label font-medium mt-0.5 tabular-nums">
                {isPrivacyHidden
                  ? '******'
                  : `¥ ${totalAssets.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="flex flex-col pl-3 border-l border-white/60">
              <span className="text-[11px] text-label-2">总负债</span>
              <span className="text-[18px] text-ios-red-ink font-medium mt-0.5 tabular-nums">
                {isPrivacyHidden
                  ? '******'
                  : `-¥ ${totalLiabilities.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 预算健康度面板 */}
      <section className="glass rounded-[28px] p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-rounded text-[20px] text-ios-green-ink">donut_large</span>
            <span className="text-[14px] font-semibold text-label">10月月度预算</span>
          </div>
          <button
            onClick={onOpenAdjustBudget}
            className="text-[11px] text-label-2 active:scale-95 transition-transform flex items-center gap-0.5"
          >
            调整限额
            <span className="material-symbols-rounded text-[14px]">arrow_forward_ios</span>
          </button>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-[13px] text-label-2">剩余可用</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-[12px] text-label font-medium">¥</span>
              <span className="text-[22px] font-bold text-label tabular-nums">{formatAmount(budgetRemaining)}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[13px] text-label-2">已支出 / 总额</span>
            <div className="text-[14px] text-label font-medium mt-0.5 tabular-nums">
              ¥{formatAmount(monthExpense)}{' '}
              <span className="text-label-2 font-normal">/ ¥{MONTHLY_BUDGET.toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>

        {/* 分段进度条 */}
        <div className="pt-1">
          <div className="w-full h-2 rounded-full bg-white/55 overflow-hidden flex shadow-[inset_0_1px_2px_rgba(14,32,70,0.08)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#5ce08a,#34c759)] shadow-[0_0_10px_rgba(52,199,89,0.55)]"
              style={{ width: `${budgetUsedPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-ios-green-ink flex items-center gap-1 font-medium">
              <span className="material-symbols-rounded filled text-[14px]">check_circle</span>
              预算健康度良好
            </span>
            <span className="text-[11px] text-label-2">
              已用 {budgetUsedPercent.toFixed(1)}% · 距月底 {daysLeftInMonth} 天
            </span>
          </div>
        </div>

        <div className="glass glass-soft rounded-[18px] p-3 flex items-start gap-2 mt-2">
          <span className="material-symbols-rounded text-[18px] text-ios-green-ink mt-0.5">tips_and_updates</span>
          <p className="text-[13px] text-label-2 leading-relaxed">
            每日平均剩余配额约为{' '}
            <strong className="text-label font-semibold">
              ¥
              {dailyRemainingQuota.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
            ，保持当下的消费节奏即可实现本月储蓄目标。
          </p>
        </div>
      </section>

      {/* 账户与资产分类列表 */}
      <div className="space-y-4">
        {/* 现金与活期储蓄 */}
        <section className="glass rounded-[26px] p-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/50">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-label">现金与活期储蓄</span>
              <span className="glass glass-thin text-[11px] px-1.5 py-0.5 rounded-full text-label-2">
                {cashAccounts.length}个
              </span>
            </div>
            <span className="text-[12px] text-label font-semibold tabular-nums">
              {isPrivacyHidden ? '******' : `¥ ${totalCash.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1.5">{cashAccounts.map((acc) => renderAccountRow(acc, 'neutral'))}</div>
        </section>

        {/* 信用卡与应付信贷 */}
        <section className="glass rounded-[26px] p-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/50">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-label">信用卡与应还负债</span>
              <span className="bg-ios-red/15 text-ios-red-ink text-[11px] px-2 py-0.5 rounded-full font-medium">
                1笔待还
              </span>
            </div>
            <span className="text-[12px] text-ios-red-ink font-semibold tabular-nums">
              {isPrivacyHidden
                ? '******'
                : `-¥ ${totalLiabilities.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1.5">{creditAccounts.map((acc) => renderAccountRow(acc, 'negative'))}</div>
        </section>

        {/* 稳健理财与投资账户 */}
        <section className="glass rounded-[26px] p-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/50">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-label">稳健投资与理财</span>
              <span className="bg-ios-green/20 text-ios-green-ink text-[11px] px-2 py-0.5 rounded-full font-medium">
                +5.2%
              </span>
            </div>
            <span className="text-[12px] text-label font-semibold tabular-nums">
              {isPrivacyHidden
                ? '******'
                : `¥ ${totalInvestment.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1.5">
            {investmentAccounts.map((acc) => renderAccountRow(acc, 'positive'))}
          </div>
        </section>
      </div>

      {/* 底部快捷入口群 */}
      <section className="glass rounded-[26px] p-2">
        <div className="grid grid-cols-3 gap-2 py-1">
          <button
            onClick={onOpenAddAccount}
            className="flex flex-col items-center justify-center p-2.5 rounded-[18px] active:bg-white/55 transition-colors text-label-2 active:scale-95"
          >
            <span className="material-symbols-rounded text-[22px] mb-1 text-ios-blue">add_card</span>
            <span className="text-[11px] font-medium">新增账户</span>
          </button>
          <button
            onClick={onOpenAdjustBudget}
            className="flex flex-col items-center justify-center p-2.5 rounded-[18px] active:bg-white/55 transition-colors text-label-2 active:scale-95"
          >
            <span className="material-symbols-rounded text-[22px] mb-1 text-ios-blue">tune</span>
            <span className="text-[11px] font-medium">调整预算</span>
          </button>
          <button
            onClick={onOpenCurrencyConverter}
            className="flex flex-col items-center justify-center p-2.5 rounded-[18px] active:bg-white/55 transition-colors text-label-2 active:scale-95"
          >
            <span className="material-symbols-rounded text-[22px] mb-1 text-ios-blue">currency_exchange</span>
            <span className="text-[11px] font-medium">汇率折算</span>
          </button>
        </div>
      </section>

      {/* 账户详情底部抽屉 */}
      {selectedAccount && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-label/25 backdrop-blur-md"
          onClick={() => setSelectedAccount(null)}
        >
          <div
            className="glass glass-strong w-full max-w-md rounded-t-[34px] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] animate-sheetUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-grabber mx-auto" />

            <div className="flex items-center justify-between pt-4">
              <span className="text-[12px] text-label-2">账户详情</span>
              <button
                onClick={() => setSelectedAccount(null)}
                aria-label="关闭"
                className="glass glass-thin w-8 h-8 rounded-full flex items-center justify-center text-label-2 active:scale-95 transition-transform"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center py-4 text-center">
              <div className="w-16 h-16 rounded-full glass glass-soft text-label flex items-center justify-center mb-3">
                <span className="material-symbols-rounded text-[30px]">{selectedAccount.icon}</span>
              </div>
              <h3 className="text-[18px] font-semibold text-label">{selectedAccount.name}</h3>
              <p className="text-[12px] text-label-2 mt-0.5">{selectedAccount.subText}</p>
              <p className="text-[28px] font-bold tabular-nums mt-2 text-label tracking-tight">
                {selectedAccount.balance >= 0 ? '' : '-'}¥
                {Math.abs(selectedAccount.balance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="glass glass-soft rounded-[18px] p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-label-2">账户分类</span>
                <span className="font-medium text-label">
                  {selectedAccount.group === 'cash'
                    ? '现金与活期'
                    : selectedAccount.group === 'credit'
                    ? '信用卡/信贷'
                    : '理财/投资'}
                </span>
              </div>
              {selectedAccount.creditLimit && (
                <div className="flex justify-between">
                  <span className="text-label-2">信用总额度</span>
                  <span className="font-medium text-label">
                    ¥{selectedAccount.creditLimit.toLocaleString('zh-CN')}
                  </span>
                </div>
              )}
              {selectedAccount.returnRate && (
                <div className="flex justify-between">
                  <span className="text-label-2">近一年收益率</span>
                  <span className="font-medium text-ios-green-ink">{selectedAccount.returnRate}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAccount(null)}
              className="w-full mt-4 py-3 rounded-[18px] text-white text-[15px] font-semibold bg-[linear-gradient(180deg,#4aa4ff,#007aff)] ring-1 ring-white/40 shadow-[0_12px_26px_-10px_rgba(0,122,255,0.7)] active:scale-[0.98] transition-transform"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
