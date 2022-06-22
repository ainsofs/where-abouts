<template>
<q-card style="min-width: 350px">
  <q-card-section>
    <div class="text-h6">Set Status</div>
    <kanban-item :element="props.element" />
  </q-card-section>

  <q-card-section class="q-pt-none">
    <q-tabs
      v-model="tab"
      class="text-teal"
    >
      <q-tab name="in-the-office" class="text-green" icon="work" label="In the Office" />
      <q-tab name="working-remotely" class="text-blue" icon="work_outline" label="W. Remotely" />
      <q-tab name="out-of-office" class="text-blue-grey-5" icon="comments_disabled" label="Out of Office" />
      <q-tab name="on-leave" class="text-grey" icon="beach_access" label="On Leave" />
    </q-tabs>
  </q-card-section>

  <q-card-actions align="right" class="text-primary">
    <q-btn flat label="Cancel" v-close-popup />
    <q-btn flat label="Update" v-close-popup />
  </q-card-actions>
</q-card>
</template>

<script setup>
import { ref } from 'vue'
import KanbanItem from 'components/Kanban/KanbanItem.vue'

const props = defineProps(['element'])

const tab = ref(props.element.status)
</script>
