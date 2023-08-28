<template>
  <q-page padding class="">

    <div class="row">
      <div class="col-12">
        <h5 class="q-my-xs">
          {{ $route.params.db }}
        </h5>
      </div>
      <div class="col-xs-12 col-md-4 col-lg-3 q-pa-sm" v-for="col in collections" :key="col.name">

        <CollectionCard @update="get_collections($route.params.db)" :collection="col"></CollectionCard>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import CollectionCard from 'src/components/CollectionCard.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const collections = ref([])
async function get_collections(db) {
  let cols = db_manager.get_collections(db)
  collections.value = await cols
}

watch(() => route.params.db, (val) => { get_collections(val) }, { immediate: true })
</script>
