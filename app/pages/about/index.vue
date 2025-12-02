<client-only /> 
<template>
  <div class="about-page">
    <!-- Header -->
    <el-card shadow="never" class="header-card">
      <h1>关于仕途</h1>
      <p class="subtitle">简约 · 专注 · 高效</p>
    </el-card>

    <!-- Main Content -->
    <el-card shadow="never" class="content-card">
      <div class="intro-section">
        <h2>平台理念</h2>
        <el-divider />
        <p>仕途致力于为考公学子提供纯净、高效的学习环境。</p>
        <p>我们专注于公务员和事业单位考试课程，去除繁杂功能，回归学习本质。</p>
      </div>

      <el-divider />

      <div class="features">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <el-card shadow="hover" class="feature-card">
              <h3>专业课程</h3>
              <p>覆盖行测、申论、面试全科目</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-card shadow="hover" class="feature-card">
              <h3>纯净体验</h3>
              <p>无广告干扰，专注学习内容</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-card shadow="hover" class="feature-card">
              <h3>高效学习</h3>
              <p>优化学习路径，提升备考效率</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <div class="contact-section">
        <h2>联系我们</h2>
        <p>如有问题或建议，欢迎通过邮件联系</p>
        <p class="email">support@shitu.cc</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '关于仕途 - 简约专业的考公学习平台',
  description: '仕途是一个专注于公务员和事业单位考试的学习平台，提供专业的课程资源和纯净的学习体验。',
  keywords: '考公,公务员考试,事业单位考试,学习平台,仕途'
})
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.header-card {
  text-align: center;
  margin-bottom: 2rem;
  border: none;
}

.header-card h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.content-card {
  border: none;
}

.intro-section {
  margin-bottom: 2rem;
  text-align: center;
}

.intro-section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.intro-section p {
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.features {
  margin: 2rem 0;
}

.feature-card {
  height: 100%;
  text-align: center;
  border: none;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #6b7280;
}

.contact-section {
  text-align: center;
  padding: 1rem 0;
}

.contact-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.contact-section p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.email {
  color: #3b82f6;
  font-weight: 500;
  font-size: 1.1rem;
}

:deep(.el-divider) {
  margin: 1.5rem 0;
}

@media (max-width: 768px) {
  .about-page {
    padding: 1rem;
  }
  
  .header-card h1 {
    font-size: 2rem;
  }
  
  .features {
    margin: 1rem 0;
  }
}
</style>