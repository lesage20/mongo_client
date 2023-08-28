<template>
  <q-page class="">

    <div class="row">
      <div class="col-12">
        <h6 class="q-my-none flex justify-between">
          <div>

            <router-link class="q-pl-md" flat :to="{ name: 'collections', params: { db: $route.params.db } }">
              {{ $route.params.db }}
            </router-link>.<span>{{ $route.params.name }}</span>
          </div>

          <q-item dense>
            <q-item-section class="text-center">
              <q-item-label>
                {{ documents.length }}
              </q-item-label>
              <q-item-label caption>
                <span class="text-bold">
                  Documents
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </h6>
      </div>

      <div class="col-12 q-pa-xs">
        <q-input label="Filtre" dense placeholder="{ field : value }" class="bg-grey-2" borderless rounded></q-input>
      </div>

      <div class="col-12 q-pa-xs">
        <q-input label="Champs souhaités" dense borderless rounded class="bg-grey-2"
          placeholder="{ field : 1, field2 : 0 }"></q-input>
      </div>

      <div class="col-xs-12 col-md-9 col-lg-10 q-pa-xs">
        <q-input label="Trie (ordonné par)" dense borderless rounded class="bg-grey-2"
          placeholder="{ field : -1, field2 : 1 }"></q-input>
      </div>
      <div class="col-xs-12 col-md-3 col-lg-2 q-pa-xs">
        <q-input label="Page" type="number" dense borderless class="bg-grey-2" rounded></q-input>
      </div>
      <div class="col-12 q-px-xs q-py-xs" v-for="doc in documents" :key="doc._id">
        <document-card :document="doc"></document-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import DocumentCard from 'src/components/DCard.vue';
const route = useRoute()
const documents = ref([])
async function get_documents(db, col_name) {
  let cols = db_manager.get_documents(db, col_name)
  documents.value = await cols
}

watch(() => route.params.name, (val) => { get_documents(route.params.db, route.params.name) }, { immediate: true })

</script>
