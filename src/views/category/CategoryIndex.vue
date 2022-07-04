<script setup>
import { TrashIcon } from "@heroicons/vue/solid";
import { onMounted } from "vue";
import useCategories from "@/composables/useCategory";

const {
  loading,
  errors,
  cleanErrors,
  deleteCategory,
  toogleDeleteArray,
  checkAll,
  getCategories,
  chks,
  chkAll,
  categories,
} = useCategories();

onMounted(() => {
  getCategories();
});
</script>

<template>
  <DialogsWrapper />
  <div
    class="relative w-full p-8 h-full overflow-x-auto shadow-md sm:rounded-lg"
  >
    <div class="flex justify-between">
      <h1 class="font-bold text-4xl">Categories</h1>
      <router-link
        :to="{ name: 'category.create' }"
        class="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400"
        >Add Category</router-link
      >
    </div>
    <Error :errors="errors" @cleanErrors="cleanErrors" />
    <div class="items-center justify-between p-4 lg:flex mt-10">
      <div
        class="mt-1 items-center space-y-1 lg:flex lg:space-y-0 lg:space-x-2"
      >
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg
              class="h-5 w-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="table-search"
            class="block w-full rounded border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 lg:w-80"
            placeholder="Search for items"
          />
        </div>
      </div>
      <div class="mt-1 flex justify-end lg:mt-0 lg:block">
        <button
          type="button"
          @click="deleteCategory()"
          title="options"
          class="flex items-center justify-between space-x-2 rounded border border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <TrashIcon class="h-6 w-6" />
          <span class="hidden text-sm font-thin lg:block">Supprimer</span>
        </button>
      </div>
    </div>
    <table class="w-full text-left text-sm text-gray-500 shadow">
      <thead class="bg-gray-50 text-xs uppercase text-gray-700">
        <tr>
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                @change="checkAll()"
                v-model="chkAll"
                id="checkbox-all-search"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">Name</th>

          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading == 1">
          <th colspan="4" class="p-8">
            <div class="flex justify-center">
              <Spin
                :color="'text-indigo-500'"
                :width="'w-16'"
                :height="'h-16'"
              />
            </div>
          </th>
        </tr>
        <tr
          v-else-if="categories.length != []"
          v-for="(category, index) in categories"
          :key="category.id"
          class="border-b bg-white hover:bg-gray-50"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-search-1"
                type="checkbox"
                v-model="chks[index].value"
                @change="toogleDeleteArray(index)"
                class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label for="checkbox-table-search-1" class="sr-only"
                >checkbox</label
              >
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="h-10 w-10 overflow-hidden rounded-full">
              <img :src="category.image" :alt="category.name" />
            </div>
          </td>
          <td
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
          >
            {{
              category.name.lenght > 24
                ? category.name.substring(0, 24) + "..."
                : category.name
            }}
          </td>

          <td class="px-6 py-4 text-right">
            <router-link
              :to="{ name: 'category.edit', params: { id: category.id } }"
              class="font-medium text-blue-600 hover:underline"
              >Edit</router-link
            >
          </td>
        </tr>
        <tr v-else>
          <td
            colspan="4"
            class="whitespace-nowrap px-6 py-4 text-2xl text-center font-medium text-gray-900"
          >
            NO CATEGORY
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
