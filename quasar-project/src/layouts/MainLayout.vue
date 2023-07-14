<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Whereabouts </q-toolbar-title>

        <q-btn v-if="!store.loggedIn" stretch flat label="Login" href="/#/user" />

        <q-btn-dropdown v-else flat padding="none">
          <template v-slot:label>
            <q-avatar>
              <img :src="'https://api.dicebear.com/6.x/initials/svg?seed=' + username" :alt="username" />
            </q-avatar>
          </template>

          <q-list>
            <q-item clickable v-ripple @click="logout" >
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>

              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="150">
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>

<script>
import { defineComponent, ref, computed } from 'vue'
import { date } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import { useStoreAuthentication } from 'src/stores/storeAuthentication'
import { useRouter } from 'vue-router'

const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/#',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const store = useStoreAuthentication()
    const router = useRouter()

    return {
      username: computed(() => {
        return store.user.name
      }),
      store,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout() {
        store.logoutUser()
        router.push('/user')
      }
    }
  },
})
</script>
