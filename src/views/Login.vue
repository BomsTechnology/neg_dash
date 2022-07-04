<script setup>
import { LockClosedIcon } from "@heroicons/vue/solid";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUserStore } from "@/stores/userStore.js";
import { onMounted, reactive, ref } from "vue";
import useUsers from "@/composables/useUser";
import { useRouter } from "vue-router";
const { user, getUser } = useUsers();
const auth = getAuth();
const loading = ref(0);
const errors = ref("");
const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  if (await userStore.getCurrentUser()) {
    router.push({
      name: "dashboard",
    });
  }
});

const logInfo = reactive({
  email: "",
  password: "",
});

const cleanErrors = () => {
  errors.value = "";
};

const loginWithEmail = async () => {
  loading.value = 1;
  await signInWithEmailAndPassword(auth, logInfo.email, logInfo.password)
    .then(async (userCredential) => {
      const logData = userCredential.user;
      await getUser(logData.uid);
      if (user.value.type == "admin" && user.value.state == 1) {
        console.log("Successfully Logged in");
        router.push({
          name: "dashboard",
        });
      } else {
        userStore.logOut();
        loading.value = 0;
        errors.value = "Access denied";
      }
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          errors.value = "Invalid Email";
          break;
        case "auth/user-not-found":
          errors.value = "No account with that email was found";
          break;
        case "auth/wrong-password":
          errors.value = "Incorrect password";
          break;
        default:
          errors.value = "Email or password was incorrect";
          break;
      }

      loading.value = 0;
    });
};

const loginWithGoogle = async () => {
  loading.value = 1;
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider)
    .then(async (userCredential) => {
      const logData = userCredential.user;
      await getUser(logData.uid);
      if (user.value.type == "admin" && user.value.state == 1) {
        console.log("Successfully Logged in");
        router.push({
          name: "dashboard",
        });
      } else {
        userStore.logOut();
        loading.value = 0;
        errors.value = "Access denied";
      }
    })
    .catch((error) => {
      console.log(error.message);
      loading.value = 0;
    });
};
</script>

<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Neg Auto Services
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Welcome Back ! Login to acces admin panel
        </p>
      </div>
      <button
        type="button"
        @click="loginWithGoogle()"
        class="flex w-full items-center bg-white justify-center mt-4 text-gray-600 transition-colors duration-200 transform border rounded-lg"
      >
        <div class="px-4 py-2">
          <svg class="w-6 h-6" viewBox="0 0 40 40">
            <path
              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
              fill="#FFC107"
            />
            <path
              d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
              fill="#FF3D00"
            />
            <path
              d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
              fill="#4CAF50"
            />
            <path
              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
              fill="#1976D2"
            />
          </svg>
        </div>

        <span class="px-4 py-2 font-bold text-center">Sign in with Google</span>
      </button>

      <div class="flex items-center justify-between mt-4">
        <span class="w-1/5 border-b lg:w-1/4"></span>

        <span class="text-xs text-center text-gray-500 uppercase"
          >or login with email</span
        >

        <span class="w-1/5 border-b lg:w-1/4"></span>
      </div>
      <Error :errors="errors" @cleanErrors="cleanErrors" />
      <form class="mt-8 space-y-6" @submit.prevent="loginWithEmail()">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              type="email"
              autocomplete="email"
              required
              v-model="logInfo.email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              type="password"
              autocomplete="current-password"
              required
              v-model="logInfo.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span
              v-if="loading == 1"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <Spin />
            </span>
            <span
              v-else
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <LockClosedIcon
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>

            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
