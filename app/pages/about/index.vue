<template>
  <div class="about-page">
    <section class="hero">
      <h1>关于仕途 SHITU</h1>
      <p class="subtitle">考公课程播放与资料下载平台，简约优雅，高效学习</p>
    </section>

    <el-row :gutter="20" class="features">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="card">
          <h2>平台定位</h2>
          <p>专注公务员与事业单位考试的课程播放与资料下载，覆盖行测、申论、面试等核心模块。</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="card">
          <h2>核心优势</h2>
          <ul class="list">
            <li>高清课程播放与章节进度同步</li>
            <li>结构化资料下载与更新提醒</li>
            <li>简洁优雅的学习界面与深色模式</li>
            <li>移动端与桌面端的统一体验</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="features">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="card">
          <h2>适合人群</h2>
          <p>备考公务员、事业单位、各类公职考试的考生，追求高效与专注的学习方式。</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="card">
          <h2>联系我们</h2>
          <p>如需合作或反馈，请通过站内留言与我们联系。</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const url = useRequestURL()

useSeoMeta({
  title: '关于我们 - 仕途 SHITU | 考公课程与资料下载',
  description: '仕途 SHITU 提供公务员与事业单位考试课程播放与资料下载，覆盖行测、申论、面试等，体验简约优雅。',
  keywords: '考公,公务员课程,事业单位课程,行测,申论,资料下载,面试,课程播放',
  ogTitle: '关于我们 - 仕途 SHITU',
  ogDescription: '专业的考公学习平台，课程播放与资料下载一体化。',
  ogType: 'website',
  ogImage: '/favicon.ico',
  twitterCard: 'summary',
  twitterTitle: '关于我们 - 仕途 SHITU',
  twitterDescription: '专业的考公学习平台，课程播放与资料下载一体化',
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
        '@type': 'EducationalOrganization',
        name: '仕途 SHITU',
        url: url.origin,
        description: '考公课程播放与资料下载平台'
      })
    }
  ]
})
</script>

<style scoped>
.about-page {
  max-width: 1024px;
  margin: 0 auto;
}
.hero {
  margin-bottom: 24px;
}
.hero h1 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.subtitle {
  color: #606266;
  margin-top: 8px;
}
.features {
  margin-bottom: 24px;
}
.card {
  border-radius: 12px;
}
.list {
  padding-left: 18px;
}
.list li {
  line-height: 1.8;
}
</style>
