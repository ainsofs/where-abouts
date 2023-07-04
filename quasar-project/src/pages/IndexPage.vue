<template>
  <q-page class="q-pa-md">
    <div class="q-pb-md text-body2">Update peoples Whereabouts by dragging their names to the appropriate area (desktop only). You can also click on them to select a status.</div>

    <div class="q-pb-sm text-caption">Filters</div>

    <div class="filters q-pb-md row q-col-gutter-sm">
      <q-select rounded outlined dense v-model="store.staffTeam" :options="options" class="col-xs-12 col-sm-6" label="Teams" />

      <q-input rounded outlined dense debounce="500" v-model="store.staffFilter" placeholder="Search by staff name" label="Staff name" class="col-xs-12 col-sm-6" type="search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="board row q-col-gutter-md">
      <!-- in the office -->
      <div :class="spacingCss">
        <kanban-list title="In the Office" icon="work" header-css="bg-green text-white" body-css="bg-green-1" :list="store.getStaffInTheOffice" badge-colour="green" @add="add('in-the-office', $event)" @remove="remove('in-the-office', $event)" @item-click="showModal" />
      </div>
      <!-- working remotely -->
      <div :class="spacingCss">
        <kanban-list title="Working Remotely" icon="work_outline" header-css="bg-green text-white" body-css="bg-green-1" :list="store.getStaffWorkingRemotely" badge-colour="blue" @add="add('working-remotely', $event)" @remove="remove('working-remotely', $event)" @item-click="showModal" />
      </div>
      <!-- Away -->
      <div :class="spacingCss">
        <kanban-list title="Away" icon="comments_disabled" header-css="bg-blue-grey-5 text-white" body-css="bg-blue-grey-1" :list="store.getStaffOutOfOffice" badge-colour="blue-grey-5" @add="add('out-of-office', $event)" @remove="remove('out-of-office', $event)" @item-click="showModal" />
      </div>
      <!-- On Duty Travel -->
      <div :class="spacingCss">
        <kanban-list title="On Duty Travel" icon="travel_explore" header-css="bg-blue text-white" body-css="bg-blue-1" :list="store.getStaffOnDutyTravel" badge-colour="blue-grey-5" @add="add('duty-travel', $event)" @remove="remove('duty-travel', $event)" @item-click="showModal" />
      </div>
      <!-- On Leave -->
      <div :class="spacingCss">
        <kanban-list title="On Leave" icon="beach_access" header-css="bg-grey text-white" body-css="bg-grey-1" :list="store.getStaffOnLeave" badge-colour="grey" @add="add('on-leave', $event)" @remove="remove('on-leave', $event)" @item-click="showModal" />
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <set-status-modal :element="element" @update="update" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStoreStaff } from 'stores/storeStaff'

import KanbanList from 'components/Kanban/KanbanList.vue'
import SetStatusModal from 'components/Kanban/Modals/SetStatusModal.vue'

const store = useStoreStaff()

store.dReadData()

const spacingCss = 'col-xs-12 col-md-3 col-lg-2'

const prompt = ref(false)
const element = ref(null)

const options = ref(['GO- Governance and Operations (IT, KM, PCU, Strategic Planning, FA, HR)', 'EO- Executive Office (Exec Support, Legal, IA, Comms)', 'CCR- Climate Change Resilience', 'EMG- Environmental Management and Governance', 'IOE- Islands and Ocean Ecosystems', 'WMPC- Waste Management and Pollution Control', 'IT', ''])

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
function update(status) {
  let el = element.value
  if (el.status !== status) {
    // its changed
    remove(el.status, el)
    add(status, el)
  }

  prompt.value = false
}
function showModal(event) {
  element.value = event
  prompt.value = true
}
</script>
