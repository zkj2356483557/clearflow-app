# 清流记账 · ClearFlow

移动端记账 PWA 风格应用：AI Studio 生成代码 + Stitch 设计稿，整理为可直接运行的 React 项目。

- 技术栈：React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · lucide-react
- 设计来源：Google Stitch 设计稿（4 个页面：明细 / 统计 / 记账 / 资产）
- 代码来源：Google AI Studio 项目「清流记账 (ClearFlow)」导出包

## 本地运行

```bash
npm install
npm run dev        # http://localhost:3000
```

构建与预览：

```bash
npm run build      # 产物输出到 dist/
npm run preview
npm run lint       # tsc --noEmit 类型检查
```

应用为移动端布局（`max-w-md`），建议用 430×932 视口查看。

## 目录结构

```
src/
  App.tsx              # 应用壳：状态、tab 路由、数据流
  components/
    Header.tsx         # 顶部栏（月份、收支总览）
    BottomNav.tsx      # 底部 Tab 导航
    TimelineView.tsx   # 明细
    AnalyticsView.tsx  # 统计
    QuickAddView.tsx   # 记账（含计算器键盘）
    AssetsView.tsx     # 资产
    Modals.tsx         # 弹窗集合
  data/mockData.ts     # 交易、账户、分类、预算等 mock 数据
  types.ts             # 类型定义
```

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

## 部署

构建产物为纯静态文件，可直接部署到任意静态托管：

```bash
npm run build
# 将 dist/ 目录发布到 GitHub Pages / Vercel / Netlify / Cloudflare Pages 等
```
