import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] border-t border-slate-200/50">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-3 relative">
        {/* 明细 */}
        <button
          id="nav-tab-timeline"
          onClick={() => onTabChange('timeline')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors group ${
            currentTab === 'timeline' ? 'text-black font-semibold' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-transform group-active:scale-90 ${
              currentTab === 'timeline' ? 'filled' : ''
            }`}
          >
            receipt_long
          </span>
          <span className="text-[11px] leading-[14px] mt-0.5 tracking-wide">明细</span>
        </button>

        {/* 统计 */}
        <button
          id="nav-tab-analytics"
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors group ${
            currentTab === 'analytics' ? 'text-black font-semibold' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-transform group-active:scale-90 ${
              currentTab === 'analytics' ? 'filled' : ''
            }`}
          >
            pie_chart
          </span>
          <span className="text-[11px] leading-[14px] mt-0.5 tracking-wide">统计</span>
        </button>

        {/* 记账 (Floating Center Action) */}
        <button
          id="nav-tab-quick-add"
          aria-label="记一笔"
          onClick={() => onTabChange('quick-add')}
          className="flex flex-col items-center justify-center -translate-y-3.5 min-w-[56px] min-h-[56px] group focus:outline-none"
        >
          <div
            className={`w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.18)] active:scale-92 transition-all duration-150 ${
              currentTab === 'quick-add' ? 'ring-3 ring-black/20 scale-105' : 'hover:scale-105'
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </div>
          <span
            className={`text-[11px] leading-[14px] mt-1 tracking-wide ${
              currentTab === 'quick-add' ? 'text-black font-semibold' : 'text-[#45464d] group-hover:text-[#0b1c30]'
            }`}
          >
            记账
          </span>
        </button>

        {/* 资产 */}
        <button
          id="nav-tab-assets"
          onClick={() => onTabChange('assets')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors group ${
            currentTab === 'assets' ? 'text-black font-semibold' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-transform group-active:scale-90 ${
              currentTab === 'assets' ? 'filled' : ''
            }`}
          >
            account_balance_wallet
          </span>
          <span className="text-[11px] leading-[14px] mt-0.5 tracking-wide">资产</span>
        </button>
      </div>
    </nav>
  );
};
