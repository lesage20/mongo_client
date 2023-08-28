<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-blue-1 text-blue-8" v-if="$route.params.name == undefined">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-item dense to="/">
            <q-item-section>
              <q-item-label>
                Edane Mongo Client
              </q-item-label>

            </q-item-section>
          </q-item>
        </q-toolbar-title>

        <div>v 0.1.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer class="bg-grey-2" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Base de données
        </q-item-label>

        <!-- <q-item>
          <q-item-label>

            <q-input rounded dense placeholder="Recherche...">
              <template v-slot:append>
                <q-icon class="q-mr-sm" size="xs" name="search" />
              </template>
            </q-input>
          </q-item-label>
        </q-item> -->
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
let dbs = db_manager.get_dbs()
const linksList = ref([])


dbs.then(res => {
  for (let element of res) {
    element.icon = 'mdi-database-outline'
    element.collections = element.collections.map(el => ({ icon: 'mdi-code-brackets', name: el }))
  }
  linksList.value = res

})

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
