<template>
  <q-page padding>
    <div class="text-h5 q-pb-md">Login</div>
    <form @submit.prevent.stop="onSubmit">
      <div class="q-gutter-md col-md-6">
        <q-input rounded dense outlined v-model="formDetails.email" label="Username" lazy-rules :rules="nameRules" ref="nameRef" />
        <q-input rounded dense outlined v-model="formDetails.password" label="Password" :type="isPwd ? 'password' : 'text'" :rules="nameRules" ref="emailRef">
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
        <div class="text-right q-gutter-sm">
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

const isPwd = ref(true)

const nameRef = ref(null)
const emailRef = ref(null)
const nameRules = [val => (val && val.length > 0) || 'Please type something']

// data
const formDetails = ref({
  email: '',
  password: '',
})

//functions
function onSubmit() {
  nameRef.value.validate()
  emailRef.value.validate()

  if (nameRef.value.hasError || emailRef.value.hasError) {
    // form has error
  } else {
    store.loginUser(formDetails.value.email, formDetails.value.password)
  }
}
</script>
