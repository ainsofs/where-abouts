<template>
  <div class="rounded-borders">
    <q-toolbar :class="props.headerCss">
      <q-toolbar-title class="q-pt-sm">
        <q-btn dense round flat :icon="props.icon"> </q-btn>
        {{ props.title }}
        <q-badge v-if="listLength" color="grey-14" rounded floating>
          {{ listLength }}
        </q-badge>
      </q-toolbar-title>
    </q-toolbar>
    <q-list bordered class="bg-grey-1">
      <draggable
        class="list-group"
        :list="filteredList"
        @change="log"
        itemKey="id"
        :component-data="{
          tag: 'q-item',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element }">
          <kanban-item :element="element" @click="click(element)" />
        </template>
      </draggable>

      <!-- footer buttons -->
      <div v-if="showFooter">
        <!-- show -->
        <q-item v-if="listLimit" @click="showMore" class="q-my-sm" clickable v-ripple>
          <q-item-section>
            <q-item-label>Show more</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_down" />
          </q-item-section>
        </q-item>

        <!-- hide -->
        <q-item v-else @click="listLimit = 5" class="q-my-sm" clickable v-ripple>
          <q-item-section>
            <q-item-label>Show less</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="expand_less" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import KanbanItem from 'components/Kanban/KanbanItem.vue'

const $q = useQuasar()

const props = defineProps(['title', 'icon', 'headerCss', 'bodyCss', 'list', 'badgeColour'])
// bodyCss is unused now
const emit = defineEmits(['add', 'remove', 'item-click'])

const listLength = computed(() => {
  return props.list.length
})

const showFooter = computed(() => {
  return listLimit.value < listLength.value
})

const listLimit = ref(5)

const filteredList = computed(() => {
  let limit = listLimit.value
  if (limit > 0) {
    return props.list.slice(0, limit)
  }

  return props.list
})

function click(element) {
  emit('item-click', element)
}

function showMore() {
  let increment = 10
  listLimit.value = listLimit.value + increment

  if (listLimit.value >= listLength.value) {
    listLimit.value = 0
  }
}

function log(evt) {
  const key = Object.keys(evt)[0]
  switch (key) {
    case 'added':
      emit('add', evt.added.element)
      break
    case 'removed':
      emit('remove', evt.removed.element)
      break
    default:
    // do nothing
  }
}

const drag = ref(false)

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: $q.platform.is.mobile,
    ghostClass: 'ghost',
  }
})
</script>

<style scoped lang="scss">
.list-group {
  min-height: 25px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
