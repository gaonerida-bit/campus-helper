# 校招助手 (Campus Helper) — 产品上下文文档

> 本文档供 AI Agent 接手时快速理解项目现状，包含技术架构、已实现功能、数据模型、设计规范和待办事项。

---

## 一、产品定位

**校招助手**是一款面向 2026 届应届生（用户：Nerida）的全流程校招管理 Web 应用，集投递进度追踪、AI 模拟面试、简历管理、Offer 对比、笔试准备、联系人管理于一体。

- **当前阶段**：私人工具（MVP 已完成），部署于 Vercel
- **目标用户**：Nerida 本人，后续可扩展至所有应届生
- **核心价值**：用结构化工具替代散乱的备忘录/表格，减轻求职焦虑，提升效率

---

## 二、技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Next.js | 16.2.7 | App Router，客户端为主 |
| 语言 | TypeScript | ^5 | 全项目严格类型 |
| UI | Tailwind CSS | ^4 | CSS 变量驱动莫兰迪主题 |
| 状态管理 | React Context + useReducer | — | 集中式 AppState |
| 数据持久化 | localStorage（主）+ Supabase（可选） | — | 双层持久化 |
| AI | Kimi (Moonshot) API | moonshot-v1-8k | 需用户自配 API Key |
| 云数据库 | Supabase (PostgreSQL) | ^2.108.1 | 可选，配置环境变量启用 |
| 打印/导出 | react-to-print | ^3.3.0 | 简历 PDF 导出 |
| 部署 | Vercel | — | 零配置 CI/CD |
| PWA | Service Worker + Web Manifest | — | 支持手机添加到主屏幕 |

---

## 三、项目目录结构

```
campus-helper-main/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── page.tsx                  # 首页（重定向到 /dashboard）
│   │   ├── layout.tsx                # 根布局，注入 Provider、PWA
│   │   ├── globals.css               # 全局样式 + CSS 变量（莫兰迪色系）
│   │   ├── dashboard/page.tsx        # 数据看板
│   │   ├── applications/
│   │   │   ├── page.tsx              # 投递管理（看板/表格/卡片三视图）
│   │   │   └── (detail)/[id]/page.tsx # 投递详情页
│   │   ├── interview/page.tsx        # 面试管理（日程+题库+AI模拟面试）
│   │   ├── exam/page.tsx             # 笔试准备（题库+分类+难度筛选）
│   │   ├── contacts/page.tsx         # 联系人管理
│   │   ├── offer/page.tsx            # Offer 管理与对比
│   │   ├── ai/page.tsx               # AI 助手（自由对话）
│   │   ├── resume/page.tsx           # 简历管理（多版本+PDF导出）
│   │   ├── calendar/page.tsx         # 日历（月视图+事件管理）
│   │   ├── timeline/page.tsx         # 时间线（投递动态回顾）
│   │   ├── pool/page.tsx             # 备选库（未投递岗位暂存）
│   │   ├── records/page.tsx          # 记录页
│   │   └── settings/page.tsx         # 设置（API Key、目标、数据管理）
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx         # 整体布局（侧边栏+主区域）
│   │   │   ├── Header.tsx            # 页面顶部标题栏
│   │   │   └── Navigation.tsx        # 侧边导航（含移动端底部Tab）
│   │   ├── UI/
│   │   │   ├── Button.tsx            # 通用按钮（primary/secondary/ghost）
│   │   │   ├── StatCard.tsx          # 统计卡片
│   │   │   ├── Toast.tsx             # 消息提示
│   │   │   ├── ViewToggle.tsx        # 视图切换（看板/表格/卡片）
│   │   │   └── GlobalSearch.tsx      # 全局搜索（Ctrl+K 唤起）
│   │   ├── AI/
│   │   │   └── AIMockInterview.tsx   # AI 模拟面试组件（全屏对话）
│   │   ├── Resume/
│   │   │   ├── ExportResumeModal.tsx # 简历导出弹窗
│   │   │   └── PrintableResume.tsx   # 可打印简历模板
│   │   ├── Reports/
│   │   │   └── WeeklyReport.tsx      # 周报生成组件
│   │   ├── Settings/
│   │   │   └── DataManagement.tsx    # 数据导入/导出/清除
│   │   ├── NotificationProvider.tsx  # 浏览器通知管理
│   │   ├── Providers.tsx             # 顶层 Provider 集合
│   │   └── PWAProvider.tsx           # PWA 安装提示
│   ├── context/
│   │   ├── DataContext.tsx           # 核心数据层（AppState + 所有 hooks）
│   │   └── PipelineContext.tsx       # 投递流程节点配置（自定义 pipeline）
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.tsx  # 全局键盘快捷键（Ctrl+K 搜索等）
│   │   └── useSupabaseSync.ts        # Supabase 同步 hook
│   └── lib/
│       ├── kimi.ts                   # Kimi AI 服务封装（单例+流式输出）
│       ├── supabase.ts               # Supabase 客户端初始化
│       ├── supabase-service.ts       # Supabase CRUD 操作封装
│       └── sampleData.ts             # 演示数据（首次初始化时注入）
├── supabase/
│   └── migration.sql                 # 数据库建表 SQL
├── public/
│   ├── manifest.json                 # PWA manifest
│   ├── sw.js                         # Service Worker
│   └── icons/                        # PWA 图标（192/512）
├── docs/
│   └── 需求文档.md                    # 完整 PRD（v1.1）
├── README.md                          # 快速上手文档
├── DEPLOY.md                          # Vercel 部署指南
├── CLAUDE.md / AGENTS.md              # AI 开发规范
└── next.config.ts / tsconfig.json     # 工程配置
```

---

## 四、数据模型

所有类型定义在 `src/context/DataContext.tsx`，持久化 key 为 `campus-helper-data`（localStorage）。

### 核心实体

| 实体 | 说明 | 关键字段 |
|------|------|---------|
| `Application` | 投递记录 | id, company, position, stage(流程节点名), status(pending/interviewing/offer/rejected), appliedDate, url, notes |
| `Interview` | 面试记录 | id, applicationId, company, position, type(技术面/HR面/群面/笔试...), date, time, status(upcoming/completed/cancelled), rating, questions |
| `Contact` | 联系人 | id, name, company, position, relationship(校友/内推人/HR/面试官/同学/其他), email/phone/wechat |
| `CompanyProfile` | 公司档案 | id, name, industry, size, salary, benefits, culture |
| `Exam` | 笔试记录 | id, company, type(笔试/面试/测评/OT), date, time, status, applicationId |
| `Question` | 题库题目 | id, category, type(选择/填空/编程/简答), difficulty(easy/medium/hard), question, answer, starred |
| `CalendarEvent` | 日历事件 | id, date, title, type(interview/test/deadline/milestone/custom), company |
| `Offer` | Offer 记录 | id, company, position, salary{base/bonus/stock/total}, location, benefits, pros, cons, recommendation |
| `Resume` | 简历 | id, title, content(Markdown), version, isDefault |
| `UserProfile` | 用户配置 | name, title, targetPositions, targetLocations, goals{applications/interviews/replies}, settings{noResponseDays/monthlyBudget/theme} |
| `ChatMessage` | AI 对话记录 | id, role(user/assistant), content, timestamp |
| `Activity` | 操作日志 | id, type, action, company, position, timestamp（最多保留100条） |

### AppState（全局状态树）

```typescript
{
  applications: Application[];
  interviews: Interview[];
  contacts: Contact[];
  companyProfiles: CompanyProfile[];
  exams: Exam[];
  questions: Question[];
  events: CalendarEvent[];
  offers: Offer[];
  resumes: Resume[];
  userProfile: UserProfile;
  chatHistory: ChatMessage[];
  activities: Activity[];
  isLoading: boolean;
  isHydrated: boolean;
}
```

---

## 五、已实现功能清单

### 5.1 投递管理（`/applications`）
- 三视图切换：看板视图（按状态 or 按流程阶段分组）、表格视图、卡片视图
- 看板可按「流程阶段」或「状态」分列
- 添加/删除/查看投递（点卡片进详情页）
- 备选库：stage=`未投递` 的卡片归入备选，可一键转为已投递
- 一键跳转：记录了 URL 的投递可直接跳转原链接
- 搜索筛选（公司/岗位名）+ 状态筛选

### 5.2 投递详情（`/applications/[id]`）
- 查看单条投递完整信息
- 编辑各字段

### 5.3 面试管理（`/interview`）
- 面试日程列表（即将/已完成/已取消）
- 面试题库（按分类/难度筛选，题目收藏）
- AI 模拟面试（`AIMockInterview` 组件）：
  - 输入公司、职位、面试类型、时长
  - 全屏对话界面，倒计时
  - 面试结束自动生成总结报告
  - 需要 Kimi API Key

### 5.4 笔试准备（`/exam`）
- 笔试记录（即将/已完成）
- 题库练习（选择/填空/编程/简答）
- 按类别和难度筛选
- 题目收藏（starred）

### 5.5 联系人管理（`/contacts`）
- 添加/编辑/删除联系人
- 按关系分类（校友/内推人/HR/面试官/同学/其他）
- 按关系筛选

### 5.6 Offer 管理（`/offer`）
- 添加 Offer（公司/职位/薪资/地点/福利/优缺点）
- Offer 列表展示
- 推荐操作（accept/negotiate/reject）

### 5.7 AI 助手（`/ai`）
- 自由对话界面（类 ChatGPT）
- 使用 Kimi API，流式输出（streaming）
- 系统 prompt 预设为温暖的求职陪伴风格
- 对话历史保存在 AppState.chatHistory

### 5.8 简历管理（`/resume`）
- 多简历版本管理（标题/内容/版本号）
- Markdown 内容编辑
- PDF 导出（react-to-print）
- 设为默认简历
- 复制副本

### 5.9 日历（`/calendar`）
- 月视图日历
- 事件类型：面试/笔试/截止日期/里程碑/自定义
- 添加/删除日历事件

### 5.10 数据看板（`/dashboard`）
- 投递总数/待面试/Offer数/联系人数 4张统计卡
- 投递 Pipeline 进度条（pending/interviewing/offer/rejected）
- 面试数据（已完成/通过率/平均评分/即将到来）
- 近7天投递趋势柱状图
- 投递最多的公司排行
- 目标进度条（投递目标/面试目标/回复目标）
- 最近动态 Feed
- 周报（WeeklyReport 组件）

### 5.11 设置（`/settings`）
- Kimi API Key 配置
- 用户信息（姓名/职位/目标城市/目标岗位）
- 求职目标数字设置
- 数据管理（导出 JSON/导入 JSON/清除全部数据）

### 5.12 全局功能
- 全局搜索（`Ctrl+K`）：跨模块搜索公司/岗位/联系人
- 键盘快捷键（`useKeyboardShortcuts`）
- 浏览器通知提醒（`NotificationProvider`）
- PWA：可安装到手机主屏幕，有 Service Worker 缓存
- 样本数据：首次打开自动注入演示数据（`sampleData.ts`）

---

## 六、数据持久化策略

### 优先级（DataContext 启动时）：
1. **Supabase**（如配置环境变量）：从云端加载，并以此为准
2. **localStorage**（回退）：key 为 `campus-helper-data`

### 写入策略：
- 每次 state 变更 → 同步写入 localStorage
- 每次 state 变更 → 3秒防抖后写入 Supabase（如已配置）

### Supabase 配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```
建表 SQL 见 `supabase/migration.sql`。

---

## 七、AI 集成

### Kimi 服务（`src/lib/kimi.ts`）
- 单例模式：`getKimiService()` 返回全局实例
- 支持普通调用（`chat()`）和流式输出（`chatStream()`）
- API Key 存储在 localStorage key `kimi-api-key`
- 月度预算追踪（默认 100 元上限，基于 token 估算费用）
- 支持切换模型：`moonshot-v1-8k / 32k / 128k`

### 系统 Prompt 人格设定：
- 温暖、专业、有同理心的求职伙伴
- 被拒时：先共情 → 再鼓励 → 最后给行动建议
- 永远给具体的下一步行动，不说"别焦虑"

---

## 八、设计规范（莫兰迪色系）

所有颜色通过 CSS 变量定义（`globals.css`），支持多主题切换：

| 变量 | 颜色 | 用途 |
|------|------|------|
| `--primary` | `#8B9A7D` 橄榄绿 | 主色、按钮、强调 |
| `--success` | `#7A9E7E` 苔绿 | 成功状态、薪资显示 |
| `--warning` | `#D4A574` 暖棕 | 警告、备选库 |
| `--error` | `#C4938A` 低饱和红 | 已拒绝、错误 |
| `--background` | `#F5F2EE` 暖白 | 页面背景 |
| `--surface` | `#FFFFFF` | 卡片背景 |
| `--muted` | `#F0EDE8` | 输入框/次级背景 |
| `--foreground` | `#4A4A4A` 深灰 | 主文字 |
| `--foreground-light` | `#6B6B6B` | 次要文字 |
| `--foreground-muted` | `#9B9B9B` | 辅助文字 |
| `--border` | `rgba(0,0,0,0.06)` | 边框 |

**组件规范**：圆角 8px（卡片）/ 6px（按钮）/ 4px（输入框），轻阴影，300ms ease 过渡。

---

## 九、Pipeline 系统（`PipelineContext`）

投递记录的 `stage` 字段对应 Pipeline 节点名称（字符串），节点配置存于 `PipelineContext`。

预设节点（可在设置中自定义）：
- 未投递（备选库）
- 投递 → 简历筛选 → 在线测评 → 一面 → 二面 → 三面 → HR面 → Offer → 拒绝

每个节点有：`id`、`name`、`icon`、`color`。

---

## 十、环境变量

| 变量 | 说明 | 是否必须 |
|------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 可选（不填则纯本地） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 可选 |
| `NEXT_PUBLIC_KIMI_API_KEY` | Kimi API Key（也可在设置页填写）| 可选 |

---

## 十一、当前已知问题 / 待完善点

1. **投递详情页** (`/applications/[id]`)：UI 较简单，缺乏流程节点时间线可视化
2. **面试复盘**：PRD 设计了录音/转写/AI分析，目前仅有基础记录字段，深度复盘尚未实现
3. **Offer 对比**：PRD 设计了雷达图多维度对比，目前仅有列表展示，无可视化对比
4. **简历生成**：PRD 设计了「基于 JD + 素材库 AI 生成定制简历」，目前仅有多版本管理
5. **成就徽章系统**：PRD 设计了游戏化成就，尚未实现
6. **浏览器插件**：PRD 设计的一键抓取岗位信息插件尚未开发
7. **公司档案 AI 分析**：公司资料模块有数据结构，但 AI 自动分析未接入
8. **笔试错题笔记**：数据结构已定义，UI 页面基础功能可用，但 AI 辅助错因分析未实现
9. **联系人久未联系提醒**：数据字段存在，提醒逻辑未实现
10. **数据看板深度**：转化漏斗、简历效果追踪等图表未实现

---

## 十二、快速上手开发

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 部署到 Vercel
npx vercel --prod
```

首次打开会自动注入演示数据，可在设置页「清除全部数据」重置。

---

## 十三、核心文件索引

| 文件 | 作用 |
|------|------|
| `src/context/DataContext.tsx` | **最核心文件**：所有数据类型定义、全局状态、CRUD hooks |
| `src/context/PipelineContext.tsx` | 投递流程节点配置 |
| `src/lib/kimi.ts` | Kimi AI 服务，包含系统 prompt |
| `src/lib/supabase-service.ts` | Supabase 数据读写 |
| `src/lib/sampleData.ts` | 演示数据（首次初始化） |
| `src/app/globals.css` | 莫兰迪色系 CSS 变量定义 |
| `src/components/Layout/AppLayout.tsx` | 页面整体布局 |
| `src/components/Layout/Navigation.tsx` | 侧边栏导航 |
| `src/components/AI/AIMockInterview.tsx` | AI 模拟面试全屏组件 |
| `docs/需求文档.md` | 完整 PRD，了解设计意图必读 |
| `supabase/migration.sql` | 数据库建表 SQL |

---

*文档生成时间：2026-07-07，基于 campus-helper-main 代码库现状。*
