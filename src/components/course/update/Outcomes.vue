<script setup lang="ts">
import { ref } from 'vue'
import { type Co } from '@/lib/course'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MultiSelect from '@/components/multiselectwithfilter/MultiSelect.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const colist = ref<Co[]>([{
  description: 'Outcome 1',
  bloomtax: ['c', 1],
  pos: [1],
  was: [1,2,4],
  wks: [2,3],
  wps: [5,6],
  eas: [],
  sdg: false
},{
  description: 'Outcome 2',
  bloomtax: ['c', 6],
  pos: [1],
  was: [1,2,4],
  wks: [2,3],
  wps: [],
  eas: [3],
  sdg: false
}])
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(co, coIndex) in colist"
      :key="coIndex"
      class="flex flex-col gap-3"
    >
      <div class="flex flex-col gap-1 grow">
        <Label :for="'desc' + coIndex">{{ `CO${coIndex + 1}` }}</Label>
        <Textarea :id="'desc' + coIndex" :value="co.description" />
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="flex flex-col gap-1 grow min-w-75">
          <Label :for="`po${coIndex}`">PO</Label>
          <MultiSelect
            :input-id="`po${coIndex}`"
            label="Select PO"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `PO${x}`)"
            :selected="co.pos.map((x) => `PO${x}`)"
            emptymessage="No POs"
          />
        </div>
        <div class="flex flex-col gap-1 grow min-w-75">
          <Label :for="`wa${coIndex}`">WA</Label>
          <MultiSelect
            :input-id="`wa${coIndex}`"
            label="Select WA"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `WA${x}`)"
            :selected="co.was.map((x) => `WA${x}`)"
            emptymessage="No WAs"
          />
        </div>
        <div class="flex flex-col gap-1 grow min-w-75">
          <Label :for="`wk${coIndex}`">WK</Label>
          <MultiSelect
            :input-id="`wk${coIndex}`"
            label="Select WK"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `WK${x}`)"
            :selected="co.wks.map((x) => `WK${x}`)"
            emptymessage="No WKs"
          />
        </div>
        <div class="flex flex-col gap-1 grow min-w-75">
          <Label :for="`ea${coIndex}`">EA</Label>
          <MultiSelect
            :input-id="`ea${coIndex}`"
            label="Select EA"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `EA${x}`)"
            :selected="co.eas.map((x) => `EA${x}`)"
            emptymessage="No EAs"
          />
        </div>
      </div>

      <div class="flex flex-row gap-3 items-center">
        <Checkbox :default-value="false" :id="`sdg${coIndex}`"/>
        <Label :for="`sdg${coIndex}`">SDG</Label>
      </div>

      <div class="flex flex-wrap gap-1">
        <Button variant="outline" :disabled="coIndex === 0">Move Up</Button>
        <Button variant="outline" :disabled="coIndex === colist.length - 1">Move Down</Button>
        <div class="grow"></div>
        <Button variant="destructive">Delete</Button>
      </div>


      <Separator class="my-5" v-if="coIndex < colist.length - 1"/>
    </div>
  </div>
</template>
