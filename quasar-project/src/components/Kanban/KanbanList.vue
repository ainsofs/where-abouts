<template>
  <div class="rounded-borders" >
    <q-toolbar :class="props.headerCss">
      <q-toolbar-title><span>{{ props.title }}
        <q-badge v-if="listLength" rounded align="middle" color="white" :text-color="props.badgeColour">{{ listLength }}</q-badge>
      </span>
      </q-toolbar-title>
    </q-toolbar>
    <q-list bordered :class="props.bodyCss">
      <draggable
        class="list-group"
        :list="props.list"
        @change="log"
        itemKey="id"
        :component-data="{
          tag: 'q-item',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element }">
          <q-item class="q-my-sm" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar v-if="!element.avatar" color="primary" text-color="white">
                {{ element.letter }}
              </q-avatar>
              <q-avatar v-if="element.avatar">
                <img :src="`https://cdn.quasar.dev/img/${element.avatar}`">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ element.name }}</q-item-label>
              <q-item-label caption lines="1">{{ element.email }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chat_bubble" color="green" />
            </q-item-section>
            </q-item>
        </template>
      </draggable>
    </q-list>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { computed, ref } from 'vue'

const props = defineProps(['title', 'headerCss', 'bodyCss', 'list', 'badgeColour'])
const emit = defineEmits(['add', 'remove'])

const listLength  = computed(() => {
  return props.list.length
})

function log(evt) {
  // window.console.log(evt, props.title)
  const key = Object.keys(evt)[0]
  switch (key) {
    case 'added':
      emit('add', evt.added.element)
      // console.log(evt.added.element)
      break
    case 'removed':
      emit('remove', evt.removed.element)
      // console.log(evt.removed.element)
      break
    default:
      // do nothing
  }
}

const drag = ref(false)

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  }
})

</script>

<style scoped lang="scss">
.list-group {
  min-height: 25px
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

