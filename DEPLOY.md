# 🎓 校招助手 - 部署指南

## 快速部署到 Vercel

### 方式一：Vercel CLI（推荐）

1. 在本地打开终端
2. 下载压缩包并解压
3. 进入项目目录：
   ```bash
   cd campus-helper
   ```
4. 安装依赖：
   ```bash
   npm install
   ```
5. 部署：
   ```bash
   npm install -g vercel
   vercel
   ```
6. 按提示操作，几分钟后获得在线链接！

### 方式二：GitHub 导入

1. 把代码上传到 GitHub 新仓库
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. 点击 Deploy！

### 方式三：直接上传

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New" → "Project"
3. 选择 "Import Third-Party Git Repository"
4. 粘贴 GitHub 仓库地址

## 功能概览

| 页面 | 功能 |
|------|------|
| 📊 数据看板 | 统计图表、成就徽章、目标进度 |
| 📋 投递管理 | 看板/表格/卡片多视图 |
| 📅 校招日历 | 月历视图、待办事项 |
| 📄 简历库 | 多版本简历、素材库 |
| 🎯 面试准备 | 题库、AI模拟面试 |
| 🤝 联系人 | 内推人管理 |
| 🏆 Offer对比 | 薪资对比、城市成本计算 |
| 🤖 AI助手 | 智能对话、公司库 |
| ⏱️ 时间线 | 投递动态 |

## 技术栈

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS
- Morandi 配色（#8B9A7D 绿调）

## 后续接入

部署后可以接入：
- Supabase 数据库（数据持久化）
- Kimi AI API（AI 对话功能）
