import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initNativeShell} from './native';

// 原生外壳（iOS App）下切换状态栏样式并隐藏设计稿里的模拟状态栏
void initNativeShell();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
