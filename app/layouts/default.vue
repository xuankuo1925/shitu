<template>
  <div class="layout-wrapper">
    <!-- Mobile Header -->
    <div class="mobile-header hidden-sm-and-up">
      <el-button link @click="drawer = true">
        <el-icon :size="24" color="#303133"><Menu /></el-icon>
      </el-button>
      <span class="brand-text">仕途 SHITU</span>
      <div style="width: 32px"></div> <!-- Spacer to balance header -->
    </div>

    <el-container class="main-container">
      <!-- Desktop Sidebar -->
      <el-aside width="260px" class="desktop-sidebar hidden-xs-only">
        <div class="sidebar-header">
          <div class="logo-circle">S</div>
          <span class="brand-text">仕途 SHITU</span>
        </div>
        <div class="sidebar-content">
          <AppMenu />
        </div>
        <div class="sidebar-footer">
          <span class="copyright">© 2025 Shitu.cc</span>
        </div>
      </el-aside>

      <!-- Mobile Drawer -->
      <el-drawer
        v-model="drawer"
        direction="ltr"
        size="280px"
        :with-header="false"
        class="mobile-menu-drawer"
      >
        <div class="sidebar-header">
          <div class="logo-circle">S</div>
          <span class="brand-text">仕途 SHITU</span>
        </div>
        <div class="sidebar-content">
          <AppMenu @select="drawer = false" />
        </div>
      </el-drawer>

      <!-- Main Content -->
      <el-main class="content-area">
        <slot />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu } from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css'

const drawer = ref(false)

</script>

<style>
/* Global basic resets */
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f7fa;
  color: #303133;
}
</style>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  /* Ensure container takes full height minus mobile header on mobile */
}

/* Mobile Header */
.mobile-header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Desktop Sidebar */
.desktop-sidebar {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid #f0f2f5;
  flex-shrink: 0;
}

.logo-circle {
  width: 36px;
  height: 36px;
  background: var(--el-color-primary);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.sidebar-content {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  border-top: 1px solid #f0f2f5;
  flex-shrink: 0;
}

/* Content Area */
.content-area {
  background-color: #f5f7fa;
  padding: 32px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
    min-height: calc(100vh - 60px);
  }
}
</style>
