import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const LEFT_TABS: { key: TabType; icon: string; label: string }[] = [
  { key: 'timeline', icon: 'receipt_long', label: '明细' },
  { key: 'analytics', icon: 'pie_chart', label: '统计' },
];

const RIGHT_TABS: { key: TabType; icon: string; label: string }[] = [
  { key: 'assets', icon: 'account_balance_wallet', label: '资产' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const renderTab = ({ key, icon, label }: { key: TabType; icon: string; label: string }) => {
    const isActive = currentTab === key;
    return (
      <button
        key={key}
        id={`nav-tab-${key}`}
        onClick={() => onTabChange(key)}
        aria-label={label}
        className={`flex-1 h-11 flex flex-col items-center justify-center gap-0.5 rounded-[18px] transition-all duration-200 ${
          isActive
            ? 'bg-white/70 shadow-[0_1px_2px_rgba(14,32,70,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]'
            : 'active:scale-95'
        }`}
      >
        <span
          className={`material-symbols-rounded text-[22px] ${
            isActive ? 'filled text-ios-blue' : 'text-label-2'
          }`}
        >
          {icon}
        </span>
        <span
          className={`text-[10px] leading-3 tracking-tight ${
            isActive ? 'text-ios-blue font-semibold' : 'text-label-2'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-3 pb-[max(env(safe-area-inset-bottom),8px)]">
      <div className="relative">
        {/* Floating compose action */}
        <button
          id="nav-tab-quick-add"
          aria-label="记一笔"
          onClick={() => onTabChange('quick-add')}
          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[58%] z-20 w-[58px] h-[58px] rounded-full flex items-center justify-center text-white transition-transform duration-200 active:scale-95 bg-[linear-gradient(180deg,#4aa4ff,#007aff)] ring-1 ring-white/50 shadow-[0_16px_34px_-10px_rgba(0,122,255,0.7),inset_0_1px_0_rgba(255,255,255,0.55)] ${
            currentTab === 'quick-add' ? 'scale-105' : ''
          }`}
        >
          <span className="material-symbols-rounded filled text-[30px]">add</span>
        </button>

        <div className="glass glass-strong bg-white/72 rounded-[26px] h-[62px] px-2 flex items-center justify-between">
          {LEFT_TABS.map(renderTab)}
          <span className="w-[64px] shrink-0" aria-hidden="true" />
          {RIGHT_TABS.map(renderTab)}
        </div>
      </div>

      {/* iOS home indicator */}
      <div className="mt-2 h-[5px] w-[134px] mx-auto rounded-full bg-label/25" />
    </nav>
  );
};
