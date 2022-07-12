import { useRouter } from "vue-router";
import { ref } from "vue";
import { db } from "@/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { createConfirmDialog } from "vuejs-confirm-dialog";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useUserStore } from "@/stores/userStore.js";
export default function useUsers() {
  const router = useRouter();
  const errors = ref("");
  const userColRef = collection(db, "users");
  const loading = ref(0);
  const user = ref([]);
  const users = ref([]);
  const deleteArray = ref([]);
  const chks = ref([]);
  const chkAll = ref(false);
  const userStore = useUserStore();
  const auth = getAuth();

  const getUsers = async () => {
    loading.value = 1;
    users.value = [];
    const userSnapshot = await getDocs(userColRef).catch((err) => {
      errors.value = err.message;
    });
    userSnapshot.forEach((doc) => {
      let user = doc.data();
      user.id = doc.id;
      users.value.push(user);
      chks.value.push({
        id: user.id,
        image: user.image,
        value: false,
      });
    });
    checkAll(false);
    loading.value = 0;
  };

  const geChatUsers = async () => {
    loading.value = 1;
    users.value = [];
    const ref = collection(db, "users");

    const q = query(ref, where("type", "!=", "admin"));
    const userSnapshot = await getDocs(q).catch((err) => {
      errors.value = err.message;
    });
    userSnapshot.forEach((doc) => {
      let user = doc.data();
      user.id = doc.id;
      users.value.push(user);
      chks.value.push({
        id: user.id,
        image: user.image,
        value: false,
      });
    });
    checkAll(false);
    loading.value = 0;
  };

  const createUser = async (data) => {
    loading.value = 1;
    errors.value = "";

    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        user.value = userCredential.user;
      })
      .catch((error) => {
        errors.value = error.message;
        return;
      });

    await addDoc(userColRef, {
      email: data.email,
      phone: data.phone,
      type: data.type,
      name: data.name,
      state: data.state,
      userId: user.value.uid,
      image: "",
    }).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });

    await updateProfile(auth.currentUser, {
      displayName: data.name,
      phoneNumber: data.phone,
    });

    loading.value = 0;
    location.href = "/";
  };

  const loginWithEmail = async (logInfo) => {
    loading.value = 1;
    await signInWithEmailAndPassword(auth, logInfo.email, logInfo.password)
      .then(async (userCredential) => {
        const logData = userCredential.user;
        await getUser(logData.uid);
        if (user.value.state == 1) {
          if (user.value.type == "admin") {
            router.push({
              name: "admin.dashboard",
            });
          } else {
            location.href = "/";
          }
          console.log("Successfully Logged in");
        } else {
          userStore.logOut();
          loading.value = 0;
          errors.value = "Your account has been blocked";
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
        if (user.value) {
          if (user.value.state == 1) {
            if (user.value.type == "admin") {
              router.push({
                name: "admin.dashboard",
              });
            } else {
              location.href = "/";
            }
            console.log("Successfully Logged in");
          } else {
            userStore.logOut();
            loading.value = 0;
            errors.value = "Your account has been blocked";
          }
        } else {
          await addDoc(userColRef, {
            email: logData.email,
            phone: logData.phoneNumber,
            type: "user",
            name: logData.displayName,
            state: 1,
            userId: logData.uid,
            image: logData.photoURL,
          }).catch((err) => {
            errors.value = err.message;
            loading.value = 0;
          });
          router.push({
            name: "home",
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        loading.value = 0;
      });
  };

  const toogleDeleteArray = async (index) => {
    chks.value[index].value
      ? deleteArray.value.push({
          id: chks.value[index].id,
          image: chks.value[index].image,
        })
      : deleteArray.value.splice(index, 1);
  };

  const checkAll = async (ch = true) => {
    if (!ch) {
      for (const item in chks.value) {
        chks.value[item].value = false;
      }
      deleteArray.value = [];
    } else if (chkAll.value) {
      for (const item in chks.value) {
        chks.value[item].value = true;
        deleteArray.value.push(chks.value[item].id);
      }
    } else {
      for (const item in chks.value) {
        chks.value[item].value = false;
      }
      deleteArray.value = [];
    }
  };

  const deleteUser = async () => {
    if (deleteArray.value.length != []) {
      const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
        question:
          "Are you sure you want to delete its item(s)? All data will be permanently deleted. This action cannot be undone.",
      });
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          await deleteDoc(doc(db, "users", deleteArray.value[index].id)).catch(
            (err) => {
              errors.value = err.message;
            }
          );
        }
        getUsers();
      });
    }
    return;
  };

  const getUser = async (id) => {
    loading.value = 1;
    user.value = null;
    const ref = collection(db, "users");

    const q = query(ref, where("userId", "==", id));
    const querySnapshot = await getDocs(q).catch((err) => {
      console.log(err.message);
      errors.value = err.message;
    });
    querySnapshot.forEach((doc) => {
      user.value = doc.data();
      user.value.id = doc.id;
    });
    loading.value = 0;
  };

  const updateUser = async (id) => {
    loading.value = 1;
    errors.value = "";
    const ref = doc(db, "users", id);
    await updateDoc(ref, {
      ...user.value,
    }).catch((err) => {
      errors.value = err.message;
    });
    loading.value = 0;
    router.push({
      name: "user.index",
    });
  };

  const enabledUser = async (id) => {
    errors.value = "";
    const ref = doc(db, "users", id);
    await updateDoc(ref, {
      state: 1,
    }).catch((err) => {
      errors.value = err.message;
    });
    getUsers();
  };

  const disableddUser = async (id) => {
    errors.value = "";
    const ref = doc(db, "users", id);
    await updateDoc(ref, {
      state: 2,
    }).catch((err) => {
      errors.value = err.message;
    });
    getUsers();
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    geChatUsers,
    loginWithEmail,
    loginWithGoogle,
    enabledUser,
    disableddUser,
    updateUser,
    getUser,
    user,
    deleteUser,
    toogleDeleteArray,
    checkAll,
    getUsers,
    deleteArray,
    chks,
    chkAll,
    users,
    loading,
    errors,
    createUser,
    cleanErrors,
  };
}
