<script setup>
import { reactive, ref } from "vue";
import useBrands from "@/composables/useBrand";

const { loading, createBrand, errors, cleanErrors } = useBrands();
const brand = reactive({
  name: "",
});

const storeBrand = async () => {
  await createBrand({ ...brand });
};
</script>

<template>
  <div class="p-8 h-full">
    <h1 class="font-bold text-3xl">Create Brand</h1>
    <div class="mt-10 lg:p-10 p-4 bg-white">
      <Error :errors="errors" @cleanErrors="cleanErrors" />
      <form @submit.prevent="storeBrand()">
        <div>
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
            >Name</label
          >
          <input
            type="text"
            id="name"
            v-model="brand.name"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Mercedes"
            required
          />
        </div>
        <div class="mt-4">
          <div class="flex justify-end items-center py-2 px-3">
            <button
              type="submit"
              class="inline-flex items-center py-2.5 px-4 font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
            >
              <span v-if="loading == 1">
                <Spin />
              </span>
              <span v-else>Save</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
