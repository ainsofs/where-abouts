<template>
  <q-page class="q-pa-md">
    <div class="q-pb-md text-caption">Update peoples where abouts by dragging their names to the appropriate area.</div>

    <div class="board row q-col-gutter-md">
      <!-- in the office -->
      <div :class="spacingCss">
        <kanban-list
          title="In the Office"
          header-css="bg-green text-white"
          body-css="bg-green-1"
          :list="inTheOffice"
          badge-colour="green"
          @add="add('in-the-office', $event)"
          @remove="remove('in-the-office', $event)"
          />
      </div>
      <!-- working remotely -->
      <div :class="spacingCss">
        <kanban-list
          title="Working Remotely"
          header-css="bg-blue text-white"
          body-css="bg-blue-1"
          :list="workingRemotely"
          badge-colour="blue"
          @add="add('working-remotely', $event)"
          @remove="remove('working-remotely', $event)"
          />
      </div>
      <!-- Out of office -->
      <div :class="spacingCss">
        <kanban-list
          title="Out of Office"
          header-css="bg-blue-grey-5 text-white"
          body-css="bg-blue-grey-1"
          :list="outOfOffice"
          badge-colour="blue-grey-5"
          @add="add('out-of-office', $event)"
          @remove="remove('out-of-office', $event)"
          />
      </div>
      <!-- On Leave -->
      <div :class="spacingCss">
        <kanban-list
          title="On Leave"
          header-css="bg-grey text-white"
          body-css="bg-grey-1"
          :list="onLeave"
          badge-colour="grey"
          @add="add('on-leave', $event)"
          @remove="remove('on-leave', $event)"
          />
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreStaff } from 'stores/storeStaff'
import KanbanList from 'components/Kanban/KanbanList.vue'

const store = useStoreStaff()

const spacingCss = "col-xs-12 col-sm-6 col-lg-3"

const inTheOffice = ref(store.getStaffInTheOffice)
const workingRemotely = ref(store.getStaffWorkingRemotely)
const outOfOffice = ref(store.getStaffOutOfOffice)
const onLeave = ref(store.getStaffOnLeave)

function add(status, element) {
  element.status = status
  store.updateStaff(element.id, element)
}
function remove(status, element) {
  if (element.status === status) {
    element.status = ''
    store.updateStaff(element.id, element)
  }
}
</script>

