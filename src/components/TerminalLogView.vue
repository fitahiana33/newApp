<template>
  <section class="terminal">
    <header v-if="title" class="terminal__header">
      <span>{{ title }}</span>
      <span v-if="lines.length" class="terminal__count">{{ lines.length }} lignes</span>
    </header>

    <div ref="box" class="terminal__body" :style="{ height: height }">
      <div v-if="!lines.length" class="terminal__empty">
        {{ emptyText }}
      </div>

      <p
        v-for="(line, index) in lines"
        :key="index"
        class="terminal__line"
      >
        <span v-if="typeof line === 'object' && line.time" class="terminal__time">
          {{ line.time }}
        </span>
        <span
          class="terminal__message"
          :class="typeof line === 'object' && line.type ? `is-${line.type}` : 'is-info'"
        >
          {{ typeof line === 'object' ? line.message : line }}
        </span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Logs'
  },
  lines: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '320px'
  },
  emptyText: {
    type: String,
    default: 'Aucun log pour le moment'
  },
  autoScroll: {
    type: Boolean,
    default: true
  }
})

const box = ref(null)

watch(
  () => props.lines.length,
  async () => {
    if (!props.autoScroll) return
    await nextTick()
    if (box.value) {
      box.value.scrollTop = box.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.terminal {
  background: #0f172a;
  color: #e2e8f0;
  border: 1px solid #334155;
  border-radius: 10px;
  overflow: hidden;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

.terminal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #111827;
  border-bottom: 1px solid #334155;
  font-weight: 600;
}

.terminal__count {
  font-size: 12px;
  color: #94a3b8;
}

.terminal__body {
  padding: 12px;
  overflow-y: auto;
  white-space: pre-wrap;
}

.terminal__empty {
  color: #64748b;
  font-style: italic;
}

.terminal__line {
  margin: 0 0 6px 0;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.terminal__time {
  color: #94a3b8;
  flex: none;
}

.terminal__message.is-info {
  color: #e2e8f0;
}

.terminal__message.is-success {
  color: #22c55e;
}

.terminal__message.is-error {
  color: #ef4444;
}

.terminal__message.is-warn {
  color: #f59e0b;
}
</style>