# 清流记账 · App Store 上架指南

当前项目已经从「网页应用」推进到「**可以打开 Xcode 直接 Archive 的原生工程**」。
这份文档说明还差什么、每一步怎么做，以及**最可能被苹果拒绝的地方**。

---

## 0. 为什么是 Capacitor

| 路线 | 工作量 | 说明 |
| --- | --- | --- |
| **Capacitor 套壳**（本项目已接入） | 小 | 复用现有 React 代码，生成真正的 Xcode 工程，可上架 |
| React Native / Expo 重写 | 中 | 交互全原生，但要重写全部 UI |
| SwiftUI 原生重写 | 大 | 体验最好，等于从零再做一遍 |

本项目选 Capacitor 8：它用 **Swift Package Manager**（不需要 CocoaPods），
生成的 `ios/` 是标准 Xcode 工程，苹果审核时与原生工程没有区别。

---

## 1. 两个只能由你本人完成的门槛

这两件事我无法代劳，是上架的前置条件：

### 1.1 安装 Xcode

当前机器上只有 Command Line Tools（已确认：`xcode-select -p` 指向 `/Library/Developer/CommandLineTools`，没有 `/Applications/Xcode.app`）。

- App Store 搜索 Xcode 安装（约 12 GB），或到 <https://developer.apple.com/download/all/> 下载
- 装好后切换命令行工具并首次启动：
  ```bash
  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  xcodebuild -version
  ```
- 首次启动会提示安装 iOS Platform，等它装完

### 1.2 加入 Apple Developer Program

- 年费 **$99（约 ¥688）**，个人账号审核通常 24–48 小时
- 公司账号需要 **D-U-N-S 编号**（邓白氏编码），办理 1–2 周
- 区别：个人账号在 App Store 上显示的卖家名是**你的真实姓名**，公司账号显示公司名
- 申请地址：<https://developer.apple.com/programs/>

---

## 2. 本次已经准备好的部分

- ✅ Capacitor 8 + iOS 原生工程（`outputs/ios/`，SPM，无需 CocoaPods）
- ✅ Bundle ID：`com.clearflow.ledger`；App 显示名：**清流记账**
- ✅ 竖屏锁定、强制浅色外观（玻璃风格基于浅色壁纸）
- ✅ 1024×1024 App 图标，**已压掉 alpha 通道**（带透明通道会被上传拒绝）
- ✅ 品牌化启动屏（替换掉 Capacitor 默认 logo）
- ✅ 原生适配：隐藏设计稿里的「模拟状态栏 / 模拟 Home 指示条」，避免真机上出现两条状态栏
- ✅ 轻触反馈（Haptics）、状态栏叠加样式（Splash / StatusBar 插件已接入）
- ✅ `ITSAppUsesNonExemptEncryption = false`，免去每次上传的出口合规问答
- ✅ App Store 截图：6.9"（1320×2868）与 6.5"（1242×2688）各 5 张 → `work/appstore/`

---

## 3. 上架流程

### 3.1 构建并同步到原生工程

```bash
cd outputs
npm run build
npx cap sync ios      # 等价于 npm run ios:sync
npx cap open ios      # 等价于 npm run ios:open，打开 Xcode
```

**每次改完前端代码都要重新跑这一步**，否则 Xcode 里跑的还是旧页面。

### 3.2 在 Xcode 里配置签名

1. 左侧选中 `App` target → **Signing & Capabilities**
2. **Team** 选择你的开发者账号，勾选 *Automatically manage signing*
3. 确认 Bundle Identifier 全球唯一
   - 若 `com.clearflow.ledger` 被占用（Xcode 会报错），改成 `com.<你的标识>.clearflow`
   - 同时要改 `capacitor.config.ts` 里的 `appId` 并重新 `npx cap sync ios`
4. Version `1.0`、Build `1`（后续每次上传 Build 号必须递增）

### 3.3 真机跑一遍（强烈建议）

连上 iPhone → 顶部选择你的设备 → `Cmd + R`。重点检查：

- 顶部**只有一条**状态栏（不应该出现两组时间/电池）
- 底部 Home 指示条只有系统的**一条**
- 玻璃模糊、动态壁纸、安全区间距正常
- 深色模式下外观没有错乱（已强制 Light）

### 3.4 Archive 并上传

1. 顶部设备选择 **Any iOS Device (arm64)**
2. 菜单 **Product → Archive**
3. Organizer 窗口 → **Distribute App → App Store Connect → Upload**

### 3.5 在 App Store Connect 创建 App

<https://appstoreconnect.apple.com> → 我的 App → **+** → 新建 App

| 字段 | 填写建议 |
| --- | --- |
| 平台 | iOS |
| 名称 | 清流记账（被占用就得换，名称全局唯一） |
| 主要语言 | 简体中文 |
| Bundle ID | 选 `com.clearflow.ledger` |
| SKU | 内部编号，随便填，不对外显示 |

### 3.6 填写元数据

- **副标题**（30 字内）：如「简约清雅的记账与资产管理」
- **描述**：突出「流水明细 / 收支统计 / 快捷记账 / 资产总览」
- **关键词**（100 字符内，逗号分隔）：`记账,账本,理财,预算,支出,收入,资产,财务`
- **分类**：财务（Finance）
- **隐私政策网址**（必填）与**支持网址**（必填）——没有就提交不了
- **年龄分级**：如实填写问卷
- **App 隐私**：如实申报（当前版本不联网、不收集数据 → 选「不收集数据」）
- **截图**：6.9" 必需，直接上传 `work/appstore/6.9-*.png`；6.5" 可选

### 3.7 TestFlight 先自测

上传成功后构建会自动出现在 TestFlight，先自己装一遍再提交审核。
内部测试员即时可用；外部测试需苹果先审核一版（约 1 天）。

### 3.8 提交审核

选择构建版本 → 提交。审核通常 **24–48 小时**。
首次提交建议选「**手动发布**」，通过后再自己点发布。

---

## 4. ⚠️ 最大的风险：审核指南 4.2「最低功能要求」

> 苹果明确拒绝「仅仅是网页套壳」的 App。

**当前这个 App 是纯前端 + 模拟数据**，前端代码全部跑在 WebView 里。
直接提交**被拒概率很高**，被拒理由通常就是 4.2。

### 建议补上的「原生价值」（挑 2–3 项即可，优先级从高到低）

1. **本地数据持久化** —— `@capacitor/preferences` 或 SQLite，让用户记的账真的存下来
   （目前刷新页面数据就回到初始状态，这个不改的话连「演示」都算不上）
2. **本地通知/推送** —— 每日记账提醒、超预算提醒（`@capacitor/local-notifications`）
3. **Face ID / Touch ID 解锁账本** —— 财务类 App 的强说服力功能
4. **桌面小组件（WidgetKit）** —— 显示本月结余，纯原生代码，最能证明不是套壳
5. **快捷指令 / Siri（App Intents）** —— 「嘿 Siri，记一笔 38 块咖啡」
6. **分享账单**（`@capacitor/share`）
7. **iCloud 同步**

### 其他容易踩的条款

- **2.1 完整性**：不能拿演示数据当正式功能；截图里是假数据没关系，但 App 要真的能用
- **5.1.1 隐私**：如果加了账号系统，**必须提供账号删除入口**
- **3.1.1 内购**：将来做付费功能，必须走 Apple 内购（不能用微信/支付宝收款）
- 财务类 App 不需要金融牌照，但**不能提供投资建议**

---

## 5. 中国区上架特别注意

- **App 备案**：中国大陆自 2023 年起推行移动应用备案，Apple 也要求中国区上架的 App
  提供备案信息。这一政策在执行细节上持续调整，**提交前请以 App Store Connect 后台的
  最新提示和工信部要求为准**，不要把本文档当作最终依据。
- 如果卡在备案，可以**先上架其他地区**（如美区、港区），中国区后续再补。
- 中国大陆的财务类 App 不接受虚拟货币相关功能。

---

## 6. 我建议的下一步

1. **你**：装 Xcode + 注册开发者账号（只有你能做，可以并行）
2. **我**：把「原生价值」补进去 —— 数据持久化 + 本地通知 + Face ID 锁，
   这样 4.2 的风险基本可控
3. 然后再走 3.1 → 3.8 的流程

---

## 7. 常见错误速查

| 现象 | 原因与处理 |
| --- | --- |
| 上传被拒：图标包含 alpha 通道 | 本项目已用 Pillow 压成 RGB，重跑 `work/render-assets.mjs` 即可 |
| Xcode 报签名错误 | Team 没选对 / Bundle ID 被占用 |
| App 里显示的是旧页面 | 忘了 `npm run build && npx cap sync ios` |
| 真机顶部两条状态栏 | `src/native.ts` 没生效，检查 `<html>` 是否有 `native-shell` 类 |
| 玻璃效果变成纯色 | 构建后 `backdrop-filter` 前缀问题，见 README「修复记录」 |
| 提交按钮灰色不可点 | 缺隐私政策网址 / 截图尺寸不符 / 有未填的必填项 |
| 被拒 4.2 | 按第 4 节补原生功能，然后在 Resolution Center 回复说明 |
