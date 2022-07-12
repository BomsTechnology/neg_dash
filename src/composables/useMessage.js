import { useRouter } from "vue-router";
import { ref } from "vue";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { createConfirmDialog } from "vuejs-confirm-dialog";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
export default function useMessages() {
  const router = useRouter();
  const errors = ref("");
  const userColRef = collection(db, "users");
  const loading = ref(0);
  const message = ref([]);
  const messages = ref([]);
  const deleteArray = ref([]);
  const chks = ref([]);
  const chkAll = ref(false);
  const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
    question:
      "Are you sure you want to delete its item(s)? All data will be permanently deleted. This action cannot be undone.",
  });

  const getMessages = async (id) => {
    loading.value = 1;

    const messagesCol = collection(db, "users", id, "messages");
    const q = query(messagesCol, orderBy("date", "asc"));
    await onSnapshot(q, (querySnapshot) => {
      messages.value = [];
      querySnapshot.forEach((doc) => {
        let message = doc.data();
        message.id = doc.id;
        messages.value.push(message);
      });
    });

    loading.value = 0;
  };

  const createMessage = async (message, id) => {
    loading.value = 1;
    errors.value = "";
    const messagesCol = collection(db, "users", id, "messages");
    await addDoc(messagesCol, message).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });
    loading.value = 0;
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

  const deleteMessage = async () => {
    if (deleteArray.value.length != []) {
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          await deleteDoc(doc(db, "messages", deleteArray.value[index])).catch(
            (err) => {
              errors.value = err.message;
            }
          );
        }
        getMessages();
      });
    }
    return;
  };

  const getMessage = async (id) => {
    loading.value = 1;
    const ref = doc(db, "messages", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      message.value = docSnap.data();
    } else {
      errors.value = "No such document!";
    }
    loading.value = 0;
  };

  const updateMessage = async (id) => {
    loading.value = 1;
    errors.value = "";
    const ref = doc(db, "messages", id);
    await updateDoc(ref, {
      ...message.value,
    }).catch((err) => {
      errors.value = err.message;
    });
    loading.value = 0;
    router.push({
      name: "message.index",
    });
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    updateMessage,
    getMessage,
    message,
    deleteMessage,
    toogleDeleteArray,
    checkAll,
    getMessages,
    deleteArray,
    chks,
    chkAll,
    messages,
    loading,
    errors,
    createMessage,
    cleanErrors,
  };
}
