import React, { useState } from 'react';
import { TabType, Transaction, AccountItem } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_ACCOUNTS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TimelineView } from './components/TimelineView';
import { AnalyticsView } from './components/AnalyticsView';
import { QuickAddView } from './components/QuickAddView';
import { AssetsView } from './components/AssetsView';
import {
  SearchModal,
  MonthPickerModal,
  ProfileModal,
  AddAccountModal,
  AdjustBudgetModal,
  CurrencyConverterModal,
} from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('timeline');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [selectedMonth, setSelectedMonth] = useState<string>('2024年 10月');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState<boolean>(false);
  const [isAdjustBudgetOpen, setIsAdjustBudgetOpen] = useState<boolean>(false);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState<boolean>(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance if matching account exists
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.name === newTx.account) {
          const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
          return {
            ...acc,
            balance: acc.balance + delta,
          };
        }
        return acc;
      })
    );
  };

  const handleAddAccount = (newAccount: AccountItem) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  return (
    <div className="relative min-h-screen flex flex-col antialiased select-none">
      {/* iOS wallpaper — the colour field the glass refracts */}
      <div className="ios-wallpaper" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
        <span className="blob blob-d" />
        <span className="blob blob-e" />
      </div>
      {/* Fixed Top Header */}
      <Header currentTab={currentTab} onOpenProfile={() => setIsProfileOpen(true)} />

      {/* Main Scrollable Content Area */}
      <main className="relative flex-1 flex flex-col w-full max-w-md mx-auto pt-app-header pb-app-nav">
        {currentTab === 'timeline' && (
          <TimelineView
            selectedMonth={selectedMonth}
            transactions={transactions}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCalendar={() => setIsMonthPickerOpen(true)}
            onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            selectedMonth={selectedMonth}
            onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
          />
        )}

        {currentTab === 'quick-add' && (
          <QuickAddView
            accounts={accounts}
            onAddTransaction={handleAddTransaction}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'assets' && (
          <AssetsView
            transactions={transactions}
            accounts={accounts}
            onOpenAddAccount={() => setIsAddAccountOpen(true)}
            onOpenAdjustBudget={() => setIsAdjustBudgetOpen(true)}
            onOpenCurrencyConverter={() => setIsCurrencyConverterOpen(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />

      {/* Success / Info Toast Popup */}
      <div
        id="toast-success"
        className={`fixed bottom-[calc(env(safe-area-inset-bottom,0px)+150px)] left-1/2 -translate-x-1/2 z-50 glass-hud rounded-full pl-3 pr-4 py-2.5 flex items-center gap-2 transition-all duration-300 ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <span className="material-symbols-rounded text-ios-green text-[20px]">check_circle</span>
        <span className="text-[13px] font-medium" id="toast-message">
          {toastMessage}
        </span>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        transactions={transactions}
      />

      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        selectedMonth={selectedMonth}
        onSelectMonth={(m) => {
          setSelectedMonth(m);
          showToast(`已切换至 ${m}`);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onShowToast={showToast}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
        onShowToast={showToast}
      />

      <AdjustBudgetModal
        isOpen={isAdjustBudgetOpen}
        onClose={() => setIsAdjustBudgetOpen(false)}
        onShowToast={showToast}
      />

      <CurrencyConverterModal
        isOpen={isCurrencyConverterOpen}
        onClose={() => setIsCurrencyConverterOpen(false)}
      />
    </div>
  );
}
