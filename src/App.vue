<template>
  <div class="container">
    <markdown-editor v-model="content" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MarkdownEditor from './components/MarkdownEditor.vue'

const content = ref('')
</script>
