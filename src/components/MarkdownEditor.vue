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
		after: () => {
			vditor.value.focus()
		}
	})

	ipcRenderer.on('save-content', () => {
		let content = vditor.value.getValue()
		ipcRenderer.send('save-and-quit', content)
	})

	ipcRenderer.on('load-content', (event, content) => {
		vditor.value.setValue(content)
	})
	

	ipcRenderer.on('theme', (event, theme) => {
		console.log('Setting theme:', theme);
		vditor.value.setTheme(theme, theme, theme)
	// You could then store this in a Vuex store or local variable
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
	padding: 0px;
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
