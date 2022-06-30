<script setup>
import { onMounted, ref } from "vue";
import useCategories from "@/composables/useCategory";
const props = defineProps({
  id: String,
});
const { loading, updateCategory, getCategory, category, errors, cleanErrors } =
  useCategories();

onMounted(async () => {
  await getCategory(props.id);
});

const saveCategory = async () => {
  await updateCategory(props.id);
};

const file = ref(null);
const handelImage = () => {
  category.value.newImage = file.value.files[0];
};
</script>

<template>
  <div class="p-8 h-full">
    <h1 class="font-bold text-3xl">Edit Category</h1>
    <div class="mt-10 lg:p-10 p-4 bg-white">
      <Error :errors="errors" @cleanErrors="cleanErrors" />
      <form @submit.prevent="saveCategory()">
        <div>
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
            >Name</label
          >
          <input
            type="text"
            id="name"
            v-model="category.name"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Suv"
            required
          />
        </div>
        <div class="mt-4">
          <label
            class="block mb-2 text-sm font-medium text-gray-900"
            for="file_input"
            >Upload file</label
          >
          <input
            ref="file"
            @change="handelImage()"
            class="block w-full text-sm text-gray-900 p-2 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            id="file_input"
            type="file"
          />

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
