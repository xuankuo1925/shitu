<template>
  <div class="announcement-list">
    <el-card 
      v-for="doc in docs" 
      :key="doc.path" 
      shadow="hover" 
      class="announcement-card"
      :body-style="{ padding: '20px', cursor: 'pointer' }"
      @click="$router.push(doc.path)"
    >
      <div class="card-content">
        <h2 class="title">{{ doc.title }}</h2>
        <p class="description">{{ doc.description }}</p>
        <el-divider />
        <div class="meta">
          <el-space>
            <el-tag size="small">
              <el-icon><Calendar /></el-icon>
              <span style="margin-left: 20px">{{ formatDate(doc.date) }}</span>
            </el-tag>
          </el-space>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
// import { useAsyncData, defineRouteRules } from ''



const { data: docs } = await useAsyncData('documents-list', () => {
    return queryCollection('gonggao')
        .select('title', 'path', 'description', 'date')
        .order('date', 'DESC')
        .all()
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

useSeoMeta({
  title: '公告列表 - 仕途 SHITU | 考公课程最新动态',
  description: '仕途 SHITU 公告列表，获取公务员与事业单位考试课程最新动态、更新通知和重要公告。',
  keywords: '考公公告,公务员考试通知,事业单位考试动态,课程更新,资料发布',
  ogTitle: '公告列表 - 仕途 SHITU',
  ogDescription: '获取公务员与事业单位考试课程最新动态和重要公告',
  ogType: 'website',
  ogImage: '/favicon.ico',
  twitterCard: 'summary',
  twitterTitle: '公告列表 - 仕途 SHITU',
  twitterDescription: '获取公务员与事业单位考试课程最新动态和重要公告',
  robots: 'index, follow'
})

useHead({
  link: [
    { rel: 'canonical', href: `${url.origin}${url.pathname}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '仕途 SHITU 公告列表',
        description: '公务员与事业单位考试课程最新动态和重要公告',
        itemListElement: docs.value?.map((doc, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            name: doc.title,
            description: doc.description,
            url: `${url.origin}${doc.path}`
          }
        })) || []
      })
    }
  ]
})
</script>

<style scoped>
.announcement-list {
  display: grid;
  gap: 1.5rem;
  padding: 1rem;
}

.announcement-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.announcement-card:hover {
  transform: translateY(-4px);
}

:deep(.el-card__body) {
  padding: 20px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.meta {
  margin-top: 1rem;
}

:deep(.el-divider) {
  margin: 1rem 0;
}
</style>