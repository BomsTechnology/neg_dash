<script setup>
import {
  CollectionIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ClipboardListIcon,
  QuestionMarkCircleIcon,
  ChevronUpIcon,
  ChatAlt2Icon,
  StarIcon,
  HomeIcon,
  ViewGridIcon,
  UserCircleIcon,
  MenuAlt2Icon,
} from "@heroicons/vue/solid";
import { CogIcon, LogoutIcon } from "@heroicons/vue/outline";
import { reactive } from "vue";
import { useUserStore } from "@/stores/userStore.js";
import { useRouter } from "vue-router";
const router = useRouter();
const open = reactive({
  menu: true,
  car: false,
});
const userStore = useUserStore();
const logOut = () => {
  userStore.logOut();
  router.push({
    name: "login",
  });
};
</script>

<template>
  <div class="relative h-screen">
    <transition
      enter-active-class="transition duration-1000 "
      enter-from-class="-translate-x-full"
      enter-to-class=" translate-x-0"
      leave-active-class="transition duration-1000 absolute ease-out"
      leave-from-class=" translate-x-0"
      leave-to-class=" -translate-x-full "
    >
      <div
        v-if="open.menu"
        class="flex flex-col w-64 h-screen overflow-y-auto overflow-x-hidden py-8 bg-white border-r"
      >
        <h2 class="text-2xl font-semibold text-center text-gray-800">
          Neg Auto Services
        </h2>

        <div class="flex flex-col items-center mt-6 -mx-2">
          <img
            class="object-cover w-24 h-24 mx-2 rounded-full"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            alt="avatar"
          />
          <h4 class="mx-2 mt-2 font-medium text-gray-800 hover:underline">
            John Doe
          </h4>
          <p
            class="mx-2 mt-2 text-sm font-medium text-gray-600 hover:underline"
          >
            john@example.com
          </p>
          <div class="flex items-center mx-2 mt-2 space-x-4">
            <a
              href="#"
              title="setting account"
              class="text-gray-500 p-2 hover:bg-gray-50 rounded-full"
              ><CogIcon class="w-6 h-6" /></a
            ><button
              type="button"
              @click="logOut()"
              title="logout"
              class="text-gray-500 p-2 hover:bg-gray-50 rounded-full"
            >
              <LogoutIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <a
              class="flex items-center px-4 py-2 text-gray-700 bg-gray-200"
              href="#"
            >
              <HomeIcon class="w-5 h-5" />
              <span class="mx-4 font-medium">Dashboard</span>
            </a>
            <div>
              <a
                @click="open.car = !open.car"
                class="flex justify-between items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
                href="#"
              >
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M494.26 276.22c-3.6-40.41-9.53-48.28-11.77-51.24-5.15-6.84-13.39-11.31-22.11-16a3.6 3.6 0 01-.91-5.68 15.93 15.93 0 004.53-12.53A16.27 16.27 0 00447.65 176h-15.6a17 17 0 00-2 .13 8.5 8.5 0 00-1.41-.47c-9.24-19.53-21.89-46.27-48.11-59.32C341.64 97 270 96 256 96s-85.64 1-124.48 20.31c-26.22 13.05-38.87 39.79-48.11 59.32l-.08.16a6.52 6.52 0 00-1.35.34 17 17 0 00-2-.13H64.35A16.27 16.27 0 0048 190.77a15.93 15.93 0 004.59 12.47 3.6 3.6 0 01-.91 5.68c-8.72 4.72-17 9.19-22.11 16-2.24 3-8.16 10.83-11.77 51.24-2 22.74-2.3 46.28-.73 61.44 3.29 31.5 9.46 50.54 9.72 51.33a16 16 0 0013.2 10.87v.2a16 16 0 0016 16h56a16 16 0 0016-16c8.61 0 14.6-1.54 20.95-3.18a158.83 158.83 0 0128-4.91C207.45 389 237.79 388 256 388c17.84 0 49.52 1 80.08 3.91a159.16 159.16 0 0128.11 4.93c6.08 1.56 11.85 3 19.84 3.15a16 16 0 0016 16h56a16 16 0 0016-16v-.12A16 16 0 00485.27 389c.26-.79 6.43-19.83 9.72-51.33 1.57-15.17 1.29-38.67-.73-61.45zm-381.93-86.91c8-17 17.15-36.24 33.44-44.35 23.54-11.72 72.33-17 110.23-17s86.69 5.24 110.23 17c16.29 8.11 25.4 27.36 33.44 44.35l1 2.17a8 8 0 01-7.44 11.42C360 202 290 199.12 256 199.12s-104 2.95-137.28 3.85a8 8 0 01-7.44-11.42c.35-.74.72-1.49 1.05-2.24zm11.93 79.63A427.17 427.17 0 0172.42 272c-10.6 0-21.53-3-23.56-12.44-1.39-6.35-1.24-9.92-.49-13.51C49 243 50 240.78 55 240c13-2 20.27.51 41.55 6.78 14.11 4.15 24.29 9.68 30.09 14.06 2.91 2.16 1.36 7.8-2.38 8.1zm221.38 82c-13.16 1.5-39.48.95-89.34.95s-76.17.55-89.33-.95c-13.58-1.51-30.89-14.35-19.07-25.79 7.87-7.54 26.23-13.18 50.68-16.35s34.8-4.8 57.62-4.8 32.12 1 57.62 4.81 44.77 9.52 50.68 16.35c10.78 12.24-5.29 24.19-18.86 25.84zm117.5-91.39c-2 9.48-13 12.44-23.56 12.44a455.91 455.91 0 01-52.84-3.06c-3.06-.29-4.48-5.66-1.38-8.1 5.71-4.49 16-9.91 30.09-14.06 21.28-6.27 33.55-8.78 44.09-6.69 2.57.51 3.93 3.27 4.09 5a40.64 40.64 0 01-.49 14.48z"
                    />
                  </svg>

                  <span class="mx-4 font-medium">Cars</span>
                </div>

                <ChevronDownIcon v-if="!open.car" class="w-5 h-5" />
                <ChevronUpIcon v-if="open.car" class="w-5 h-5" />
              </a>
              <transition
                enter-active-class="transition duration-500"
                enter-from-class="-translate-y-20"
                enter-to-class=" translate-y-0"
                leave-active-class="transition duration-500 ease-out"
                leave-from-class=" translate-y-0"
                leave-to-class=" -translate-y-20 opacity-0"
                mode="out-in"
              >
                <div v-if="open.car" class="mx-4 rounded-lg my-5 bg-gray-50">
                  <a
                    class="flex items-center px-4 py-2 rounded-t-lg text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
                    href="#"
                  >
                    <ViewGridIcon class="w-5 h-5" />

                    <span class="mx-4 font-medium">All Cars</span>
                  </a>
                  <a
                    class="flex items-center px-4 py-2 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
                    href="#"
                  >
                    <CollectionIcon class="w-5 h-5" />

                    <span class="mx-4 font-medium">Categories</span>
                  </a>
                  <a
                    class="flex items-center px-4 py-2 rounded-b-lg text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
                    href="#"
                  >
                    <StarIcon class="w-5 h-5" />

                    <span class="mx-4 font-medium">Brands</span>
                  </a>
                </div>
              </transition>
            </div>

            <a
              class="flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <UserGroupIcon class="w-5 h-5" />

              <span class="mx-4 font-medium">Users</span>
            </a>

            <a
              class="flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <ClipboardListIcon class="w-5 h-5" />

              <span class="mx-4 font-medium">Reservations</span>
            </a>

            <a
              class="flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <QuestionMarkCircleIcon class="w-5 h-5" />

              <span class="mx-4 font-medium">Faqs</span>
            </a>

            <a
              class="flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <ChatAlt2Icon class="w-5 h-5" />

              <span class="mx-4 font-medium">Chat Assistance</span>
            </a>
          </nav>
        </div>
      </div>
    </transition>
    <button
      @click="open.menu = !open.menu"
      class="bg-white lg:hidden block p-2 text-gray-500 -right-10 rounded-r-lg absolute top-0"
    >
      <MenuAlt2Icon class="w-7 h-7" />
    </button>
  </div>
</template>
