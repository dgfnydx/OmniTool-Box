# OmniTool Box (Vue 3 Edition)

> **"A Digital Swiss Army Knife for Creators & Developers."**

OmniTool Box 是一款基于 **Vue 3 + TypeScript** 打造的一站式、高性能、极致简洁且高度可扩展的万用工具箱应用。

---

## 🌟 命名含义与初衷 (Why OmniTool?)

**Omni-** 源自拉丁语 *omnis*，意为“全”、“总”、“万”。

### 1. 核心定义
**OmniTool** 代表了“全方位工具”或“万用工具”。在设计初衷上，我们致力于打造一个**数字世界的瑞士军刀**，将开发者、设计师及日常办公中零散的工具需求聚合在一个统一、优雅且极速响应的界面之下。

### 2. 设计哲学 (Deep Meaning)
- **全场景覆盖 (All-in-One Experience)**：
  现在的数字工作流往往要在数十个零散的工具网站间频繁跳转。OmniTool 的核心初衷是将这些**碎片化的需求整合进一个高度集成的环境**，打破工具孤岛，实现“一站式”解决问题。
    
- **极致的通用性 (Universal Accessibility)**：
  我们通过 **Developer（开发者）**、**Daily（日常）** 和 **Design（设计）** 三大板块的划分，消弭了专业工具与日常工具的边界。它既是程序员的代码辅助器，也是文字工作者和设计师的得力助手。

- **无限的扩展性 (Infinite Scalability)**：
  正如其名“Omni”，我们在底层架构中采用了**解耦的注册中心 (Registry) 模式**。这意味着 OmniTool 不仅仅是目前的几个功能，它具备吞纳数百个工具组件的潜力，能随着用户需求的变化而无限成长。

- **极简与效率 (Extreme Efficiency)**：
  “Omni”也代表了一种对生产力的绝对掌控感。通过居中的 **Omnibar (全能搜索框)**，用户无需在层级菜单中迷失，只需轻敲键盘，即可在所有功能间实现毫秒级的瞬间触达。

---

## 🚀 核心功能 (Current Features)

目前已上线 4 款功能完备的工具：
1.  **JSON Formatter (JSON 格式化)**：美化、校验、一键清理。
2.  **Base64 Converter (Base64 转换器)**：支持文本与 Base64 的双向编码解码。
3.  **Timestamp Converter (时间戳转换)**：支持 Unix 时间戳与本地时间的实时互转。
4.  **Password Generator (随机密码生成)**：具备强度检测的安全随机密码生成工具。

---

## 🛠 技术特性 (Tech Stack)

- **框架**: [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)
- **构建**: [Vite](https://vitejs.dev/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **国际化**: [Vue I18n 11](https://vue-i18n.intlify.dev/) (支持中英双语切换)
- **样式**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (CSS Variables + Scoped CSS)
- **图标**: [Lucide Vue Next](https://lucide.dev/)
- **特性**: 
  - 🌙 **Dark Mode (深色模式)**：全局适配与偏好持久化。
  - 🔍 **Omnibar (全能搜索)**：支持侧边栏联动过滤与结果下拉预览。
  - 🔔 **Toast Notification**：优雅的全局通知反馈系统。
  - 📱 **Responsive Design**：完美适配桌面端与移动端。

---

## 📂 项目结构 (Structure)

```text
src/
├── components/     # 通用组件 (Toast, Modal 等)
├── i18n/           # 国际化语言包 (en, zh)
├── layouts/        # App Shell 布局 (Sidebar, Header)
├── registry/       # 工具注册中心 (核心扩展逻辑)
├── router/         # 动态路由配置
├── store/          # Pinia 状态管理 (Theme, Toast)
├── tools/          # 独立的工具组件模块
└── views/          # 视图页面 (Home, Tool Details)
```

---

## ⚡️ 快速开始 (Getting Started)

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build
```

---

## 📝 开源协议 (License)

本项目采用 [MIT License](LICENSE) 协议。
