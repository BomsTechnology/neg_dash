<script setup>
import { onMounted, reactive, ref } from "vue";
import useCars from "@/composables/useCar";
import useBrands from "@/composables/useBrand";

import useCategories from "@/composables/useCategory";

const { getCategories, categories } = useCategories();
const { getBrands, brands } = useBrands();
const { loading, createCar, errors, cleanErrors } = useCars();
const car = reactive({
  name: "",
  image: "",
  brand: "",
  category: "",
  caution: "",
  description: "",
  features: {
    airConditionner: true,
    color: "",
    geatBox: "automatique",
    nbDoor: "",
    nbPlaces: "",
    power: "",
  },
  fuelFullPrice: "",
  price: "",
  state: 1,
});

onMounted(async () => {
  await getBrands();
  await getCategories();
});

const storeCar = async () => {
  await createCar({ ...car });
};

const file = ref(null);
const handelImage = () => {
  car.image = file.value.files[0];
};
</script>
<template>
  <div class="p-8 h-full">
    <h1 class="font-bold text-3xl">Create Car</h1>

    <div class="mt-10">
      <Error :errors="errors" @cleanErrors="cleanErrors" />
      <form @submit.prevent="storeCar()">
        <div class="shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6">
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  >Car Name</label
                >
                <input
                  type="text"
                  v-model="car.name"
                  id="name"
                  autocomplete="given-name"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="brand"
                  class="block text-sm font-medium text-gray-700"
                  >Brand</label
                >
                <select
                  id="brand"
                  v-model="car.brand"
                  autocomplete="brand-name"
                  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option
                    v-for="brand in brands"
                    :key="brand.id"
                    :value="brand"
                  >
                    {{ brand.name }}
                  </option>
                </select>
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="category"
                  class="block text-sm font-medium text-gray-700"
                  >Category</label
                >
                <select
                  id="category"
                  v-model="car.category"
                  autocomplete="category"
                  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="price"
                  class="block text-sm font-medium text-gray-700"
                  >Car Price</label
                >
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span
                    class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    XFA
                  </span>
                  <input
                    type="number"
                    v-model="car.price"
                    id="price"
                    autocomplete="price"
                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="fuelFullPrice"
                  class="block text-sm font-medium text-gray-700"
                  >Fuel Full Price</label
                >
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span
                    class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    XFA
                  </span>
                  <input
                    type="number"
                    v-model="car.fuelFullPrice"
                    id="fuelFullPrice"
                    autocomplete="fuelFullPrice"
                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div class="col-span-6">
                <label
                  for="caution"
                  class="block text-sm font-medium text-gray-700"
                  >Caution</label
                >
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span
                    class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    XFA
                  </span>
                  <input
                    type="number"
                    v-model="car.caution"
                    id="caution"
                    autocomplete="caution"
                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  for="airConditionner"
                  class="block text-sm font-medium text-gray-700"
                  >Air Conditioner</label
                >
                <select
                  id="airConditionner"
                  v-model="car.features.airConditionner"
                  autocomplete="airConditionner"
                  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  for="color"
                  class="block text-sm font-medium text-gray-700"
                  >Color</label
                >
                <input
                  type="text"
                  v-model="car.features.color"
                  id="color"
                  autocomplete="color"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  for="geatBox"
                  class="block text-sm font-medium text-gray-700"
                  >GeatBox</label
                >
                <select
                  id="geatBox"
                  v-model="car.features.geatBox"
                  autocomplete="geatBox"
                  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="automatique">Automatique</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  for="nbDoor"
                  class="block text-sm font-medium text-gray-700"
                  >Door Number</label
                >
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span
                    class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    Door(s)
                  </span>
                  <input
                    type="number"
                    v-model="car.features.nbDoor"
                    id="nbDoor"
                    autocomplete="nbDoor"
                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  for="nbPlaces"
                  class="block text-sm font-medium text-gray-700"
                  >Place Number</label
                >
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span
                    class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    Place(s)
                  </span>
                  <input
                    type="number"
                    v-model="car.features.nbPlaces"
                    id="nbPlaces"
                    autocomplete="nbPlaces"
                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  for="power"
                  class="block text-sm font-medium text-gray-700"
                  >Power</label
                >
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span
                    class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    Place(s)
                  </span>
                  <input
                    type="number"
                    v-model="car.features.power"
                    id="power"
                    autocomplete="power"
                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div class="col-span-6">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900"
                  for="file_input"
                  >Upload file</label
                >
                <input
                  ref="file"
                  @change="handelImage()"
                  required
                  class="block w-full text-sm text-gray-900 p-2 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  id="file_input"
                  type="file"
                />
              </div>

              <div class="col-span-6">
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div class="mt-1">
                  <textarea
                    id="description"
                    v-model.trim="car.description"
                    rows="3"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Brief description for this car.
                </p>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

    <div class="hidden sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>
  </div>
</template>
