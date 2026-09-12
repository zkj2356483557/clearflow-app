import {Capacitor} from '@capacitor/core';
import {Haptics, ImpactStyle} from '@capacitor/haptics';

/**
 * 是否运行在 Capacitor 原生外壳（iOS App）里。
 * 网页 / GitHub Pages 上是 false，所有原生分支都会自动跳过。
 */
export const isNativeShell = Capacitor.isNativePlatform();

/**
 * 原生环境初始化：
 *
 * 1. 给 <html> 打上 `native-shell`，让 CSS 隐藏「模拟状态栏」和「模拟 Home 指示条」——
 *    设计稿里这两样是画出来的，真机上系统本来就有，不处理会变成两条状态栏。
 * 2. 状态栏改为覆盖在 WebView 之上，配合 viewport-fit=cover 实现满幅玻璃质感
 *    （否则 WebView 会被安全区压缩，壁纸铺不满屏幕）。
 */
export async function initNativeShell(): Promise<void> {
  if (!isNativeShell) return;

  document.documentElement.classList.add('native-shell');

  try {
    const {StatusBar, Style} = await import('@capacitor/status-bar');
    await StatusBar.setOverlaysWebView({overlay: true});
    // 注意 Capacitor 的命名是反的：Style.Light =「浅色背景用深色文字」
    await StatusBar.setStyle({style: Style.Light});
  } catch {
    // 插件不可用时保持系统默认样式，不影响功能
  }

  try {
    const {SplashScreen} = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    // 同上
  }
}

/** 轻触反馈：仅原生有效，网页端是空操作 */
export function hapticTap(): void {
  if (!isNativeShell) return;
  void Haptics.impact({style: ImpactStyle.Light}).catch(() => {});
}
