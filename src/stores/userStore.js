import { defineStore } from "pinia";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    currentUser: null,
    loading: 0,
    errors: "",
  }),

  actions: {
    getCurrentUser() {
      return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
          getAuth(),
          (user) => {
            removeListener();
            this.currentUser = user;
            resolve(user);
          },
          reject
        );
      });
    },
    async logOut() {
      await signOut(getAuth()).then(() => {
        console.log("Sucessful logged out ");
      });
    },

    async loginWithGoogle() {
      this.loading = 1;
      const provider = new GoogleAuthProvider();
      await signInWithPopup(getAuth(), provider)
        .then((data) => {
          console.log("Successfully Logged in");
        })
        .catch((error) => {
          console.log(error.message);
          this.errors = error.message;
          this.loading = 0;
        });
    },
  },
  getters: {},
});
