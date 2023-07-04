<template>
  <q-card style="min-width: 350px">
    <q-card-section class="text-h6"> Update Status </q-card-section>

    <q-card-section class="q-py-none">
      <kanban-item :element="props.element" />
    </q-card-section>

    <q-card-section>
      <q-tabs v-model="tab" class="text-teal" dense :vertical="$q.platform.is.mobile" active-color="accent">
        <q-tab name="in-the-office" class="text-green" icon="work" title="In the Office" />
        <q-tab name="working-remotely" class="text-green" icon="work_outline" title="Working Remotely" />
        <q-tab name="out-of-office" class="text-blue-grey-5" icon="comments_disabled" title="Away" />
        <q-tab name="duty-travel" class="text-blue" icon="travel_explore" title="On Duty Travel" />
        <q-tab name="on-leave" class="text-grey" icon="beach_access" title="On Leave" />
      </q-tabs>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="text-grey">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn @click="update" flat label="Update" class="text-primary" icon="save" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import KanbanItem from 'components/Kanban/KanbanItem.vue'

const $q = useQuasar()

const props = defineProps(['element'])
const emit = defineEmits(['update'])

const tab = ref(props.element.status)

function update() {
  let status = tab.value
  emit('update', status)
}
</script>
