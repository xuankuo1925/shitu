<template>
  <div class="course-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Course Content -->
    <div v-else-if="course" class="course-content">
      <!-- Course Header -->
      <div class="course-header">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/kecheng/gwy' }">公务员课程</el-breadcrumb-item>
          <el-breadcrumb-item>{{ course.category }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ course.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <div class="course-title-section">
          <h1 class="course-title">{{ course.title }}</h1>
          <div class="course-meta">
            <el-tag :type="getLevelType(course.level)" size="small">{{ course.level }}</el-tag>
            <span class="course-category">{{ course.category }}</span>
            <span class="course-duration">{{ course.duration }}</span>
            <el-rate v-model="course.rating" disabled show-score text-color="#ff9900" />
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <el-row :gutter="24">
        <!-- Video Player Section -->
        <el-col :xs="24" :lg="16">
          <div class="video-section">
            <!-- Video Player -->
            <div class="video-player-wrapper">
              <video
                ref="videoPlayer"
                class="video-player"
                :src="currentLesson?.videoUrl"
                :poster="course.image"
                controls
                @timeupdate="updateProgress"
                @loadedmetadata="onVideoLoaded"
                @ended="onVideoEnded"
              >
                您的浏览器不支持视频播放。
              </video>
              
              <!-- Video Overlay for Lesson Completion -->
              <div v-if="showCompletionOverlay" class="video-overlay">
                <div class="overlay-content">
                  <el-icon class="completion-icon"><CircleCheck /></el-icon>
                  <h3>恭喜完成本节课！</h3>
                  <div class="overlay-actions">
                    <el-button type="primary" @click="nextLesson">下一节课</el-button>
                    <el-button @click="showCompletionOverlay = false">继续观看</el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Lesson Info -->
            <div class="current-lesson-info">
              <h3 class="lesson-title">{{ currentLesson?.title }}</h3>
              <p class="lesson-description">{{ currentLesson?.description }}</p>
              
              <!-- Lesson Progress -->
              <div class="lesson-progress">
                <div class="progress-info">
                  <span>本节课进度</span>
                  <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                </div>
                <el-progress 
                  :percentage="lessonProgress" 
                  :color="getProgressColor(lessonProgress)"
                  :show-text="false"
                />
              </div>
            </div>

            <!-- Video Controls -->
            <div class="video-controls">
              <el-button-group>
                <el-button 
                  :disabled="currentLessonIndex === 0" 
                  @click="previousLesson"
                >
                  <el-icon><ArrowLeft /></el-icon>
                  上一节
                </el-button>
                <el-button @click="togglePlayback">
                  <el-icon><VideoPause v-if="!isPaused" /><VideoPlay v-else /></el-icon>
                  {{ isPaused ? '播放' : '暂停' }}
                </el-button>
                <el-button 
                  :disabled="currentLessonIndex === course.lessons.length - 1" 
                  @click="nextLesson"
                >
                  下一节
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
              
              <div class="playback-speed">
                <el-select v-model="playbackSpeed" size="small" @change="changePlaybackSpeed">
                  <el-option label="0.5x" value="0.5" />
                  <el-option label="0.75x" value="0.75" />
                  <el-option label="1x" value="1" />
                  <el-option label="1.25x" value="1.25" />
                  <el-option label="1.5x" value="1.5" />
                  <el-option label="2x" value="2" />
                </el-select>
              </div>
            </div>
          </div>
        </el-col>

        <!-- Sidebar -->
        <el-col :xs="24" :lg="8">
          <!-- Course Progress Card -->
          <div class="progress-card">
            <div class="card-header">
              <h3>课程进度</h3>
              <el-progress 
                type="circle" 
                :percentage="course.progress" 
                :width="60" 
                :stroke-width="4"
              />
            </div>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-label">已完成课时</span>
                <span class="stat-value">{{ completedLessons }} / {{ course.lessons.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">学习时长</span>
                <span class="stat-value">{{ formatTime(totalWatchTime) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">预计剩余时间</span>
                <span class="stat-value">{{ estimatedRemainingTime }}</span>
              </div>
            </div>
          </div>

          <!-- Lesson List -->
          <div class="lesson-list-card">
            <div class="card-header">
              <h3>课程目录</h3>
              <el-button type="primary" link @click="expandAll = !expandAll">
                {{ expandAll ? '收起全部' : '展开全部' }}
              </el-button>
            </div>
            
            <div class="lesson-list">
              <div
                v-for="(lesson, index) in course.lessons"
                :key="lesson.id"
                class="lesson-item"
                :class="{ 
                  'active': index === currentLessonIndex,
                  'completed': lesson.completed,
                  'locked': lesson.locked && index > 0 && !course.lessons[index - 1].completed
                }"
                @click="selectLesson(index)"
              >
                <div class="lesson-number">{{ index + 1 }}</div>
                <div class="lesson-info">
                  <div class="lesson-title-small">{{ lesson.title }}</div>
                  <div class="lesson-duration">{{ lesson.duration }}</div>
                </div>
                <div class="lesson-status">
                  <el-icon v-if="lesson.completed" class="completed-icon"><CircleCheck /></el-icon>
                  <el-icon v-else-if="index === currentLessonIndex" class="playing-icon"><VideoPlay /></el-icon>
                  <el-icon v-else-if="lesson.locked && index > 0 && !course.lessons[index - 1].completed" class="locked-icon"><Lock /></el-icon>
                  <div v-else class="empty-circle"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Course Resources -->
          <div class="resources-card">
            <div class="card-header">
              <h3>课程资料</h3>
            </div>
            <div class="resources-list">
              <div v-for="resource in course.resources" :key="resource.id" class="resource-item">
                <el-icon class="resource-icon">
                  <Document v-if="resource.type === 'pdf'" />
                  <Download v-if="resource.type === 'download'" />
                  <Link v-if="resource.type === 'link'" />
                </el-icon>
                <span class="resource-name">{{ resource.name }}</span>
                <el-button type="primary" link size="small" @click="downloadResource(resource)">
                  下载
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- Course Description -->
      <div class="course-description-section">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>课程介绍</h3>
            </div>
          </template>
          <div class="course-description-content">
            <p>{{ course.fullDescription }}</p>
            
            <h4>学习目标</h4>
            <ul>
              <li v-for="objective in course.objectives" :key="objective">
                {{ objective }}
              </li>
            </ul>
            
            <h4>适合人群</h4>
            <p>{{ course.targetAudience }}</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <el-result
        icon="warning"
        title="课程未找到"
        sub-title="抱歉，您访问的课程不存在或已被删除"
      >
        <template #extra>
          <el-button type="primary" @click="goBack">返回课程列表</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowRight, 
  VideoPlay, 
  VideoPause, 
  CircleCheck, 
  Lock, 
  Document, 
  Download, 
  Link 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// Reactive data
const loading = ref(true)
const course = ref(null)
const currentLessonIndex = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const isPaused = ref(true)
const playbackSpeed = ref('1')
const showCompletionOverlay = ref(false)
const expandAll = ref(false)
const totalWatchTime = ref(0)
const lessonProgressMap = ref({})

// Refs
const videoPlayer = ref(null)

// Mock course data - in a real app, this would come from an API
const mockCourseData = {
  id: parseInt(route.params.id),
  title: '行政职业能力测验基础班',
  description: '系统讲解行测各模块知识点，掌握解题技巧，提高答题速度和准确率。',
  fullDescription: '本课程专为公务员考试行政职业能力测验设计，涵盖言语理解、数量关系、判断推理、资料分析、常识判断五大模块。通过系统学习，帮助考生掌握各模块的核心知识点和解题技巧，提高答题速度和准确率，为公务员考试打下坚实基础。',
  category: '行测',
  duration: '36小时',
  level: '初级',
  rating: 4.8,
  progress: 65,
  image: '/images/course.jpg',
  objectives: [
    '掌握行测五大模块的核心知识点',
    '熟练运用各模块的解题技巧',
    '提高答题速度和准确率',
    '建立系统的知识体系',
    '培养良好的答题习惯'
  ],
  targetAudience: '准备参加公务员考试的学员，特别是行测基础薄弱的考生。',
  lessons: [
    {
      id: 1,
      title: '课程导学',
      description: '介绍课程结构、学习方法和备考策略',
      duration: '15分钟',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      completed: true,
      locked: false
    },
    {
      id: 2,
      title: '言语理解概述',
      description: '言语理解题型介绍和基本解题思路',
      duration: '45分钟',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      completed: true,
      locked: false
    },
    {
      id: 3,
      title: '主旨概括题技巧',
      description: '掌握主旨概括题的解题方法和技巧',
      duration: '60分钟',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      completed: false,
      locked: false
    },
    {
      id: 4,
      title: '细节理解题突破',
      description: '细节理解题的快速定位和理解技巧',
      duration: '50分钟',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      completed: false,
      locked: false
    },
    {
      id: 5,
      title: '数量关系基础',
      description: '数量关系题型分析和基础数学知识回顾',
      duration: '55分钟',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      completed: false,
      locked: true
    }
  ],
  resources: [
    { id: 1, name: '课程讲义.pdf', type: 'pdf' },
    { id: 2, name: '练习题库.zip', type: 'download' },
    { id: 3, name: '相关法规链接', type: 'link' }
  ]
}

// Computed properties
const currentLesson = computed(() => {
  return course.value?.lessons[currentLessonIndex.value]
})

const lessonProgress = computed(() => {
  const lessonId = currentLesson.value?.id
  if (!lessonId) return 0
  
  const progress = lessonProgressMap.value[lessonId]
  if (!progress || !duration.value) return 0
  
  return Math.round((progress / duration.value) * 100)
})

const completedLessons = computed(() => {
  return course.value?.lessons.filter(lesson => lesson.completed).length || 0
})

const estimatedRemainingTime = computed(() => {
  if (!course.value) return '0分钟'
  
  const remainingLessons = course.value.lessons.filter(lesson => !lesson.completed)
  const totalMinutes = remainingLessons.reduce((total, lesson) => {
    const minutes = parseInt(lesson.duration)
    return total + (isNaN(minutes) ? 0 : minutes)
  }, 0)
  
  if (totalMinutes < 60) {
    return `${totalMinutes}分钟`
  } else {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`
  }
})

// Methods
const loadCourse = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, you would fetch course data based on route.params.id
    course.value = mockCourseData
    
    // Set current lesson to first incomplete lesson
    const firstIncompleteIndex = course.value.lessons.findIndex(lesson => !lesson.completed)
    currentLessonIndex.value = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0
    
  } catch (error) {
    console.error('Failed to load course:', error)
  } finally {
    loading.value = false
  }
}

const selectLesson = (index) => {
  const lesson = course.value.lessons[index]
  
  // Check if lesson is locked
  if (lesson.locked && index > 0 && !course.value.lessons[index - 1].completed) {
    ElMessage.warning('请先完成上一节课')
    return
  }
  
  currentLessonIndex.value = index
  currentTime.value = 0
  lessonProgress.value = 0
  showCompletionOverlay.value = false
  
  // Load saved progress for this lesson
  const savedProgress = lessonProgressMap.value[lesson.id]
  if (savedProgress && videoPlayer.value) {
    videoPlayer.value.currentTime = savedProgress
  }
}

const updateProgress = () => {
  if (!videoPlayer.value) return
  
  currentTime.value = videoPlayer.value.currentTime
  duration.value = videoPlayer.value.duration
  isPaused.value = videoPlayer.value.paused
  
  // Save progress
  if (currentLesson.value) {
    lessonProgressMap.value[currentLesson.value.id] = currentTime.value
  }
  
  // Track total watch time
  if (!isPaused.value) {
    totalWatchTime.value += 0.25 // Approximate, since timeupdate fires every 250ms
  }
}

const onVideoLoaded = () => {
  if (videoPlayer.value && currentLesson.value) {
    videoPlayer.value.playbackRate = parseFloat(playbackSpeed.value)
    
    // Load saved progress
    const savedProgress = lessonProgressMap.value[currentLesson.value.id]
    if (savedProgress) {
      videoPlayer.value.currentTime = savedProgress
    }
  }
}

const onVideoEnded = () => {
  if (currentLesson.value && !currentLesson.value.completed) {
    currentLesson.value.completed = true
    showCompletionOverlay.value = true
    
    // Update course progress
    updateCourseProgress()
  }
}

const togglePlayback = () => {
  if (!videoPlayer.value) return
  
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
  } else {
    videoPlayer.value.pause()
  }
}

const changePlaybackSpeed = (speed) => {
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = parseFloat(speed)
  }
}

const previousLesson = () => {
  if (currentLessonIndex.value > 0) {
    selectLesson(currentLessonIndex.value - 1)
  }
}

const nextLesson = () => {
  if (currentLessonIndex.value < course.value.lessons.length - 1) {
    selectLesson(currentLessonIndex.value + 1)
  }
  showCompletionOverlay.value = false
}

const updateCourseProgress = () => {
  if (!course.value) return
  
  const completedCount = course.value.lessons.filter(lesson => lesson.completed).length
  course.value.progress = Math.round((completedCount / course.value.lessons.length) * 100)
}

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === 0) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getLevelType = (level) => {
  const levelMap = {
    '初级': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return levelMap[level] || 'info'
}

const getProgressColor = (progress) => {
  if (progress === 0) return '#909399'
  if (progress < 30) return '#F56C6C'
  if (progress < 70) return '#E6A23C'
  if (progress < 100) return '#67C23A'
  return '#409EFF'
}

const downloadResource = (resource) => {
  // Simulate download
  ElMessage.success(`开始下载: ${resource.name}`)
}

const goBack = () => {
  router.push('/kecheng/gwy')
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (!videoPlayer.value) return
  
  switch (event.code) {
    case 'Space':
      event.preventDefault()
      togglePlayback()
      break
    case 'ArrowLeft':
      event.preventDefault()
      videoPlayer.value.currentTime = Math.max(0, videoPlayer.value.currentTime - 10)
      break
    case 'ArrowRight':
      event.preventDefault()
      videoPlayer.value.currentTime = Math.min(duration.value, videoPlayer.value.currentTime + 10)
      break
  }
}

onMounted(() => {
  loadCourse()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.course-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

.loading-state {
  padding: 60px 0;
}

.course-header {
  margin-bottom: 24px;
}

.breadcrumb {
  margin-bottom: 16px;
}

.course-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.course-title {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.course-category {
  color: #909399;
  font-size: 14px;
}

.course-duration {
  color: #909399;
  font-size: 14px;
}

.video-section {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.video-player-wrapper {
  position: relative;
  background: #000;
  aspect-ratio: 16/9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.overlay-content {
  text-align: center;
  padding: 32px;
}

.completion-icon {
  font-size: 64px;
  color: #67C23A;
  margin-bottom: 16px;
}

.overlay-actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.current-lesson-info {
  padding: 24px;
}

.lesson-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.lesson-description {
  color: #909399;
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.lesson-progress {
  margin-top: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #909399;
}

.video-controls {
  padding: 0 24px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.playback-speed {
  min-width: 80px;
}

.progress-card,
.lesson-list-card,
.resources-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.progress-stats {
  padding: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.stat-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.lesson-list {
  max-height: 400px;
  overflow-y: auto;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.lesson-item:hover {
  background-color: #f5f7fa;
}

.lesson-item.active {
  background-color: var(--el-color-primary-light-9);
  border-left: 3px solid var(--el-color-primary);
}

.lesson-item.completed {
  opacity: 0.8;
}

.lesson-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.lesson-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #909399;
  margin-right: 12px;
}

.lesson-item.active .lesson-number {
  background: var(--el-color-primary);
  color: #fff;
}

.lesson-item.completed .lesson-number {
  background: #67C23A;
  color: #fff;
}

.lesson-info {
  flex: 1;
}

.lesson-title-small {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.lesson-duration {
  font-size: 12px;
  color: #909399;
}

.lesson-status {
  margin-left: 12px;
}

.completed-icon {
  color: #67C23A;
  font-size: 20px;
}

.playing-icon {
  color: var(--el-color-primary);
  font-size: 20px;
}

.locked-icon {
  color: #909399;
  font-size: 20px;
}

.empty-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
}

.resources-list {
  padding: 16px 0;
}

.resource-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  gap: 12px;
}

.resource-icon {
  color: #909399;
  font-size: 20px;
}

.resource-name {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.course-description-section {
  margin-top: 24px;
}

.course-description-content {
  padding: 24px;
  line-height: 1.6;
}

.course-description-content h4 {
  color: #303133;
  margin: 24px 0 12px 0;
  font-size: 16px;
}

.course-description-content ul {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.course-description-content li {
  margin-bottom: 8px;
  color: #606266;
}

.error-state {
  padding: 60px 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .course-title-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .video-controls {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .course-title {
    font-size: 20px;
  }
  
  .current-lesson-info {
    padding: 16px;
  }
  
  .video-controls {
    padding: 0 16px 16px;
  }
  
  .card-header {
    padding: 16px;
  }
  
  .lesson-item {
    padding: 12px 16px;
  }
  
  .resource-item {
    padding: 8px 16px;
  }
}
</style>