<script setup>
import { reactive, ref } from "vue";
import useUsers from "@/composables/useUser";

const { loading, createUser, errors, cleanErrors } = useUsers();
const user = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  type: "customer",
});

const storeUser = async () => {
  await createUser({ ...user });
};
</script>

<template>
  <div class="p-8 h-full">
    <h1 class="font-bold text-3xl">Create User</h1>
    <div class="mt-10 lg:p-10 p-4 bg-white">
      <Error :errors="errors" @cleanErrors="cleanErrors" />
      <form @submit.prevent="storeUser()">
        <div>
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
            >Name</label
          >
          <input
            type="text"
            id="name"
            v-model="user.name"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="John Doe"
            required
          />
        </div>
        <div class="mt-4">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="user.email"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="johndoe@email.com"
            required
          />
        </div>

        <div class="mt-4">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="user.password"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div class="mt-4">
          <label
            for="phone"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Phone</label
          >
          <input
            type="text"
            id="phone"
            v-model="user.phone"
            class="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="6 75 85 63 06"
            required
          />
        </div>

        <div class="mt-4">
          <label for="type" class="block mb-2 text-sm font-medium text-gray-900"
            >Type</label
          >
          <select
            required
            v-model="user.type"
            class="form-select block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex mt-4 justify-end items-center py-2 px-3">
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
      </form>
    </div>
  </div>
</template>
