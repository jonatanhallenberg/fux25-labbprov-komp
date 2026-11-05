<template>
  <div>
    <h1>Meddelanden</h1>
    <p v-if="loading">Laddar…</p>
    <p v-else-if="error" role="alert" class="error">{{ error }}</p>
    <div v-else>
      <article v-for="m in messages" :key="m.id" class="card">
        <p class="hint">{{ formatDate(m.date) }} · {{ m.from }}</p>
        <!-- API:t markerar boktiteln med *asterisker* – vi gör fetstil av dem -->
        <p v-html="toHtml(m.text)"></p>
      </article>
      <p v-if="messages.length === 0" class="hint">Inga meddelanden.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchMessages } from '../services/api'
import { formatDate } from '../utils/date'

// *Doktor Glas* → <strong>Doktor Glas</strong>
const toHtml = (text) => String(text).replace(/\*([^*]+)\*/g, '<strong>$1</strong>')

const messages = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    messages.value = await fetchMessages()
  } catch (e) {
    error.value = 'Kunde inte hämta meddelanden.'
  } finally {
    loading.value = false
  }
})
</script>
