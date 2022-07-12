<script setup>
// import { TrashIcon } from "@heroicons/vue/solid";
import { onMounted, ref } from "vue";
import useReservations from "@/composables/useReservation";
import ShowReservationModal from "@/components/ShowReservationModal.vue";
// import { getDoc } from "firebase/firestore";
const {
  loading,
  expiredReservation,
  validateReservation,
  errors,
  cleanErrors,

  getReservations,

  reservations,
} = useReservations();
const show = ref(false);
const data = ref({});

const openDetail = async (reservation) => {
  data.value = reservation;
  show.value = true;
};

const closeDetail = async () => {
  show.value = false;
};

onMounted(async () => {
  await getReservations();
});
</script>

<template>
  <ShowReservationModal :show="show" :data="data" @cancel="closeDetail()" />
  <DialogsWrapper />
  <div
    class="relative w-full p-8 h-full overflow-x-auto shadow-md sm:rounded-lg"
  >
    <div class="flex justify-between">
      <h1 class="font-bold text-4xl">Reservations</h1>
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
      <!-- <div class="mt-1 flex justify-end lg:mt-0 lg:block">
        <button
          type="button"
          @click="deleteReservation()"
          title="options"
          class="flex items-center justify-between space-x-2 rounded border border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <TrashIcon class="h-6 w-6" />
          <span class="hidden text-sm font-thin lg:block">Supprimer</span>
        </button>
      </div> -->
    </div>
    <table class="w-full text-left text-sm text-gray-500 shadow">
      <thead class="bg-gray-50 text-xs uppercase text-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">state</th>
          <th scope="col" class="px-6 py-3">Price</th>
          <!-- <th scope="col" class="px-6 py-3">Caution</th> -->

          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading == 1">
          <th colspan="7" class="p-8">
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
          v-else-if="reservations.length != []"
          v-for="(reservation, index) in reservations"
          :key="reservation.id"
          class="border-b bg-white hover:bg-gray-50"
        >
          <td class="px-6 py-4">
            <div class="h-14 w-14 overflow-hidden rounded-lg">
              <img
                :src="reservation.car.image"
                class="object-cover w-full h-full"
                :alt="reservation.car.name"
              />
            </div>
          </td>
          <td
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
          >
            {{
              reservation.car.name.lenght > 24
                ? reservation.car.name.substring(0, 24) + "..."
                : reservation.car.name
            }}
          </td>

          <td class="px-6 py-4">
            <span
              v-if="reservation.state == 1"
              class="bg-amber-500 text-white text-xs rounded-full p-1"
            >
              pending
            </span>
            <span
              v-else-if="reservation.state == 2"
              class="bg-blue-500 text-white text-xs rounded-full p-1"
            >
              in service
            </span>
            <span v-else class="bg-red-500 text-white text-xs rounded-full p-1">
              expired
            </span>
          </td>

          <td
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
          >
            {{ reservation.amount + " XFA" }}
          </td>

          <!-- <td
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
          >
            {{ reservation.caution + " XFA" }}
          </td> -->

          <td class="px-6 py-4 text-right flex space-x-2 items-center">
            <button
              type="button"
              class="font-medium hover:underline"
              v-if="reservation.state <= 2"
            >
              <span
                @click="expiredReservation(reservation.id)"
                v-if="reservation.state == 2"
                class="text-red-600"
                >Expired</span
              >
              <span
                @click="validateReservation(reservation.id)"
                v-if="reservation.state == 1"
                class="text-blue-600"
                >Validate</span
              >
            </button>
            <!-- <router-link
              :to="{ name: 'reservation.edit', params: { id: reservation.id } }"
              class="font-medium text-blue-600 hover:underline"
              >Edit</router-link
            > -->
            <button
              type="button"
              class="font-medium hover:underline text-emerald-600"
              @click="openDetail(reservation)"
            >
              view
            </button>
          </td>
        </tr>
        <tr v-else>
          <td
            colspan="7"
            class="whitespace-nowrap px-6 py-4 text-2xl text-center font-medium text-gray-900"
          >
            NO CAR
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
