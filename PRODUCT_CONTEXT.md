# 校招助手 (Campus Helper) — 产品上下文文档

> 本文档供 AI Agent 接手时快速理解项目现状，包含技术架构、已实现功能、数据模型、已完成的工程工作、设计规范和待办事项。
> 最后更新：2026-07-14

---

## 一、产品定位

**校招助手**是一款面向 2026 届应届生（用户：Nerida）的全流程校招管理 Web 应用，集投递进度追踪、AI 模拟面试、简历管理、Offer 对比、笔试准备、联系人管理于一体。

- **当前阶段**：私人工具（MVP 已完成），已部署至 Vercel + GitHub，Supabase 云同步已接入并可用
- **目标用户**：Nerida 本人，后续可扩展至所有应届生
- **核心价值**：用结构化工具替代散乱的备忘录/表格，减轻求职焦虑，提升效率
- **线上地址**：https://campus-helper-main.vercel.app
- **代码仓库**：https://github.com/gaonerida-bit/campus-helper

---

## 二、技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Next.js | 16.2.7 | App Router，客户端为主 |
| 语言 | TypeScript | ^5 | 全项目严格类型 |
| UI | Tailwind CSS | ^4 | CSS 变量驱动莫兰迪主题 |
| 状态管理 | React Context + useReducer | — | 集中式 AppState |
| 数据持久化 | localStorage（主）+ Supabase（已配置） | — | 双层持久化 |
| AI | Kimi (Moonshot) API | moonshot-v1-8k | 需用户自配 API Key |
| 云数据库 | Supabase (PostgreSQL) | ^2.108.1 | 已接入，环境变量已配置 |
| 打印/导出 | react-to-print | ^3.3.0 | 简历 PDF 导出 |
| 部署 | Vercel | — | 已部署，自动 CI/CD（连接 GitHub main 分支） |
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
│   │   └── settings/page.tsx         # 设置（API Key、目标、数据管理、云同步）
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx         # 整体布局（侧边栏+主区域）
│   │   │   ├── Header.tsx            # 页面顶部标题栏
│   │   │   └── Navigation.tsx        # 侧边导航（含移动端底部Tab）
│   │   ├── UI/
│   │   │   ├── Button.tsx            # 通用按钮（primary/secondary/ghost）
│   │   │   ├── StatCard.tsx          # 统计卡片
│   │   │   ├── Toast.tsx             # 消息提示（ToastProvider 已全局挂载）
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
│   │   ├── Providers.tsx             # 顶层 Provider 集合（含 ToastProvider）
│   │   └── PWAProvider.tsx           # PWA 安装提示
│   ├── context/
│   │   ├── DataContext.tsx           # 核心数据层（AppState + 所有 hooks）
│   │   └── PipelineContext.tsx       # 投递流程节点配置（自定义 pipeline）
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.tsx  # 全局键盘快捷键（Ctrl+K 搜索等）
│   │   └── useSupabaseSync.ts        # Supabase 同步 hook（设置页使用）
│   └── lib/
│       ├── kimi.ts                   # Kimi AI 服务封装（单例+流式输出）
│       ├── supabase.ts               # Supabase 客户端初始化（读取环境变量）
│       ├── supabase-service.ts       # Supabase CRUD 操作封装（含字段映射）
│       └── sampleData.ts             # 演示数据（首次初始化时注入）
├── supabase/
│   └── migration.sql                 # 旧版建表 SQL（参考用）
├── supabase_schema.sql               # 【主要建表脚本】完整 12 张表 + RLS 策略
├── public/
│   ├── manifest.json                 # PWA manifest
│   ├── sw.js                         # Service Worker
│   └── icons/                        # PWA 图标（192/512）
├── .env.local                        # 本地环境变量（已配置，gitignore 中）
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
| `UserProfile` | 用户配置 | name, title, targetPositions[], targetLocations[], goals{applications/interviews/replies}, settings{noResponseDays/monthlyBudget/theme/defaultView} |
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
  isHydrated: boolean;  // 重要：水合完成前为 false，所有读取操作应等待此标志
}
```

---

## 五、Supabase 云同步（已完整接入）

### 5.1 数据库表结构

建表脚本：`supabase_schema.sql`（项目根目录），共 12 张表：

| 表名 | 对应前端集合 |
|------|------------|
| `applications` | applications |
| `interviews` | interviews |
| `contacts` | contacts |
| `company_profiles` | companyProfiles |
| `exams` | exams |
| `questions` | questions |
| `calendar_events` | events |
| `offers` | offers |
| `resumes` | resumes |
| `chat_messages` | chatHistory |
| `activities` | activities |
| `user_profiles` | userProfile（以 device_id 为主键） |

所有表均已启用 RLS，允许匿名角色完全访问（数据隔离由应用层通过 `user_id = device_id` 过滤实现）。

### 5.2 字段名映射（camelCase ↔ snake_case）

`src/lib/supabase-service.ts` 的 `FIELD_MAP` 定义了所有字段转换规则。**重要**：`user_profiles` 表有专属映射：

```typescript
user_profiles: {
  targetPositions: 'target_positions',   // 数据库列为 snake_case
  targetLocations: 'target_locations',
  targetCompanies: 'target_companies',
}
```

`syncUserProfile` 写入前调用 `toSnakeCase()`，`fetchUserProfile` 读取后调用 `toCamelCase()`。**不得跳过此转换**，否则 Supabase upsert 会因列名不存在而静默失败。

### 5.3 数据同步机制

```
用户操作 → dispatch(action) → state 更新
    ├─ 立刻 → saveToStorage(state) → localStorage
    ├─ 立刻 → syncUserProfile(state.userProfile) → Supabase（userProfile 专属，无延迟）
    └─ 3秒后 → syncAllCollections(state) → Supabase（其他所有集合，防抖）
```

**为什么 userProfile 单独立即同步**：其他集合用 3 秒防抖，若用户保存设置后快速刷新，Supabase 里还是旧 userProfile，刷新后会加载旧数据覆盖 localStorage 中的新数据。独立的即时同步消除了这个竞态条件。

### 5.4 hydration 优先级

```
启动时：
  1. Supabase 已配置 → loadAllCollections() → 有数据 → 使用云端数据
      └─ 若 userProfile 为空 → 回退使用 localStorage 中的 userProfile（防止被默认值覆盖）
  2. Supabase 未配置 / 云端无数据 → loadFromStorage() → localStorage
  3. localStorage 也没有 → 注入 sampleData（仅首次，INIT_KEY 控制）
```

### 5.5 设备 ID 机制

`getDeviceId()`（`supabase-service.ts`）：首次使用时在 localStorage 生成 `device-<timestamp>-<random>` 作为 `user_id`，所有 Supabase 查询均以此隔离数据。无需用户登录。

### 5.6 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=https://qkbluqepsisaqkmvrlem.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（完整 JWT）
```

- `.env.local` 已配置（本地开发用，已加入 `.gitignore`）
- Vercel 环境变量需在 Vercel Dashboard → Project Settings → Environment Variables 中单独配置，配置后需触发一次 Redeploy

---

## 六、已实现功能清单

### 6.1 投递管理（`/applications`）
- 三视图切换：看板视图（按状态 or 按流程阶段分组）、表格视图、卡片视图
- 添加/删除/查看投递（点卡片进详情页）
- 备选库：stage=`未投递` 的卡片归入备选，可一键转为已投递
- 一键跳转：记录了 URL 的投递可直接跳转原链接
- 搜索筛选（公司/岗位名）+ 状态筛选

### 6.2 面试管理（`/interview`）
- 面试日程列表（即将/已完成/已取消）
- 面试题库（按分类/难度筛选，题目收藏）
- AI 模拟面试（`AIMockInterview` 组件）：全屏对话界面、倒计时、自动总结报告（需 Kimi API Key）

### 6.3 笔试准备（`/exam`）
- 笔试记录 + 题库练习（选择/填空/编程/简答）
- 按类别和难度筛选，题目收藏

### 6.4 联系人管理（`/contacts`）
- 添加/编辑/删除联系人，按关系分类筛选

### 6.5 Offer 管理（`/offer`）
- 添加 Offer（薪资/福利/优缺点），推荐操作（accept/negotiate/reject）

### 6.6 AI 助手（`/ai`）
- 使用 Kimi API，流式输出，对话历史持久化
- 系统 prompt 预设：温暖的求职陪伴风格，先共情再给行动建议

### 6.7 简历管理（`/resume`）
- 多简历版本、Markdown 编辑、PDF 导出（react-to-print）、设为默认、复制副本

### 6.8 日历（`/calendar`）
- 月视图，支持面试/笔试/截止日期/里程碑/自定义事件

### 6.9 数据看板（`/dashboard`）
- 统计卡片、Pipeline 进度、面试数据、趋势图、公司排行、目标进度、动态 Feed、周报

### 6.10 设置（`/settings`）
- 个人信息、求职目标、AI API Key、提醒设置、数据导入导出、云端同步状态
- 保存按钮点击后有 Toast 成功反馈
- 云同步状态显示"已配置完成" / "待配置"

### 6.11 全局功能
- 全局搜索（`Ctrl+K`）、键盘快捷键、浏览器通知、PWA、样本数据

---

## 七、已完成的工程工作（本次 AI 工作记录）

以下是本次开发会话中完成的所有工程工作，供后续 AI 参考：

### 7.1 Supabase 集成（从零到可用）
- 扫描所有 TypeScript 数据模型，生成完整建表脚本 `supabase_schema.sql`（12 张表 + RLS）
- 创建 `.env.local`，写入正确的 Supabase URL（不含 `/rest/v1/` 后缀）和 JWT 格式的 Anon Key
- 确认 `@supabase/supabase-js` 已安装（v2.108.1）、`src/lib/supabase.ts` 正确读取环境变量

### 7.2 GitHub + Vercel 部署
- 初始化 git 仓库，排除 `.env.local`、`nul`（误操作产生的文件）、`日常任务.txt`、`.claude/` 等不应提交的文件
- 强制推送到 `github.com/gaonerida-bit/campus-helper`（main 分支）
- 通过 Vercel CLI 部署到生产环境：https://campus-helper-main.vercel.app

### 7.3 Bug 修复：设置页保存无效

**Bug 描述**：修改设置后刷新页面，所有修改丢失。

**根本原因 1 — hydration 时序问题**（`settings/page.tsx`）：
- 组件挂载时 `state.isHydrated = false`，`userProfile` 还是默认值
- 本地 `useState` 初始化从默认值取，hydration 完成后 context 更新但本地 state 不跟着更新
- 用户看到的输入框显示默认值，点"保存"反而把默认值写回

**修复**：在 `settings/page.tsx` 添加 `useEffect`，监听 `state.isHydrated`，水合完成后重新同步所有输入框的值。

**根本原因 2 — 没有保存反馈**：
- 三个保存按钮（保存修改/保存目标/保存设置）点击后无任何提示
- 在 `Providers.tsx` 中挂载 `ToastProvider`，在三个 handler 中加入 `addToast('success', '...')`

### 7.4 Bug 修复：刷新后 userProfile 丢失

**Bug 描述**：每次刷新后，姓名/求职目标/偏好设置恢复为默认值。

**根本原因链**：

1. **`syncUserProfile` camelCase/snake_case 不匹配**（`supabase-service.ts`）：
   - `syncUserProfile` 直接展开 `profile`（camelCase 键：`targetPositions` 等）
   - 数据库列为 snake_case（`target_positions` 等）
   - Supabase 报"列不存在"错误，upsert 静默失败，`user_profiles` 表始终为空

2. **`fetchUserProfile` 未做格式转换**（`supabase-service.ts`）：
   - 返回原始 snake_case 数据，前端读 `userProfile.targetPositions` 得到 `undefined`

3. **hydration 覆盖 localStorage**（`DataContext.tsx`）：
   - Supabase 有其他数据（applications 等）但无 userProfile → `hasData = true`
   - `saveToStorage({ ...initialState, ...cloudData })` 将 `initialState.userProfile`（默认值）写入 localStorage
   - localStorage 的真实 userProfile 被覆盖

4. **3 秒竞态条件**（`DataContext.tsx`）：
   - 用户保存后 localStorage 立刻更新，但 Supabase 同步有 3 秒防抖
   - 3 秒内刷新 → Supabase 读回旧数据 → 覆盖 localStorage 新数据

**修复**：
- `FIELD_MAP` 中添加 `user_profiles` 条目，定义三个 camelCase→snake_case 映射
- `syncUserProfile` 调用 `toSnakeCase(profile, 'user_profiles')` 后再 upsert
- `fetchUserProfile` 调用 `toCamelCase(profileData, 'user_profiles')` 后再返回
- `DataContext.tsx` hydration：若 Supabase 无 userProfile，从 localStorage 读取已保存的 userProfile 作为兜底
- `DataContext.tsx` 新增独立 `useEffect` 监听 `state.userProfile`，变更时**立刻**（无延迟）调用 `syncUserProfile`，消除竞态窗口

---

## 八、数据持久化策略（最新）

### 读取优先级（启动时）：
1. Supabase（已配置且有数据）→ 若无 userProfile 则从 localStorage 补充
2. localStorage（Supabase 未配置或无数据）
3. 样本数据（首次使用，`INIT_KEY` 控制，仅注入一次）

### 写入策略：
- 每次 state 变更 → **立刻**写入 localStorage
- `userProfile` 变更 → **立刻**同步 Supabase（无防抖）
- 其他 state 变更 → **3 秒防抖**后同步 Supabase

---

## 九、AI 集成

### Kimi 服务（`src/lib/kimi.ts`）
- 单例模式：`getKimiService()` 返回全局实例
- 支持普通调用（`chat()`）和流式输出（`chatStream()`）
- API Key 存储在 localStorage key `kimi-api-key`
- 月度预算追踪（默认 100 元上限，基于 token 估算费用）

### 系统 Prompt 人格设定：
- 温暖、专业、有同理心的求职伙伴
- 被拒时：先共情 → 再鼓励 → 最后给行动建议
- 永远给具体的下一步行动，不说"别焦虑"

---

## 十、设计规范（莫兰迪色系）

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

**组件规范**：圆角 8px（卡片）/ 6px（按钮）/ 4px（输入框），轻阴影，300ms ease 过渡。

---

## 十一、Pipeline 系统（`PipelineContext`）

投递记录的 `stage` 字段对应 Pipeline 节点名称（字符串），节点配置存于 `PipelineContext`。

预设节点（可在设置中自定义）：
- 未投递（备选库）→ 投递 → 简历筛选 → 在线测评 → 一面 → 二面 → 三面 → HR面 → Offer → 拒绝

---

## 十二、环境变量

| 变量 | 说明 | 是否必须 |
|------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qkbluqepsisaqkmvrlem.supabase.co/`（注意末尾有 `/`，无 `/rest/v1/`） | 可选（不填则纯本地） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | JWT 格式（`eyJ...` 开头），从 Supabase Dashboard → Project Settings → API 获取 | 可选 |
| `NEXT_PUBLIC_KIMI_API_KEY` | Kimi API Key（也可在设置页 UI 中填写，存入 localStorage） | 可选 |

---

## 十三、当前已知问题 / 待完善点

1. **投递详情页** (`/applications/[id]`)：UI 较简单，缺乏流程节点时间线可视化
2. **面试复盘**：PRD 设计了录音/转写/AI分析，目前仅有基础记录字段
3. **Offer 对比**：PRD 设计了雷达图多维度对比，目前仅有列表展示
4. **简历生成**：PRD 设计了「基于 JD + 素材库 AI 生成定制简历」，目前仅有多版本管理
5. **成就徽章系统**：PRD 设计了游戏化成就，尚未实现
6. **浏览器插件**：PRD 设计的一键抓取岗位信息插件尚未开发
7. **公司档案 AI 分析**：数据结构已定义，AI 自动分析未接入
8. **Vercel 环境变量**：Supabase 配置已在 `.env.local` 中，但 Vercel 线上需在 Dashboard 单独配置并 Redeploy 才能在生产环境使用云同步

---

## 十四、快速上手开发

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3001，3000 端口可能被占用）
npm run dev

# 类型检查
npx tsc --noEmit

# 部署到 Vercel
npx vercel --prod
```

首次打开会自动注入演示数据，可在设置页「清除全部数据」重置。

---

## 十五、核心文件索引

| 文件 | 作用 |
|------|------|
| `src/context/DataContext.tsx` | **最核心文件**：所有数据类型定义、全局状态、CRUD hooks、持久化逻辑 |
| `src/context/PipelineContext.tsx` | 投递流程节点配置 |
| `src/lib/supabase.ts` | Supabase 客户端初始化，读取环境变量 |
| `src/lib/supabase-service.ts` | Supabase CRUD + 字段映射（FIELD_MAP 含所有集合包括 user_profiles） |
| `src/hooks/useSupabaseSync.ts` | 设置页使用的同步 hook，暴露同步状态 |
| `src/lib/kimi.ts` | Kimi AI 服务，包含系统 prompt |
| `src/lib/sampleData.ts` | 演示数据（首次初始化） |
| `src/app/globals.css` | 莫兰迪色系 CSS 变量定义 |
| `src/components/Providers.tsx` | 顶层 Provider（AppProvider + PipelineProvider + ToastProvider） |
| `src/components/Layout/AppLayout.tsx` | 页面整体布局 |
| `src/components/UI/Toast.tsx` | Toast 通知系统 |
| `src/components/AI/AIMockInterview.tsx` | AI 模拟面试全屏组件 |
| `supabase_schema.sql` | **主建表脚本**，在 Supabase SQL Editor 中运行 |
| `docs/需求文档.md` | 完整 PRD，了解设计意图必读 |

---

*文档更新时间：2026-07-14，涵盖本次 AI 会话所有工程工作。*
