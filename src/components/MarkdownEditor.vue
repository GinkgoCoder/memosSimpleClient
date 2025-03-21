<template>
	<div class="editor-wrapper">
		<div ref="vditorRef"></div>
	</div>
</template>

<script setup>
import 'vditor/dist/index.css'
import Vditor from 'vditor'
import { defineProps, defineEmits, onBeforeUnmount, onMounted, ref } from 'vue'
import { ipcRenderer } from 'electron'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['update:modelValue'])
const vditorRef = ref(null)
const vditor = ref(null)

onMounted(() => {
	vditor.value = new Vditor(vditorRef.value, {
		height: '100%',
		mode: 'ir',
		value: props.modelValue,
		input: (value) => {
			emit('update:modelValue', value)
		},
		cache: {
			enable: false
		},
		tab: '    ',
	})

	ipcRenderer.on('save-content', () => {
		const content = vditor.value.getValue()
		console.dir(content)
		ipcRenderer.send('save-and-quit', content)
	})

	ipcRenderer.on('load-content', (event, content) => {
		vditor.value.setValue(content)
	})
})

onBeforeUnmount(() => {
	vditor.value?.destroy()
	ipcRenderer.removeAllListeners('save-content')
	ipcRenderer.removeAllListeners('load-content')
})
</script>

<style>
.editor-wrapper {
	height: calc(100vh - 16px);
	width: 100%;
	padding: 8px;
	box-sizing: border-box;
}

.editor-wrapper>div {
	height: calc(100vh - 16px);
	border-radius: 8px;
	overflow: hidden;
}

div.vditor-toolbar {
	display: none !important;
}
</style>