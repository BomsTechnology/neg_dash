import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    currentUser: null,
  }),

  actions: {
    getCurrentUser() {
      return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
          getAuth(),
          (user) => {
            removeListener();
            this.currentUser = user;
            // console.log(user.phoneNumber);
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
  },
  getters: {},
});
