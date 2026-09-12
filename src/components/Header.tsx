import React from 'react';
import { TabType } from '../types';
import { APP_AVATAR, APP_LOGO } from '../data/mockData';

interface HeaderProps {
  currentTab: TabType;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenProfile }) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'timeline':
        return 'Timeline';
      case 'analytics':
        return 'Analytics';
      case 'quick-add':
        return 'Quick Add';
      case 'assets':
        return 'Assets';
      default:
        return 'Timeline';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="h-16 px-4 max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            alt="清流记账 Logo"
            className="h-8 w-auto object-contain rounded-lg shadow-xs"
            src={APP_LOGO}
            onError={(e) => {
              // Fallback if network blocked
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="text-[12px] leading-4 text-[#45464d] font-medium tracking-tight">清流记账</span>
            <h1 className="text-[18px] leading-6 font-semibold text-[#0b1c30] tracking-tight -mt-0.5">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="header-profile-btn"
            aria-label="用户个人中心"
            onClick={onOpenProfile}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eff4ff] active:scale-95 transition-all"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
              src={APP_AVATAR}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
