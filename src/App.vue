<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-vue-next';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import { useSidebarStatusStore } from '@/stores/sidebarstatus';

const { toggleSidebarCollapse } = useSidebarStatusStore();

</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="">
      <div class="plaincard flex flex-row items-center gap-2">
        <Button size="icon" variant="ghost" @click="toggleSidebarCollapse">
          <MenuIcon />
        </Button>
        <div class="font-bold">
          Engineering Programme Management
        </div>
      </div>
    </header>

    <div class="flex flex-row grow overflow-hidden">
      <!-- <div class="w-[250px] shrink-0"> -->
      <div>
        <!-- <aside class="m-2 border border-border rounded-md p-2"> -->
        <Sidebar />
        <!-- <aside class="plaincard">
          <div class="font-bold">Menu</div>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/about">About</RouterLink></li>
          </ul>
        </aside> -->
      </div>

      <main class="overflow-auto grow">
        <!-- <main class="m-2 border border-border rounded-md p-2"> -->
        <RouterView />
        <RouterView />
        <!-- </main> -->
      </main>
    </div>
  </div>
</template>

<style scoped>
/*header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}*/
</style>
