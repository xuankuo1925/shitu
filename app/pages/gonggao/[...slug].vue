<template>
  <div class="announcement-detail">
    <el-card class="container" shadow="hover" v-if="page">
      <el-page-header :content="page.title" @back="$router.back()" />
      <el-divider />
      
      <div class="meta-info">
        <el-space>
          <el-tag size="small">
            <el-icon><Calendar /></el-icon>
            <span style="margin-left: 4px">{{ formatDate(page.date) }}</span>
          </el-tag>
        </el-space>
      </div>
      
      <el-divider />
      
      <div class="content">
        <ContentRenderer :value="page" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Calendar } from '@element-plus/icons-vue'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('gonggao').path(route.path).first()
})

const url = useRequestURL()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}


// SEO优化
useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} - 仕途 SHITU 公告` : '公告详情 - 仕途 SHITU',
  description: () => page.value?.description || '仕途 SHITU 公告详情页面',
  ogTitle: () => page.value?.title || '公告详情',
  ogDescription: () => page.value?.description || '仕途 SHITU 公告详情',
  ogType: 'article',
  ogImage: '/favicon.ico',
  twitterCard: 'summary',
  robots: 'index, follow'
})

useHead({
  link: [
    { rel: 'canonical', href: `${url.origin}${url.pathname}` }
  ]
})
</script>

<style scoped>
.announcement-detail {
  padding: 2rem 1rem;
  min-height: 100vh;
  background-color: #f8f9fa;
}

:deep(.el-card) {
  /* max-width: 800px; */
  margin: 0 auto;
  border-radius: 12px;
}

:deep(.el-card__body) {
  padding: 2rem;
}

.meta-info {
  margin: 1rem 0;
}

.content {
  line-height: 1.7;
  font-size: 1rem;
  color: #374151;
  padding: 1rem 0;
}

.content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: #1f2937;
}

.content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: #374151;
}

.content :deep(p) {
  margin-bottom: 1rem;
}

.content :deep(ul),
.content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.content :deep(li) {
  margin-bottom: 0.5rem;
}

.content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .announcement-detail {
    padding: 1rem;
  }
  
  :deep(.el-card__body) {
    padding: 1.5rem;
  }
}
</style>
