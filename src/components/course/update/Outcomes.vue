<script setup lang="ts">
import { ref } from 'vue'
import { type Co } from '@/lib/course'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MultiSelect from '@/components/multiselectwithfilter/MultiSelect.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import VerticalText from '@/components/VerticalText.vue'
import { ChevronUpIcon, ChevronDownIcon, MinusIcon, PlusIcon } from 'lucide-vue-next'

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

const bloomtaxOptions = [
  { domain: "Cognitive", levels: [
    'Remember', 'Understand', 'Apply', 'Analyze', 'Synthesize', 'Evaluate'
  ]},
  { domain: "Affective", levels: [
    'Receiving', 'Responding', 'Valuing', 'Organization', 'Characterizing by a Value'
  ]},
  { domain: "Psychomotor", levels: [
    'Imitation', 'Manipulation', 'Precision', 'Articulation', 'Naturalisation'
  ]}
]

const poOptions = [
  "Engineering Knowledge",
  "Problem Analysis",
  "Design/Development of Solutions",
  "Investigation",
  "Tool Usage",
  "The Engineer and the World",
  "Ethics",
  "Individual and Collaborative Team Work",
  "Communication",
  "Project Management and Finance",
  "Lifelong Learning"
]

const wkOptions = [
  "Natural and Social Sciences",
  "Mathematics and Computer Science",
  "Engineering Fundamentals",
  "Engineering Specialist Knowledge",
  "Engineering Design and Operations",
  "Engineering Practice",
  "Engineers in Society",
  "Research Skills",
  "Professional and Ethical Responsibility"
]

const wpOptions = [
  "Depth of Knowledge Required",
  "Range of Conflicting Requirements",
  "Depth of Analysis Required",
  "Familiarity of Issues",
  "Extent of Applicable Codes",
  "Extent of Stakeholder Involvement and Conflicting Requirements",
  "Interdependence"
]

const eaOptions = [
  "Range of Resources",
  "Level of Interactions",
  "Innovation",
  "Consequences to Society and the Environment",
  "Familiarity"
]

const truncateWithEllipsis = (text: string) => {
  let maxLength = 20;
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-semibold">CO Definition</div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead class="">#</TableHead>
          <TableHead class="">Description</TableHead>
          <TableHead class="text-center">Bloom Taxonomy</TableHead>
          <TableHead class="text-center">SDG</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(co, coIndex) in colist" :key="coIndex">
          <TableCell class="w-14 align-top text-center">
            <Button variant="destructive" @click="console.log(`Deleting reference ${coIndex}`)"><MinusIcon /></Button>
          </TableCell>
          <TableCell class="align-top">{{ coIndex + 1 }}</TableCell>
          <TableCell class="align-top">
            <Textarea :id="'desc' + coIndex" :value="co.description" />
          </TableCell>
          <TableCell class="w-0 align-top">
            <Select>
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-for="(domain, index) in bloomtaxOptions" :key="index">
                  <SelectLabel>{{ domain.domain }}</SelectLabel>
                  <SelectItem v-for="(level, levelIndex) in domain.levels" :key="levelIndex" :value="`${domain.domain[0]}${levelIndex}`">
                    {{ `${domain.domain[0]}${levelIndex} ${level}` }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell class="w-0 align-top text-center">
            <Checkbox :default-value="false" :id="`co${coIndex + 1}sdg`"/>
          </TableCell>
          <TableCell class="w-14 align-top text-center">
            <div class="flex flex-col gap-1">
              <Button
                variant="secondary"
                :disabled="coIndex === 0"
                @click="console.log(`Move up ${coIndex}`)"
              ><ChevronUpIcon /></Button>
              <Button
                variant="secondary"
                :disabled="coIndex === colist.length - 1"
                @click="console.log(`Move down ${coIndex}`)"
              ><ChevronDownIcon /></Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button variant="default"><PlusIcon /></Button>

    <div class="font-semibold">CO to Programme Outcome (PO) Mapping</div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">CO</TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(po, poIndex) in poOptions"
            :key="poIndex"
          >
            <VerticalText :label="`PO${poIndex + 1}`" :content="po" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(co, coIndex) in colist" :key="coIndex" class="text-center">
          <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
          <TableCell v-for="(po, poIndex) in poOptions" :key="poIndex">
            <Checkbox :default-value="false" :id="`co${coIndex + 1}po${poIndex + 1}`"/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="font-semibold">CO to Knowledge Profile (WK) Mapping</div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">CO</TableHead>
          <TableHead class="align-bottom text-center w-0">PO</TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(wk, wkIndex) in wkOptions"
            :key="wkIndex"
          >
            <VerticalText :label="`WK${wkIndex + 1}`" :content="wk" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(co, coIndex) in colist" :key="coIndex" class="text-center">
          <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
          <TableCell class="w-0">{{ co.pos.map(pos => `PO${pos + 1}`).join(', ') }}</TableCell>
          <TableCell v-for="(wk, wkIndex) in wkOptions" :key="wkIndex">
            <Checkbox :default-value="false" :id="`co${coIndex + 1}wk${wkIndex + 1}`"/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="font-semibold">CO to Complex Engineering Problem (WP) Mapping</div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">CO</TableHead>
          <TableHead class="align-bottom text-center w-0">PO</TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(wp, wpIndex) in wpOptions"
            :key="wpIndex"
          >
            <VerticalText :label="`WP${wpIndex + 1}`" :content="wp" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(co, coIndex) in colist" :key="coIndex" class="text-center">
          <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
          <TableCell class="w-0">{{ co.pos.map(pos => `PO${pos + 1}`).join(', ') }}</TableCell>
          <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex">
            <Checkbox :default-value="false" :id="`co${coIndex + 1}wp${wpIndex + 1}`"/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="font-semibold">CO to Complex Engineering Activities (EA) Mapping</div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">CO</TableHead>
          <TableHead class="align-bottom text-center w-0">PO</TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(ea, eaIndex) in eaOptions"
            :key="eaIndex"
          >
            <VerticalText :label="`EA${eaIndex + 1}`" :content="ea" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(co, coIndex) in colist" :key="coIndex" class="text-center">
          <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
          <TableCell class="w-0">{{ co.pos.map(pos => `PO${pos + 1}`).join(', ') }}</TableCell>
          <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex">
            <Checkbox :default-value="false" :id="`co${coIndex + 1}ea${eaIndex + 1}`"/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- <div
      v-for="(co, coIndex) in colist"
      :key="coIndex"
      class="flex flex-col gap-3"
    >
      <div class="flex flex-col gap-1 grow">
        <Label :for="'desc' + coIndex">{{ `CO${coIndex + 1}` }}</Label>
        <Textarea :id="'desc' + coIndex" :value="co.description" />
      </div>

      <div class="flex flex-row gap-3 items-center">
        <Checkbox :default-value="false" :id="`sdg${coIndex}`"/>
        <Label :for="`sdg${coIndex}`">SDG</Label>
      </div>

      <div class="flex flex-wrap gap-3">
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`po${coIndex}`">PO</Label>
          <MultiSelect
            :input-id="`po${coIndex}`"
            label="Select PO"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `PO${x}`)"
            :selected="co.pos.map((x) => `PO${x}`)"
            emptymessage="No POs"
          />
        </div>
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`wa${coIndex}`">WA</Label>
          <MultiSelect
            :input-id="`wa${coIndex}`"
            label="Select WA"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `WA${x}`)"
            :selected="co.was.map((x) => `WA${x}`)"
            emptymessage="No WAs"
          />
        </div>
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`wk${coIndex}`">WK</Label>
          <MultiSelect
            :input-id="`wk${coIndex}`"
            label="Select WK"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `WK${x}`)"
            :selected="co.wks.map((x) => `WK${x}`)"
            emptymessage="No WKs"
          />
        </div>
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
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

      <div class="flex flex-wrap gap-1">
        <Button variant="outline" :disabled="coIndex === 0"><ChevronUpIcon /></Button>
        <Button variant="outline" :disabled="coIndex === colist.length - 1"><ChevronDownIcon /></Button>
        <div class="grow"></div>
        <Button variant="destructive"><MinusIcon /></Button>
      </div>


      <Separator class="my-5" v-if="coIndex < colist.length - 1"/>
    </div>

    <Button variant="default"><PlusIcon /></Button> -->
  </div>
</template>
