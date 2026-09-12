import React, { useEffect, useState } from 'react';
import { TabType } from '../types';
import { APP_AVATAR, APP_LOGO } from '../data/mockData';
import { isNativeShell } from '../native';

interface HeaderProps {
  currentTab: TabType;
  onOpenProfile: () => void;
}

const TAB_TITLE: Record<TabType, string> = {
  timeline: 'Timeline',
  analytics: 'Analytics',
  'quick-add': 'Quick Add',
  assets: 'Assets',
};

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenProfile }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-3 pt-[max(env(safe-area-inset-top),10px)]">
      {/* iOS 状态栏（模拟）：仅在网页版绘制。原生 App 里系统状态栏已经在那里了，
          再画一条会变成两条时间 + 两组电池图标。对应高度由 --app-status-bar-h 让给系统。 */}
      {!isNativeShell && (
        <div className="h-7 flex items-center justify-between px-2 text-label">
          <span className="text-[15px] font-semibold tabular-nums tracking-tight">{clock}</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-rounded text-[15px]">signal_cellular_alt</span>
            <span className="material-symbols-rounded text-[15px]">wifi</span>
            <span className="material-symbols-rounded text-[17px]">battery_full</span>
          </div>
        </div>
      )}

      {/* Floating glass navigation bar */}
      <div className="glass glass-strong bg-white/70 rounded-[22px] h-[54px] px-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-[12px] glass-soft flex items-center justify-center overflow-hidden shrink-0">
            <img
              alt="清流记账 Logo"
              className="w-7 h-7 object-contain"
              src={APP_LOGO}
              onError={(e) => {
                // Fallback if network blocked
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] leading-3 text-label-2 font-medium tracking-tight">清流记账</span>
            <h1 className="text-[17px] leading-6 font-semibold text-label tracking-tight truncate">
              {TAB_TITLE[currentTab]}
            </h1>
          </div>
        </div>

        <button
          id="header-profile-btn"
          aria-label="用户个人中心"
          onClick={onOpenProfile}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        >
          <img
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 shadow-[0_2px_8px_rgba(14,32,70,0.18)]"
            src={APP_AVATAR}
          />
        </button>
      </div>
    </header>
  );
};
