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
export default function useBrands() {
  const router = useRouter();
  const errors = ref("");
  const brandColRef = collection(db, "brands");
  const loading = ref(0);
  const brand = ref([]);
  const brands = ref([]);
  const deleteArray = ref([]);
  const chks = ref([]);
  const chkAll = ref(false);
  const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
    question:
      "Are you sure you want to delete its item(s)? All data will be permanently deleted. This action cannot be undone.",
  });

  const getBrands = async () => {
    loading.value = 1;
    brands.value = [];
    const brandSnapshot = await getDocs(brandColRef).catch((err) => {
      errors.value = err.message;
    });
    brandSnapshot.forEach((doc) => {
      let brand = doc.data();
      brand.id = doc.id;
      brands.value.push(brand);
      chks.value.push({
        id: brand.id,
        value: false,
      });
    });
    loading.value = 0;
  };

  const createBrand = async (brand) => {
    loading.value = 1;
    errors.value = "";
    await addDoc(brandColRef, brand).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });
    loading.value = 0;
    router.push({
      name: "brand.index",
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

  const deleteBrand = async () => {
    if (deleteArray.value.length != []) {
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          await deleteDoc(doc(db, "brands", deleteArray.value[index])).catch(
            (err) => {
              errors.value = err.message;
            }
          );
        }
        getBrands();
      });
    }
    return;
  };

  const getBrand = async (id) => {
    loading.value = 1;
    const ref = doc(db, "brands", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      brand.value = docSnap.data();
    } else {
      errors.value = "No such document!";
    }
    loading.value = 0;
  };

  const updateBrand = async (id) => {
    loading.value = 1;
    errors.value = "";
    const ref = doc(db, "brands", id);
    await updateDoc(ref, {
      ...brand.value,
    }).catch((err) => {
      errors.value = err.message;
    });
    loading.value = 0;
    router.push({
      name: "brand.index",
    });
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    updateBrand,
    getBrand,
    brand,
    deleteBrand,
    toogleDeleteArray,
    checkAll,
    getBrands,
    deleteArray,
    chks,
    chkAll,
    brands,
    loading,
    errors,
    createBrand,
    cleanErrors,
  };
}
