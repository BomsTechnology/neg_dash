<script setup>
import { onMounted } from "vue";
import useUsers from "@/composables/useUser";

const props = defineProps({
  id: String,
});
const { loading, user, getUser, errors, updateUser, cleanErrors } = useUsers();

onMounted(async () => {
  await getUser(props.id);
});

const saveUser = async () => {
  await updateUser(props.id);
};
</script>

<template>
  <div class="p-8 h-full">
    <h1 class="font-bold text-3xl">Edit User</h1>
    <div class="mt-10 lg:p-10 p-4 bg-white">
      <Error :errors="errors" @cleanErrors="cleanErrors" />
      <form @submit.prevent="saveUser()">
        <div>
          <label
            for="question"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Question</label
          >
          <input
            type="text"
            id="question"
            v-model="user.question"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="How to ...?"
            required
          />
        </div>
        <div class="mt-4">
          <label
            for="question"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Response</label
          >

          <textarea
            id="response"
            v-model="user.response"
            rows="4"
            class="p-4 w-full text-sm text-gray-900 rounded bg-white border border-gray-300"
            placeholder="Write a response..."
            required
          ></textarea>

          <div class="flex justify-end items-center py-2 px-3 border-t">
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
