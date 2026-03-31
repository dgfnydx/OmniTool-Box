<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../store/app';
import { 
  Home, 
  Search, 
  PanelLeftClose,
  PanelLeftOpen,
  CodeXml,
  LayoutGrid,
  Palette,
  Languages,
  Command,
  Sun,
  Moon
} from 'lucide-vue-next';
import { tools } from '../registry/toolRegistry';

const { t, locale } = useI18n();
const appStore = useAppStore();
const isSidebarOpen = ref(true);
const searchQuery = ref('');
const isSearchFocused = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 快捷键监听
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en';
};

// 搜索过滤逻辑
const filteredTools = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return tools;
  
  return tools.filter(tool => {
    const name = t(`tools.${tool.id}.name`).toLowerCase();
    const desc = t(`tools.${tool.id}.description`).toLowerCase();
    return name.includes(query) || desc.includes(query) || tool.id.includes(query);
  });
});

const categories = [
  { id: 'developer', name: 'developer', icon: CodeXml },
  { id: 'daily', name: 'daily', icon: LayoutGrid },
  { id: 'design', name: 'design', icon: Palette }
];

const handleToolClick = () => {
  searchQuery.value = '';
  isSearchFocused.value = false;
};
</script>

<template>
  <div class="app-shell" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
    <!-- Sidebar -->
    <aside class="app-sidebar">
      <div class="sidebar-header">
        <RouterLink to="/" class="app-logo" @click="handleToolClick">
          <div class="logo-icon"><Command :size="20" /></div>
          <span class="logo-text">OmniTool</span>
        </RouterLink>
        <button class="icon-btn collapse-btn" @click="toggleSidebar">
          <PanelLeftClose :size="18" />
        </button>
      </div>

      <nav class="sidebar-content">
        <RouterLink to="/" class="nav-link main-link" @click="handleToolClick">
          <Home :size="18" />
          <span>{{ t('common.home') }}</span>
        </RouterLink>

        <div v-for="cat in categories" :key="cat.id" class="nav-section">
          <template v-if="filteredTools.some(t => t.category === cat.id)">
            <div class="section-title">{{ t(`common.categories.${cat.name}`) }}</div>
            <RouterLink 
              v-for="tool in filteredTools.filter(t => t.category === cat.id)" 
              :key="tool.id"
              :to="{ name: 'tool', params: { id: tool.id } }"
              class="nav-link sub-link"
              @click="handleToolClick"
            >
              <component :is="tool.icon" :size="16" class="tool-icon" />
              <span class="tool-name">{{ t(`tools.${tool.id}.name`) }}</span>
            </RouterLink>
          </template>
        </div>
      </nav>
    </aside>

    <!-- Main Wrapper -->
    <div class="app-main">
      <header class="app-header">
        <div class="header-left">
          <button v-if="!isSidebarOpen" class="icon-btn expand-btn" @click="toggleSidebar">
            <PanelLeftOpen :size="18" />
          </button>
        </div>

        <div class="header-center">
          <div class="omnibar-container">
            <div class="omnibar" :class="{ 'is-active': isSearchFocused }">
              <Search :size="16" class="search-icon" />
              <input 
                ref="searchInput"
                type="text" 
                :placeholder="t('common.search')" 
                v-model="searchQuery" 
                @focus="isSearchFocused = true"
                @blur="setTimeout(() => isSearchFocused = false, 200)"
              />
              <div class="k-hint">⌘ K</div>
            </div>
            
            <!-- Quick Search Results -->
            <div v-if="isSearchFocused && searchQuery" class="search-results shadow-lg">
              <div v-if="filteredTools.length === 0" class="no-results">
                No tools found for "{{ searchQuery }}"
              </div>
              <RouterLink
                v-for="tool in filteredTools"
                :key="tool.id"
                :to="{ name: 'tool', params: { id: tool.id } }"
                class="result-item"
                @click="handleToolClick"
              >
                <component :is="tool.icon" :size="18" />
                <div class="result-info">
                  <div class="result-name">{{ t(`tools.${tool.id}.name`) }}</div>
                  <div class="result-desc">{{ t(`tools.${tool.id}.description`) }}</div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="header-right">
          <button class="icon-btn theme-btn" @click="appStore.toggleTheme">
            <Sun v-if="appStore.isDark" :size="18" />
            <Moon v-else :size="18" />
          </button>
          <button class="action-btn lang-btn" @click="toggleLanguage">
            <Languages :size="18" />
            <span>{{ locale === 'en' ? 'EN' : '中文' }}</span>
          </button>
        </div>
      </header>

      <main class="app-content-scroll">
        <div class="content-view">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* App Shell */
.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

/* Sidebar */
.app-sidebar {
  width: 280px;
  height: 100%;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.sidebar-collapsed .app-sidebar {
  width: 0;
  border-right: none;
  overflow: hidden;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  flex-shrink: 0;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--accent-color);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-link.router-link-active {
  background: rgba(59, 130, 246, 0.08);
  color: var(--accent-color);
}

.nav-section {
  margin-top: 1.5rem;
}

.section-title {
  padding: 0 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.sub-link {
  font-size: 0.875rem;
}

.tool-icon {
  opacity: 0.7;
}

/* Main Area */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg-card);
}

.app-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  flex-shrink: 0;
  background: var(--bg-card);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
}

.header-left, .header-right {
  width: 150px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.omnibar-container {
  width: 100%;
  max-width: 480px;
  position: relative;
}

/* Omnibar (Centered Search) */
.omnibar {
  width: 100%;
  height: 40px;
  background: var(--bg-secondary);
  border: 1px solid transparent;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  gap: 0.5rem;
  transition: all 0.2s;
}

.omnibar.is-active {
  background: var(--bg-card);
  border-color: var(--accent-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.omnibar:hover:not(.is-active) {
  background: var(--bg-secondary);
  opacity: 0.8;
}

/* Search Results Dropdown */
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.15s;
}

.result-item:hover {
  background: var(--bg-secondary);
}

.result-item svg {
  color: var(--accent-color);
  flex-shrink: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.result-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.no-results {
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.search-icon {
  color: var(--text-muted);
}

.omnibar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.k-hint {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

/* Buttons */
.icon-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.action-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* Content Area */
.app-content-scroll {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-primary);
}

.content-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    z-index: 100;
    box-shadow: 20px 0 50px rgba(0,0,0,0.1);
  }
  
  .sidebar-collapsed .app-sidebar {
    transform: translateX(-100%);
  }
  
  .header-center {
    display: none;
  }
}
</style>
