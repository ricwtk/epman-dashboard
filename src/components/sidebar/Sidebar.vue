<script setup lang="ts">
import { useSidebarStatusStore } from '@/stores/sidebarstatus';
const { sidebarstatus, toggleSidebarCollapse, toggleSidebarText } = useSidebarStatusStore();
import SidebarItem from './SidebarItem.vue';
import {
  HomeIcon,
  InfoIcon,
  ChevronFirst,
  ChevronLast,
  UserIcon,
  ChartColumnStackedIcon,
  LayoutDashboardIcon,
  LayersIcon,
  UserCogIcon
} from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';

import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="plaincard flex flex-col gap-2 w-auto"
    :class="[sidebarstatus.collapsed ? 'hidden' : 'visible']"
  >
    <SidebarItem>
      <template #icon><UserIcon /></template>
      <template #text>Email</template>
    </SidebarItem>
    <Separator />
    <SidebarItem @click="navigateTo('/')">
      <template #icon><HomeIcon /></template>
      <template #text>Home</template>
    </SidebarItem>
    <SidebarItem>
      <template #icon><LayoutDashboardIcon /></template>
      <template #text>Programmes</template>
    </SidebarItem>
    <SidebarItem>
      <template #icon><LayersIcon /></template>
      <template #text>Courses</template>
    </SidebarItem>
    <SidebarItem>
      <template #icon><ChartColumnStackedIcon /></template>
      <template #text>Students</template>
    </SidebarItem>
    <SidebarItem>
      <template #icon><UserCogIcon /></template>
      <template #text>Admin</template>
    </SidebarItem>
    <Separator />
    <SidebarItem @click="navigateTo('/about')">
      <template #icon><InfoIcon /></template>
      <template #text>Guide</template>
    </SidebarItem>
    <Separator />
    <SidebarItem @click="toggleSidebarText">
      <template #icon>
        <ChevronFirst v-if="sidebarstatus.showText" />
        <ChevronLast v-else />
      </template>
      <template #text>Minimise Sidebar</template>
    </SidebarItem>
  </div>
</template>
