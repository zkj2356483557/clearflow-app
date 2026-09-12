# 清流记账 · ClearFlow

移动端记账应用（PWA 风格单页应用）：Google AI Studio 生成代码 + Google Stitch 设计稿整理而成，
界面按 **iOS 26 Liquid Glass** 语言重新设计，可直接运行，运行时不依赖任何外部 CDN。

- 技术栈：React 19 · TypeScript · Vite 6 · Tailwind CSS 4
- 设计语言：iOS 26 Liquid Glass —— 毛玻璃材质、iOS 系统色、SF 风格圆角图标、状态栏与 Home 指示条
- 设计来源：Google Stitch 设计稿（明细 / 统计 / 记账 / 资产 四个页面）
- 代码来源：Google AI Studio 项目「清流记账 (ClearFlow)」导出包

## 本地运行

```bash
npm install
npm run dev        # http://localhost:3000
```

构建与检查：

```bash
npm run build      # 产物输出到 dist/
npm run preview    # 预览生产构建
npm run lint       # tsc --noEmit 类型检查
```

应用为移动端布局（`max-w-md`），建议用 430×932 视口查看。

## 目录结构

```
src/
  App.tsx                    # 应用壳：状态、tab 路由、数据流、Toast
  index.css                  # 设计系统：壁纸、玻璃材质、系统色、动效、安全区
  native.ts                  # 原生外壳适配：状态栏、Home 指示条、轻触反馈
  assets/
    app-icon.svg             # 应用图标（矢量，本地资源）
    avatar.svg               # 用户头像（矢量，本地资源）
    fonts/material-symbols.woff2  # 图标字体子集（60 个图标，80 KB）
  components/
    Header.tsx               # iOS 状态栏 + 悬浮玻璃导航栏
    BottomNav.tsx            # 悬浮玻璃 Tab Bar + 记一笔按钮 + Home 指示条
    TimelineView.tsx         # 明细（含交易详情底部抽屉）
    AnalyticsView.tsx        # 统计（环形图 / 趋势柱状图 / 分类排行）
    QuickAddView.tsx         # 记账（玻璃键盘）
    AssetsView.tsx           # 资产（含账户详情底部抽屉）
    Modals.tsx               # 搜索 / 选月 / 我的 / 新增账户 / 预算 / 汇率 底部抽屉
  data/mockData.ts           # 交易、账户、分类、预算等 mock 数据
  types.ts                   # 类型定义

public/                      # favicon / PWA 图标 / manifest.webmanifest
resources/                   # 图标与启动屏的矢量源文件（渲染成各尺寸 PNG）
  app-icon-square.svg        # App Store 图标（满幅方形、无圆角，iOS 自行裁切）
  splash.svg                 # 启动屏
  favicon.svg                # 站点图标
ios/                         # Capacitor 生成的 Xcode 工程（SPM，无需 CocoaPods）
docs/APP_STORE_上架指南.md   # 上架流程、审核风险、常见错误
scripts/
  collect-icons.py           # 扫描源码中用到 Material Symbols 图标名
  trim-icon-font.py          # 裁剪图标字体的 ligature 表
```

## iOS 玻璃风格实现要点

- **壁纸层**：`App.tsx` 中的 `.ios-wallpaper` 固定铺底，5 个彩色光斑（`.blob-a` ~ `.blob-e`）缓慢漂移，
  为上方玻璃提供可折射的彩色底。
- **材质层**：`index.css` 的 `.glass` 统一提供 `backdrop-filter: blur() saturate(180%)`、白色渐变高光、
  1px 高光描边与内外阴影；`.glass-thin` / `.glass-strong` / `.glass-soft` 提供不同厚度，
  深色 `.glass-hud` 用于 Toast。
- **系统色**：`@theme` 中定义 iOS 系统色（`ios-blue` / `ios-green` / `ios-red` / `ios-orange` /
  `ios-purple` / `ios-teal` 等）与标签层级色（`label` / `label-2` / `label-3`）。
- **图标**：使用 Rounded 风格图标字体，观感接近 SF Symbols；Tab Bar 选中态切换为实心（FILL 1）。
- **交互**：底部抽屉（含抓手条、`animate-sheetUp` 动画）、分段控件、iOS 风格滑杆、按压回弹。

## 自托管图标字体（离线可用）

图标字体不做 CDN 依赖，仓库内自带按需裁剪的子集：

```bash
# 1. 抓取 Google 官方 codepoints 表
curl -o /tmp/codepoints.txt \
  "https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsRounded%5BFILL%2CGRAD%2Copsz%2Cwght%5D.codepoints"

# 2. 收集源码里用到的图标名
python3 scripts/collect-icons.py /tmp/codepoints.txt src /tmp/icons.txt

# 3. 裁剪 ligature 表（否则子集化会把 4000+ 图标全部拉回来）
pip install fonttools brotli
python3 scripts/trim-icon-font.py /tmp/ms-full.woff2 /tmp/ms-trimmed.ttf /tmp/icons.txt /tmp/codepoints.txt

# 4. 生成 woff2 子集
pyftsubset /tmp/ms-trimmed.ttf --text-file=/tmp/icons.txt --layout-features='*' \
  --flavor=woff2 --output-file=src/assets/fonts/material-symbols.woff2
```

原始可变字体 5.4 MB → 子集 80 KB，并保留 `FILL` / `wght` 可变轴。

## 相比 AI Studio 导出包修复的问题

1. 明细页实时计算总额（¥410）与设计稿数值不一致 → 补齐 mock 交易，使当月支出 ¥6,020 / 收入 ¥18,500 / 结余 ¥12,480 与设计稿一致
2. 记账页账户名与账户数据不匹配导致余额不联动 → 账户列表改为从 `accounts` 数据派生
3. 统计页月份显示 2023-10，与其他页 2024 年不一致 → 统一接收 `selectedMonth`
4. 预算卡片数据硬编码 → 依据当月支出与 `MONTHLY_BUDGET` 动态计算
5. 分类名称不统一（日用杂货/数码娱乐 vs 日常杂货/数码数娱）→ 统一命名
6. 明细页分组标题显示原始日期串 → 格式化为「10月18日 星期五」
7. 转账被当作收入计入余额 → 余额增量只统计收入
8. Toast 遮挡页面控件 → 下移至底部导航上方
9. 默认进入「资产」页 → 改为「明细」
10. 部署适配：`vite.config.ts` 增加 `base: './'`，支持子路径托管

## iOS 玻璃改版中修复的问题

11. Stitch 设计稿引用的远程图片（Logo / 头像）已失效 → 改为本地矢量资源，`APP_LOGO` / `APP_AVATAR` 走 Vite 资源引用
12. 页面内底部抽屉被固定导航栏挡住 → 移除 `<main>` 的 `z-index`，抽屉层级高于 Header / Tab Bar
13. Google Fonts 图标字体在弱网或受限网络下会退化成 "close"、"coffee" 等文字 → 改为本地 80 KB 字体子集
14. 搜索弹层只能靠「取消」关闭 → 支持点击遮罩关闭
15. `animate-fadeIn` 类名此前无对应关键帧、`pt-safe` / `pb-safe` 未定义 → 补齐动效与安全区工具类
16. 悬浮「记一笔」按钮压住「完成记账」主按钮（实测水平重叠 26 px）→ 进入记一笔页面时隐去 FAB，该页已有主按钮，此时按 + 也无额外含义

## 打进 iOS App（Capacitor）

除了网页版，本项目还接入了 Capacitor 8，可直接生成 Xcode 工程并上架 App Store。
完整上架流程、审核风险与常见错误见 **[docs/APP_STORE_上架指南.md](docs/APP_STORE_上架指南.md)**。

```bash
npm run ios:sync    # = npm run build && npx cap sync ios
npm run ios:open    # 在 Xcode 中打开 ios/App/App.xcodeproj
```

重新生成图标 / 启动屏 / PWA 素材（依赖 Playwright 与 Pillow）：

```bash
cd work && node render-assets.mjs      # resources/*.svg → iOS 图标、启动屏、PWA 图标
cd work && node appstore-shots.mjs     # 生成 6.9" / 6.5" 两套 App Store 截图
```

### 原生外壳适配（避免「两条状态栏」）

设计稿里画了 iOS 状态栏和 Home 指示条，网页上看是加分的，真机上叠上系统自己的就成了两条。
`src/native.ts` 会检测 `Capacitor.isNativePlatform()`，在原生环境下给 `<html>` 加 `native-shell` 类：

- 隐藏模拟状态栏与模拟 Home 指示条
- 通过 `--app-status-bar-h` / `--app-home-indicator-h` 把占位高度交还给系统安全区
- 状态栏改为覆盖在 WebView 之上（`setOverlaysWebView`），配合 `viewport-fit=cover` 实现满幅玻璃

网页版不会命中这些分支，可以用 `work/verify-native-shell.mjs` 验证两种模式：

```bash
cd work && node verify-native-shell.mjs   # 注入 CapacitorCustomPlatform 模拟 iOS 环境
```

## 部署

构建产物为纯静态文件，可直接部署到任意静态托管：

```bash
npm run build
# 将 dist/ 目录发布到 GitHub Pages / Vercel / Netlify / Cloudflare Pages 等
```

线上地址：https://zkj2356483557.github.io/clearflow-app/
