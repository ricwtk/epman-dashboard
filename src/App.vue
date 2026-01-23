<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-vue-next';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import { useSidebarStatusStore } from '@/stores/sidebarstatus';

const { toggleSidebarCollapse } = useSidebarStatusStore();

</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="">
      <div class="card-plain flex flex-row items-center gap-2 mb-0">
        <Button size="icon" variant="ghost" @click="toggleSidebarCollapse">
          <MenuIcon />
        </Button>
        <div class="font-bold">
          Engineering Programme Management
        </div>
      </div>
    </header>

    <div class="flex flex-row grow overflow-hidden">
      <aside class="overflow-auto shrink-0">
        <Sidebar class="mr-0"/>
      </aside>

      <main class="overflow-auto grow">
        <!-- <main class="m-2 border border-border rounded-md p-2"> -->
        <RouterView />
        <!-- </main> -->
      </main>
    </div>
  </div>
</template>
