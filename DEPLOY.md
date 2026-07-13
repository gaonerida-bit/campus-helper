# 🎓 校招助手 - 部署指南

## 快速部署到 Vercel

### 方式一：Vercel Dashboard（最简单）

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择仓库 `gaonerida-bit/campus-helper`
5. Framework Preset 会自动选择 **Next.js**
6. 点击 **Deploy**

几分钟后获得在线链接！如：`https://campus-helper.vercel.app`

### 方式二：本地 CLI 部署

```bash
# 克隆仓库
git clone https://github.com/gaonerida-bit/campus-helper.git
cd campus-helper

# 安装依赖
npm install

# 登录 Vercel（浏览器会自动打开）
npx vercel login

# 部署预览
npx vercel

# 部署到生产
npx vercel --prod
```

### 方式三：GitHub Actions 自动部署

1. 登录 Vercel → Settings → Tokens → Create Token
2. 复制 Token 和 Organization ID
3. GitHub 仓库 Settings → Secrets 添加：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`  
   - `VERCEL_PROJECT_ID`
4. 推送代码自动部署

## 当前代码状态

- ✅ Next.js 16 项目结构
- ✅ 所有页面和组件
- ✅ localStorage 数据持久化
- ✅ GitHub 已提交
- ⏳ 需要 Vercel 部署才能在线访问

## 功能概览

| 页面 | 功能 |
|------|------|
| 📊 首页 | 统计卡片、目标进度、本周日程 |
| 📋 投递管理 | 看板/表格/卡片三视图、CRUD |
| 🎯 面试管理 | 日程、题库、复盘记录 |
| ✏️ 笔试准备 | 分类题库、难度筛选 |
| 🤝 联系人 | HR、面试官、校友管理 |
| 🏆 Offer对比 | 薪资对比 |
| 🤖 AI助手 | 智能对话 |
| 📄 简历管理 | 多版本、PDF导出 |
| 📅 日历 | 日程管理 |
| ⏱️ 时间线 | 投递动态 |
| 📥 备选库 | 备选公司 |
| ⚙️ 设置 | 用户偏好 |

## 后续可接入

- **Supabase** - 云端数据库（需要创建 Supabase 项目）
- **Kimi AI API** - 真实 AI 对话
- **PWA** - 手机桌面图标安装
