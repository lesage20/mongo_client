<template>
  <q-btn color="grey-7" round flat icon="more_vert">
    <q-menu cover auto-close style="width: 200px;">
      <q-list>
        <!-- <q-item @click="vider" dense clickable>
          <q-item-section avatar aside>
            <q-icon name="mdi-battery-outline" v-if="!loading.vider"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>
          <q-item-section>Vider</q-item-section>
        </q-item> -->
        <q-item dense clickable @click="add">
          <q-item-section avatar aside>
            <q-icon name="mdi-plus-circle" v-if="!loading.ajouter"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              Ajouter
            </q-item-label>
            <q-item-label caption>
              Ajouter collection
            </q-item-label>

          </q-item-section>
        </q-item>



        <q-item dense clickable @click="supprimer">
          <q-item-section avatar aside>
            <q-icon name="mdi-delete" v-if="!loading.supprimer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              Supprimer
            </q-item-label>
            <q-item-label caption>
              Supprimer la BD
            </q-item-label>

          </q-item-section>
        </q-item>
        <q-item dense clickable @click="replace">
          <q-item-section avatar aside>
            <q-icon name="mdi-file-replace" v-if="!loading.remplacer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>
            Remplacer
            <q-item-label caption>
              Remplacer la BD
            </q-item-label>

          </q-item-section>
        </q-item>
        <q-item dense clickable @click="exprt">
          <q-item-section avatar aside>
            <q-icon name="mdi-database-export" v-if="!loading.exporter"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>

          <q-item-section>
            Exporter
            <q-item-label caption>
              Exporter la BD
            </q-item-label>

          </q-item-section>
        </q-item>

        <q-item dense clickable @click="imprt">
          <q-item-section avatar aside>
            <q-icon name="mdi-database-import" v-if="!loading.importer"></q-icon>
            <q-spinner v-else></q-spinner>
          </q-item-section>
          <q-item-section>
            Importer
            <q-item-label caption>
              Importer Fichier
            </q-item-label>

          </q-item-section>
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
  db: {
    type: Object
  }
})
const emit = defineEmits(['update'])

const $q = useQuasar()
const route = useRoute()
const new_name = ref(null)
const new_file = ref(null)
const loading = reactive({ vider: false, ajouter: false, supprimer: false, remplacer: false, exporter: false, importer: false })

// actions
async function vider() {
  loading.vider = true
  await db_manager.vider(props.db.name)
  emit('update')
  $q.notify({ message: 'Collection vidée avec succès', position: 'bottom-left' })
  loading.vider = false
}
function add() {
  $q.dialog({
    title: "Ajouter une collection",
    prompt: {
      label: "Entrez le nom de la collection",
      model: new_name,
      dense: false
    },
  })
    .onOk((data) => {
      ajouter()
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
      accept: [".json"],
      webkitdirectory: true

    },
  })
    .onOk((data) => {
      let files;
      try {

        files = new Array(...new_file.value).map(el => el.path)
      }
      catch {
        files = []
      }

      remplacer(files)
    })
}
async function imprt() {

  $q.dialog({
    title: "Importer depuis un fichier JSON",
    prompt: {
      label: "Choisissez le fichier ( JSON )",
      model: new_file,
      dense: false,
      type: 'file',
      accept: [".json"],
      webkitdirectory: true
    },
  })
    .onOk(async (data) => {
      let files;
      try {

        files = new Array(...new_file.value).map(el => el.path)
      }
      catch {
        files = []
      }

      importer(files)
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
async function ajouter() {
  loading.ajouter = true
  await db_manager.ajouter(props.db.name, new_name.value)
  emit('update')
  $q.notify({ message: 'Collection ajoutée avec succès', position: 'bottom-left' })
  loading.ajouter = false
}
async function supprimer() {
  loading.supprimer = true
  await db_manager.supprimer(props.db.name)
  emit('update')
  $q.notify({ message: 'Base de Données supprimée avec succès', position: 'bottom-left' })
  loading.supprimer = false
}
async function remplacer(file_path) {
  loading.remplacer = true
  const rpt = await db_manager.remplacer({ db_name: props.db.name, file_path, type: 'db' })
  emit('update')
  $q.notify({ message: 'Base de Données remplacée avec succès', position: 'bottom-left' })
  loading.remplacer = false
}

async function exporter(file_path) {
  loading.exporter = true
  await db_manager.exporter({ db_name: props.db.name, file_path, type: 'db' })
  $q.notify({ message: 'Base de Données exportée avec succès', position: 'bottom-left' })
  loading.exporter = false
}
async function importer(file_path) {
  loading.importer = true
  await db_manager.importer({ db_name: props.db.name, file_path, type: 'db' })
  emit('update')
  $q.notify({ message: 'Donnée importée avec succès', position: 'bottom-left' })
  loading.importer = false
}

</script>
