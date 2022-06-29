<script setup>
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <section class="flex">
    <div>
      <router-view name="sidebar"></router-view>
    </div>

    <div class="w-full h-screen overflow-auto">
      <router-view v-slot="{ Component, route }">
        <Transition
          enter-active-class="transition duration-1000"
          enter-from-class="opacity-0 translate-y-10"
          enter-to-class="opacity-1 translate-y-0"
          leave-active-class="transition duration-500 "
          leave-from-class="opacity-1 translate-y-0"
          leave-to-class="opacity-0 -translate-y-10"
          mode="out-in"
        >
          <div :key="route.name" class="h-full">
            <component :is="Component" />
          </div>
        </Transition>
      </router-view>
    </div>
  </section>
</template>
