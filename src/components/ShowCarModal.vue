<script setup>
import { XIcon } from "@heroicons/vue/solid";
const props = defineProps({
  show: Boolean,
  data: Object,
});
const emit = defineEmits(["cancel"]);
</script>

<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    v-if="props.show"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed lg:ml-64 lg:mx-0 mx-4 inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-5xl"
        >
          <div class="bg-white">
            <div class="flex flex-col sm:flex-row h-full">
              <div class="bg-white p-10 sm:w-[65%] sm:h-full h-[30%]">
                <div class="w-full h-full">
                  <img
                    :src="props.data.image"
                    class="object-cover w-full h-full"
                    :alt="props.data.name"
                  />
                </div>
              </div>
              <div class="bg-gray-50 grow p-4 overflow-y-auto">
                <div class="flex justify-end">
                  <button
                    type="button"
                    @click="emit('cancel')"
                    class="p-2 rounded-full hover:bg-white"
                  >
                    <XIcon class="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <h1 class="text-center text-gray-900 font-bold text-2xl">
                  Details
                </h1>
                <div class="my-2 space-y-2">
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Name :</span>
                    {{ props.data.name }}
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Price :</span>
                    {{ props.data.price }} XFA
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Caution :</span>
                    {{ props.data.caution }} XFA
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Full Fuel Price :</span>
                    {{ props.data.fuelFullPrice }} XFA
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">State : </span>
                    <span
                      v-if="props.data.state == 1"
                      class="bg-blue-500 text-white rounded-full py-1 px-2"
                    >
                      enabled
                    </span>
                    <span
                      v-if="props.data.state != 1"
                      class="bg-amber-500 text-white rounded-full p-1"
                    >
                      disabled
                    </span>
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Brand :</span>
                    {{ props.data.brand.name }}
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Category :</span>
                    {{ props.data.category.name }}
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Features :</span>
                    <span class="px-4 block">
                      <span
                        class="block"
                        v-for="(feature, index) in props.data.features"
                      >
                        {{ index }} : {{ feature }}
                      </span>
                    </span>
                  </h2>
                  <h2 class="text-lg text-gray-700">
                    <span class="font-semibold">Description :</span>
                    <span class="block px-4">
                      {{ props.data.description }}
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
