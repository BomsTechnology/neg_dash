import { useRouter } from "vue-router";
import { ref } from "vue";
import { db } from "@/firebase";
import {
  getAuth,
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
  const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
    question:
      "Are you sure you want to delete its item(s)? All data will be permanently deleted. This action cannot be undone.",
  });

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
        value: false,
      });
    });
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
      userId: user.value.uid,
    }).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });

    updateProfile(auth.currentUser, {
      displayName: data.name,
      phoneNumber: data.phone,
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });

    loading.value = 0;
    router.push({
      name: "user.index",
    });
  };

  const toogleDeleteArray = async (index) => {
    chks.value[index].value
      ? deleteArray.value.push(chks.value[index].id)
      : deleteArray.value.splice(index, 1);
  };

  const checkAll = async () => {
    if (chkAll.value) {
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
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          await deleteDoc(doc(db, "users", deleteArray.value[index])).catch(
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
