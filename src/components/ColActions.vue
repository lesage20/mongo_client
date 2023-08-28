<template>
  <q-btn color="grey-7" round flat icon="more_vert">
    <q-menu cover auto-close style="width: 200px;">
      <q-list>
        <q-item @click="vider" dense clickable>
          <q-item-section avatar aside>
            <q-icon name="mdi-battery-outline" v-if="!loading.vider"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>
          <q-item-section>Vider</q-item-section>
        </q-item>
        <q-item dense clickable @click="rename">
          <q-item-section avatar aside>
            <q-icon name="mdi-form-textbox" v-if="!loading.renommer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              Renommer
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item dense clickable @click="replace">
          <q-item-section avatar aside>
            <q-icon name="mdi-file-replace" v-if="!loading.remplacer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>Remplacer</q-item-section>
        </q-item>

        <q-item dense clickable @click="supprimer">
          <q-item-section avatar aside>
            <q-icon name="mdi-delete" v-if="!loading.supprimer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>Supprimer</q-item-section>
        </q-item>
        <q-item dense clickable @click="exprt">
          <q-item-section avatar aside>
            <q-icon name="mdi-database-export" v-if="!loading.exporter"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>Exporter</q-item-section>
        </q-item>

        <q-item dense clickable @click="imprt">
          <q-item-section avatar aside>
            <q-icon name="mdi-database-import" v-if="!loading.importer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>
          <q-item-section>Importer</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { useQuasar } from "quasar"
import { ref, reactive } from "vue"
import { useRoute } from "vue-router"

const props = defineProps({
  collection: {
    type: Object
  }
})
const emit = defineEmits(['update'])

const $q = useQuasar()
const route = useRoute()
const new_name = ref(null)
const new_file = ref(null)
const loading = reactive({ vider: false, renommer: false, supprimer: false, remplacer: false, exporter: false, importer: false })

// actions
async function vider() {
  loading.vider = true
  await db_manager.vider(route.params.db, props.collection.name)
  emit('update')
  $q.notify({ message: 'Collection vidée avec succès', position: 'bottom-left' })
  loading.vider = false
}
function rename() {
  $q.dialog({
    title: "Renommer une collection",
    prompt: {
      label: "Entrez le nouveau nom",
      model: new_name,
      dense: false
    },
  })
    .onOk((data) => {
      renommer()
    })
}
function replace() {
  $q.dialog({
    title: "Remplacer le contenu d'une collection",
    prompt: {
      label: "Choisissez le fichier ( JSON )",
      model: new_file,
      dense: false,
      type: 'file',
      accept: [".json"]

    },
  })
    .onOk((data) => {
      console.log(new_file.value)
      remplacer(new_file.value[0].path)
    })
}
function imprt() {
  $q.dialog({
    title: "Importer depuis un fichier JSON",
    prompt: {
      label: "Choisissez le fichier ( JSON )",
      model: new_file,
      dense: false,
      type: 'file',
      accept: [".json"]
    },
  })
    .onOk((data) => {
      importer(new_file.value[0].path)
    })
}
function exprt() {
  $q.dialog({
    title: "Importer depuis un fichier JSON",
    prompt: {
      label: "Entrez le nom du fichier .json",
      model: new_name,
      dense: false,
    },
  })
    .onOk((data) => {
      exporter(new_name.value.trim().toLowerCase() + '.json')
    })
}
async function renommer() {
  loading.renommer = true
  await db_manager.renommer(route.params.db, props.collection.name, new_name.value)
  emit('update')
  $q.notify({ message: 'Collection renommée avec succès', position: 'bottom-left' })
  loading.renommer = false
}
async function supprimer() {
  loading.supprimer = true
  await db_manager.supprimer(route.params.db, props.collection.name)
  emit('update')
  $q.notify({ message: 'Collection supprimée avec succès', position: 'bottom-left' })
  loading.supprimer = false
}
async function remplacer(file_path) {
  loading.remplacer = true
  const rpt = await db_manager.remplacer({ db_name: route.params.db, col_name: props.collection.name, file_path, type: 'col' })
  emit('update')
  $q.notify({ message: 'Collection remplacée avec succès', position: 'bottom-left' })
  loading.remplacer = false
}
async function exporter(file_path) {
  loading.exporter = true
  await db_manager.exporter({ db_name: route.params.db, col_name: props.collection.name, file_path, type: 'col' })
  $q.notify({ message: 'Collection exportée avec succès', position: 'bottom-left' })
  loading.exporter = false
}
async function importer(file_path) {
  loading.importer = true
  await db_manager.importer({ db_name: route.params.db, col_name: props.collection.name, file_path, type: 'col' })
  emit('update')
  $q.notify({ message: 'Donnée importée avec succès', position: 'bottom-left' })
  loading.importer = false
}

</script>
