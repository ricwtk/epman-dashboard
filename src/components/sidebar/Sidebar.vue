<script setup lang="ts">
import { useSidebarStatusStore } from '@/stores/sidebarstatus';
const { sidebarstatus, toggleSidebarCollapse, toggleSidebarText } = useSidebarStatusStore();
import SidebarItem from './SidebarItem.vue';
import {
  LandmarkIcon,
  SchoolIcon,
  HomeIcon,
  InfoIcon,
  ChevronFirst,
  ChevronLast,
  UserIcon,
  ChartColumnStackedIcon,
  LayoutDashboardIcon,
  LayersIcon,
  UserCogIcon,
  LogOutIcon
} from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';
import { navigateToPath } from '@/utils/navigationHelpers';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="card-plain flex flex-col gap-2 max-w-60"
    :class="[sidebarstatus.collapsed ? 'hidden' : 'visible']"
  >
    <template v-if="authStore.user">
      <SidebarItem @click="navigateToPath('/profile')">
        <template #icon><UserIcon /></template>
        <template #text>{{ authStore.userProfile?.name }}</template>
      </SidebarItem>
      <SidebarItem @click="authStore.logout">
        <template #icon><LogOutIcon /></template>
        <template #text>Log out</template>
      </SidebarItem>
    </template>
    <Separator />
    <SidebarItem @click="navigateToPath('/')">
      <template #icon><LandmarkIcon /></template>
      <template #text>Faculties</template>
    </SidebarItem>
    <SidebarItem @click="navigateToPath('/school')">
      <template #icon><SchoolIcon /></template>
      <template #text>Schools</template>
    </SidebarItem>
    <SidebarItem @click="navigateToPath('/programme')">
      <template #icon><LayoutDashboardIcon /></template>
      <template #text>Programmes</template>
    </SidebarItem>
    <SidebarItem @click="navigateToPath('/course')">
      <template #icon><LayersIcon /></template>
      <template #text>Courses</template>
    </SidebarItem>
    <SidebarItem>
      <template #icon><ChartColumnStackedIcon /></template>
      <template #text>Students</template>
    </SidebarItem>
    <Separator />
    <SidebarItem>
      <template #icon><UserCogIcon /></template>
      <template #text>User Admin</template>
    </SidebarItem>
    <Separator />
    <SidebarItem>
      <template #icon><InfoIcon /></template>
      <template #text>Guide</template>
    </SidebarItem>
    <SidebarItem @click="toggleSidebarText">
      <template #icon>
        <ChevronFirst v-if="sidebarstatus.showText" />
        <ChevronLast v-else />
      </template>
      <template #text>Minimise Sidebar</template>
    </SidebarItem>
  </div>
</template>
