<template>
  <q-page padding class="">

    <div class="row">
      <div class="col-12">
        <h5 class="q-my-xs">
          Base de données
        </h5>
      </div>
      <div class="col-xs-12 col-md-4 col-lg-3 q-pa-sm" v-for="db in databases" :key="db.name">

        <DatabaseCard @update="get_dbs" :db="db"></DatabaseCard>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DatabaseCard from 'src/components/DatabaseCard.vue';

const databases = ref([])
async function get_dbs() {
  let dbs = db_manager.get_dbs()
  databases.value = await dbs
}

onMounted(() => get_dbs())
</script>
