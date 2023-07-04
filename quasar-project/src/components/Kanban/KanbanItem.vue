<template>
  <q-item @click="click" class="q-my-sm" clickable v-ripple>
    <q-item-section avatar>
      <q-avatar v-if="!element.avatar" color="primary" text-color="white">
        <img :src="`https://api.dicebear.com/6.x/avataaars/svg?seed=${element.name}`" />
      </q-avatar>
      <q-avatar v-if="element.avatar">
        <img :src="`http://localhost:8000${element.avatar}`" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ element.name }}</q-item-label>
      <q-item-label caption lines="1">{{ element.email }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="chat_bubble" color="secondary" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

// props and emits
const props = defineProps(['element'])
const emit = defineEmits(['click'])

function click() {
  emit('click')
}
</script>
