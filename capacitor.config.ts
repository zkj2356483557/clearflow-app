import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  // Bundle Identifier：上架后不可更改，需与 App Store Connect 里的一致
  appId: 'com.clearflow.ledger',
  // 仅用于生成 Xcode 工程（保持 ASCII）；App 显示名在 ios/App/App/Info.plist 的
  // CFBundleDisplayName 中设置为「清流记账」
  appName: 'ClearFlow',
  webDir: 'dist',
  ios: {
    // 让 WebView 内容避开刘海/灵动岛与 Home 指示条
    contentInset: 'always',
    backgroundColor: '#eaf1ff',
  },
};

export default config;
