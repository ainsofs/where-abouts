<template>
  <q-page padding>
    <div class="text-h5 q-pb-md">
      Login
    </div>
    <form @submit.prevent="onSubmit">
      <div class="q-gutter-md col-md-6">
        <q-input rounded dense outlined v-model="formDetails.email" label="Username" />
        <q-input rounded dense outlined v-model="formDetails.password" label="Password" type="password" />
        <div class="text-right q-gutter-sm">
          <q-btn @click="logout" rounded color="secondary" label="Logout" />
          <q-btn rounded type="submit" color="primary" label="Login" />
        </div>
      </div>
    </form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreAuthentication } from 'stores/storeAuthentication'

const store = useStoreAuthentication()

// data
const formDetails = ref({
  email: '',
  password: '',
})

//functions
function onSubmit() {
  store.loginUser(formDetails.value.email, formDetails.value.password)
}
function logout() {
  // console.log('logout')
  store.logoutUser()
  // store.userStatus()
}
</script>
