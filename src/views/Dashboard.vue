<script setup>
import { onMounted, ref } from "vue";
</script>

<template>
  <div class="p-8 h-full">
    <h1 class="font-bold text-3xl">DashBoard</h1>
    <div class="flex h-full flex-col space-y-4">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        <div class="p-4 bg-white rounded-lg h-36 shadow"></div>
        <div class="p-4 bg-white rounded-lg h-36 shadow"></div>
        <div class="p-4 bg-white rounded-lg h-36 shadow"></div>
        <div class="p-4 bg-white rounded-lg h-36 shadow"></div>
      </div>
      <div class="lg:flex grow lg:space-x-8 lg:space-y-0 space-y-8 py-8">
        <div
          class="bg-white w-full h-full overflow-auto rounded-lg shadow"
        ></div>
        <div
          class="bg-white w-full h-full overflow-auto rounded-lg shadow"
        ></div>
      </div>
    </div>
  </div>
</template>
