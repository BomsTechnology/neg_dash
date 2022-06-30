import { useRouter } from "vue-router";
import { ref } from "vue";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { createConfirmDialog } from "vuejs-confirm-dialog";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
export default function useFaqs() {
  const router = useRouter();
  const errors = ref("");
  const faqColRef = collection(db, "faqs");
  const loading = ref(0);
  const faq = ref([]);
  const faqs = ref([]);
  const deleteArray = ref([]);
  const chks = ref([]);
  const chkAll = ref(false);
  const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
    question:
      "Are you sure you want to delete its item(s)? All data will be permanently deleted. This action cannot be undone.",
  });

  const getFaqs = async () => {
    loading.value = 1;
    faqs.value = [];
    const faqSnapshot = await getDocs(faqColRef).catch((err) => {
      errors.value = err.message;
    });
    faqSnapshot.forEach((doc) => {
      let faq = doc.data();
      faq.id = doc.id;
      faqs.value.push(faq);
      chks.value.push({
        id: faq.id,
        value: false,
      });
    });
    loading.value = 0;
  };

  const createFaq = async (faq) => {
    loading.value = 1;
    errors.value = "";
    await addDoc(faqColRef, faq).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });
    loading.value = 0;
    router.push({
      name: "faq.index",
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

  const deleteFaq = async () => {
    if (deleteArray.value.length != []) {
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          await deleteDoc(doc(db, "faqs", deleteArray.value[index])).catch(
            (err) => {
              errors.value = err.message;
            }
          );
        }
        getFaqs();
      });
    }
    return;
  };

  const getFaq = async (id) => {
    loading.value = 1;
    const ref = doc(db, "faqs", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      faq.value = docSnap.data();
    } else {
      errors.value = "No such document!";
    }
    loading.value = 0;
  };

  const updateFaq = async (id) => {
    loading.value = 1;
    errors.value = "";
    const ref = doc(db, "faqs", id);
    await updateDoc(ref, {
      ...faq.value,
    }).catch((err) => {
      errors.value = err.message;
    });
    loading.value = 0;
    router.push({
      name: "faq.index",
    });
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    updateFaq,
    getFaq,
    faq,
    deleteFaq,
    toogleDeleteArray,
    checkAll,
    getFaqs,
    deleteArray,
    chks,
    chkAll,
    faqs,
    loading,
    errors,
    createFaq,
    cleanErrors,
  };
}
