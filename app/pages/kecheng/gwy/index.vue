<template>
  <div class="course-container">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">公务员课程</h1>
      <p class="page-subtitle">专业的公务员考试培训，助您成功上岸</p>
    </div>

    <!-- Course Filter -->
    <div class="filter-section">
      <el-row :gutter="20" align="middle">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课程名称..."
            clearable
            @input="filterCourses"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-select v-model="selectedCategory" placeholder="选择分类" clearable @change="filterCourses">
            <el-option label="行测" value="行测" />
            <el-option label="申论" value="申论" />
            <el-option label="面试" value="面试" />
            <el-option label="公共基础" value="公共基础" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-select v-model="selectedStatus" placeholder="学习状态" clearable @change="filterCourses">
            <el-option label="未开始" value="not_started" />
            <el-option label="学习中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- Course Grid -->
    <div class="course-grid">
      <el-row :gutter="20">
        <el-col 
          v-for="course in filteredCourses" 
          :key="course.id"
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
          class="course-col"
        >
          <div class="course-card" @click="goToCourseDetail(course.id)">
            <!-- Course Image -->
            <div class="course-image-wrapper">
              <img 
                :src="course.image || courseImg" 
                :alt="course.title"
                class="course-image"
                @error="handleImageError"
              />
              <div class="course-category">{{ course.category }}</div>
              <div class="course-duration">{{ course.duration }}</div>
            </div>

            <!-- Course Content -->
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
              
              <!-- Progress Bar -->
              <div class="course-progress">
                <div class="progress-info">
                  <span class="progress-text">学习进度</span>
                  <span class="progress-percentage">{{ course.progress }}%</span>
                </div>
                <el-progress 
                  :percentage="course.progress" 
                  :color="getProgressColor(course.progress)"
                  :show-text="false"
                />
              </div>

              <!-- Course Stats -->
              <div class="course-stats">
                <div class="stat-item">
                  <el-icon><VideoPlay /></el-icon>
                  <span>{{ course.lessons }}课时</span>
                </div>
                <div class="stat-item">
                  <el-icon><User /></el-icon>
                  <span>{{ course.students }}人学习</span>
                </div>
                <div class="stat-item">
                  <el-icon><Star /></el-icon>
                  <span>{{ course.rating }}</span>
                </div>
              </div>

              <!-- Course Status -->
              <div class="course-status">
                <el-tag 
                  :type="getStatusType(course.status)" 
                  size="small"
                  effect="light"
                >
                  {{ getStatusText(course.status) }}
                </el-tag>
                <span class="course-level">{{ course.level }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCourses.length === 0" class="empty-state">
      <el-empty description="暂无相关课程">
        <el-button type="primary" @click="resetFilters">重置筛选</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, VideoPlay, User, Star } from '@element-plus/icons-vue'
import courseImg from '~/assets/images/course.jpg'

const router = useRouter()

// Reactive data
const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

// Mock course data
const courses = ref([
  {
    id: 1,
    title: '行政职业能力测验基础班',
    description: '系统讲解行测各模块知识点，掌握解题技巧，提高答题速度和准确率。',
    category: '行测',
    duration: '36小时',
    lessons: 24,
    students: 1250,
    rating: 4.8,
    progress: 65,
    status: 'in_progress',
    level: '初级',
    image: courseImg
  },
  {
    id: 2,
    title: '申论写作技巧提升',
    description: '深度剖析申论写作技巧，从材料分析到文章结构，全面提升写作能力。',
    category: '申论',
    duration: '28小时',
    lessons: 18,
    students: 980,
    rating: 4.7,
    progress: 30,
    status: 'in_progress',
    level: '中级',
    image: courseImg
  },
  {
    id: 3,
    title: '公务员面试实战训练',
    description: '模拟真实面试场景，掌握面试技巧，提升临场应变能力和表达能力。',
    category: '面试',
    duration: '20小时',
    lessons: 12,
    students: 756,
    rating: 4.9,
    progress: 0,
    status: 'not_started',
    level: '高级',
    image: courseImg
  },
  {
    id: 4,
    title: '公共基础知识精讲',
    description: '涵盖政治、经济、法律、管理等公共基础知识，系统梳理重点难点。',
    category: '公共基础',
    duration: '32小时',
    lessons: 20,
    students: 1100,
    rating: 4.6,
    progress: 100,
    status: 'completed',
    level: '初级',
    image: courseImg
  },
  {
    id: 5,
    title: '数量关系专项突破',
    description: '针对数量关系模块进行专项训练，掌握数学运算和逻辑推理技巧。',
    category: '行测',
    duration: '24小时',
    lessons: 16,
    students: 890,
    rating: 4.5,
    progress: 45,
    status: 'in_progress',
    level: '中级',
    image: courseImg
  },
  {
    id: 6,
    title: '资料分析高分技巧',
    description: '快速掌握资料分析解题方法，提高计算速度和准确率，冲刺高分。',
    category: '行测',
    duration: '22小时',
    lessons: 14,
    students: 670,
    rating: 4.8,
    progress: 80,
    status: 'in_progress',
    level: '中级',
    image: courseImg
  }
])

// Computed properties
const filteredCourses = computed(() => {
  let filtered = courses.value

  if (searchKeyword.value) {
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(course => course.category === selectedCategory.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(course => course.status === selectedStatus.value)
  }

  return filtered
})

// Methods
const filterCourses = () => {
  // Filtering is handled by computed property
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
}

const goToCourseDetail = (courseId) => {
  router.push(`/kecheng/gwy/${courseId}`)
}

const handleImageError = (event) => {
  event.target.src = courseImg
}

const getProgressColor = (progress) => {
  if (progress === 0) return '#909399'
  if (progress < 30) return '#F56C6C'
  if (progress < 70) return '#E6A23C'
  if (progress < 100) return '#67C23A'
  return '#409EFF'
}

const getStatusType = (status) => {
  const statusMap = {
    'not_started': 'info',
    'in_progress': 'warning',
    'completed': 'success'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'not_started': '未开始',
    'in_progress': '学习中',
    'completed': '已完成'
  }
  return statusMap[status] || '未知'
}

onMounted(() => {
  // Any initialization logic can go here
})
</script>

<style scoped>
.course-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
}


.filter-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 16px;
  z-index: 5;
}

.course-grid {
  margin-bottom: 32px;
}

.course-col {
  margin-bottom: 24px;
}

.course-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.course-image-wrapper {
  position: relative;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.course-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

.course-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(64, 158, 255, 0.9);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.course-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.course-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-description {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.course-progress {
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 12px;
  color: #909399;
}

.progress-percentage {
  font-size: 12px;
  color: #409EFF;
  font-weight: 600;
}

.course-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid #f0f2f5;
  border-bottom: 1px solid #f0f2f5;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.stat-item .el-icon {
  font-size: 14px;
}

.course-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-level {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .filter-section {
    padding: 16px;
  }
  
  .course-content {
    padding: 16px;
  }
}
</style>
