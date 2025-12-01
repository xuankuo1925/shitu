<template>
    <NuxtLink v-for="doc in docs" :key="doc.path" :to="doc.path">
        <h2>{{ doc.title }}</h2>
        <p>{{ doc.description }}</p>
        <div class="meta">
            <el-icon size="14"><Calendar /></el-icon>
            <span>{{ doc.date }}</span>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
const { data: docs } = await useAsyncData('documents-list', () => {
    return queryCollection('gonggao')
        .select('title', 'path', 'description', 'date')
        .all()
})
</script>