# 校招助手 (Campus Recruitment Assistant)

一款专为应届生设计的秋招管理应用，帮助你高效管理投递记录、面试安排、公司档案等。

## ✨ 功能特性

### 📋 投递管理
- 看板、表格、卡片三种视图
- 按状态筛选投递
- 投递进度追踪

### 📅 面试管理
- 面试日程管理
- 面试题库练习
- 面试复盘记录
- AI模拟面试

### 📝 笔试准备
- 笔试信息记录
- 分类题库练习
- 难度筛选

### 🤝 联系人管理
- HR、面试官、校友等联系人
- 公司档案管理

### 🏆 Offer对比
- 多Offer薪资对比
- AI智能分析

### 📊 数据看板
- 投递趋势统计
- 成就徽章系统
- 投递目标追踪

### 🤖 AI助手
- 简历优化建议
- JD分析
- 面试准备指导

### 📄 简历管理
- 多简历管理
- PDF导出
- 素材库管理

## 🛠️ 技术栈

- **框架**: Next.js 16 + App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Context + useReducer
- **数据持久化**: localStorage

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── applications/       # 投递管理
│   ├── interview/          # 面试管理
│   ├── exam/              # 笔试准备
│   ├── contacts/          # 联系人
│   ├── offer/             # Offer对比
│   ├── dashboard/          # 数据看板
│   ├── ai/                # AI助手
│   ├── resume/            # 简历管理
│   ├── calendar/          # 日历
│   ├── timeline/           # 时间线
│   ├── pool/              # 备选库
│   └── settings/          # 设置
├── components/             # React 组件
│   ├── Layout/            # 布局组件
│   ├── UI/               # UI 组件
│   └── ...               # 其他组件
├── context/                # React Context
│   └── DataContext.tsx    # 数据上下文
└── styles/                # 全局样式
```

## 🎨 设计规范

### 色彩系统 (Morandi 风格)
- Primary: `#8B9A7D` (橄榄绿)
- Accent: `#A8B5A0` (灰绿)
- Success: `#7A9E7E` (苔绿)
- Warning: `#D4A574` (暖棕)
- Info: `#9AAFB2` (雾蓝)

### 字体
- 主字体: Geist (Next.js 默认)
- 中文字体: system-ui

## 📱 响应式设计

应用支持多种屏幕尺寸：
- 桌面端 (1024px+)
- 平板端 (768px-1023px)
- 移动端 (<768px)

## 🔧 数据存储

所有数据存储在浏览器 localStorage 中：
- `campus_applications` - 投递记录
- `campus_interviews` - 面试记录
- `campus_contacts` - 联系人
- `campus_offers` - Offer记录
- `campus_company_profiles` - 公司档案
- `campus_exams` - 笔试记录
- `campus_questions` - 题库
- `campus_calendar_events` - 日历事件
- `campus_resumes` - 简历
- `campus_user_profile` - 用户资料
- `campus_chat_history` - AI聊天记录

## 📄 License

MIT
