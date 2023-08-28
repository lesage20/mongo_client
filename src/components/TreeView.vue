<template>
  <q-item class="q-my-none q-py-none" dense v-if="['string', 'number', 'boolean'].includes(getType(val))">
    <q-item-section>
      <q-item-label>
        <b class="text-grey-8"> {{ cle }} </b> : <span
          :class="{ 'text-blue-10': getType(val) != 'string', 'text-teal-7': getType(val) == 'string' }">{{
            val
          }}</span>
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item class="q-my-none q-py-none" dense v-if="[null, undefined, 'date'].includes(getType(val))">
    <q-item-section>
      <q-item-label>
        <b class="text-grey-8"> {{ cle }} </b> : <span
          :class="{ 'text-blue-10': getType(val) == 'date', 'text-grey-7': getType(val) == null }">
          {{ getType(val) == 'date' ? new Date(val).toLocaleDateString('fr') : 'null' }}
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item dense-toggle class="q-my-none q-py-none" expand-icon-class="q-mx-none q-px-none w-auto text-left"
    dense v-else-if="['object', 'array'].includes(getType(val))" :label="cle + ' : ' + getType(val)" switch-toggle-side
    style="margin-left: -55px !important;">
    <template #header>
      <q-item dense class="q-pl-none">
        <q-item-section class="q-pl-none">
          <q-item-label>
            <b class="text-grey-8"> {{ cle }} </b>: <span class="text-grey-7"> {{ getType(val) }}</span>

          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <q-card class="q-ml-xl bg-transparent" style="margin-left: 80px">
      <template v-if="getType(val) == 'object'">
        <tree-view :cle="k" :val="i" v-for="(i, k) in val" :key="k">
        </tree-view>
      </template>
      <template v-else>
        <div class="q-my-none q-py-none" v-for="(item, index) in val" :key="index">
          <template v-if="(getType(item) == 'object')">
            <!-- <b class="text-grey-8"> {{ index }} </b>: -->
            <tree-view :cle="index" :val="item" :key="k">
            </tree-view>
          </template>
          <span v-else>
            {{ index }} : <span
              :class="{ 'text-blue-10': getType(item) == 'number', 'text-teal-7': getType(item) == 'string' }">{{ item
              }}</span>
          </span>
        </div>
      </template>
    </q-card>
  </q-expansion-item>
</template>

<script setup>


const props = defineProps({
  val: null,
  cle: String
})

const getType = (value) => {
  if ([null, undefined].includes(value)) return null
  if (typeof value == 'object') {
    const d = new Date(value).toLocaleDateString()
    if (d != 'Invalid Date') return 'date'
    if (Array.isArray(value)) return 'array'
  }
  return typeof value
}
function generateObject(key, val) {
  const obj = {}
  obj[key] = val
  return obj
}

</script>

<style></style>
