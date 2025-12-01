<template>
  <el-menu :default-active="route.path" class="app-menu" :router="true" @select="handleSelect">
    <el-menu-item index="/">
      <el-icon>
        <House />
      </el-icon>
      <span>首页</span>
    </el-menu-item>

    <el-sub-menu index="/kecheng">
      <template #title>
        <el-icon>
          <Monitor />
        </el-icon>
        <span>课程学习</span>
      </template>
      <el-menu-item index="/kecheng/gwy">公务员课程</el-menu-item>
      <el-menu-item index="/kecheng/yjs">研究生课程</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/ziliao">
      <template #title>
        <el-icon>
          <Files />
        </el-icon>
        <span>资料下载</span>
      </template>
      <el-menu-item index="/ziliao/gwy">公务员资料</el-menu-item>
      <el-menu-item index="/ziliao/yjs">研究生资料</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/about">
      <el-icon>
        <InfoFilled />
      </el-icon>
      <span>关于我们</span>
    </el-menu-item>
    <el-menu-item index="/gonggao">
      <el-icon>
        <AlarmClock />
      </el-icon>
      <span>公告资讯</span>
    </el-menu-item>


  </el-menu>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { House, Monitor, Files, InfoFilled, AlarmClock } from '@element-plus/icons-vue'

const route = useRoute()
const emit = defineEmits(['select'])

const handleSelect = () => {
  emit('select')
}
</script>

<style scoped>
.app-menu {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  border-radius: 8px;
  margin: 4px 12px;
  height: 48px;
  line-height: 48px;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 600;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: var(--el-fill-color-light);
}
</style>
