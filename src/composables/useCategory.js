import { useRouter } from "vue-router";
import { ref } from "vue";
import { db, storage } from "@/firebase";
import {
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
export default function useCategories() {
  const router = useRouter();
  const errors = ref("");
  const categoryColRef = collection(db, "categories");
  const loading = ref(0);
  const category = ref([]);
  const categories = ref([]);
  const deleteArray = ref([]);
  const chks = ref([]);
  const chkAll = ref(false);
  const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
    question:
      "Are you sure you want to delete its item(s)? All data will be permanently deleted. This action cannot be undone.",
  });

  const getImage = async (path) => {
    const starsRef = refStorage(storage, path);
    let link;
    await getDownloadURL(starsRef)
      .then((url) => {
        link = url;
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            errors.value = "File doesn't exist";
            break;
          case "storage/unauthorized":
            errors.value = "User doesn't have permission to access the object";
            break;
          case "storage/canceled":
            errors.value = "ser canceled the upload";
            break;
          case "storage/unknown":
            errors.value =
              "Unknown error occurred, inspect the server response";
            break;
          default:
            errors.value = "errors to get image";
            break;
        }
      });
    return link;
  };

  const getCategories = async () => {
    loading.value = 1;
    categories.value = [];
    const categorySnapshot = await getDocs(categoryColRef).catch((err) => {
      errors.value = err.message;
    });
    categorySnapshot.forEach((doc) => {
      let category = doc.data();
      category.id = doc.id;
      categories.value.push(category);
      chks.value.push({
        id: category.id,
        value: false,
      });
    });
    loading.value = 0;
  };

  const createCategory = async (category) => {
    loading.value = 1;
    errors.value = "";
    category.image = new File(
      [category.image],
      `${new Date().getTime()}_${category.image.name}`
    );
    const storageRef = refStorage(
      storage,
      `categories_icon/${category.image.name}`
    );

    await uploadBytes(storageRef, category.image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });

    await getImage(`categories_icon/${category.image.name}`).then((url) => {
      category.url = url;
    });

    await addDoc(categoryColRef, {
      name: category.name,
      image: category.url,
    }).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });
    loading.value = 0;
    router.push({
      name: "category.index",
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

  const deleteCategory = async () => {
    if (deleteArray.value.length != []) {
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          const desertRef = refStorage(storage, categories.value[index].image);
          await deleteObject(desertRef)
            .then(() => {
              console.log("Deleted file!");
            })
            .catch((error) => {
              errors.value = error.message;
            });

          await deleteDoc(
            doc(db, "categories", deleteArray.value[index])
          ).catch((err) => {
            errors.value = err.message;
          });
        }
        getCategories();
      });
    }
    return;
  };

  const getCategory = async (id) => {
    loading.value = 1;
    const ref = doc(db, "categories", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      category.value = docSnap.data();
    } else {
      errors.value = "No such document!";
    }
    loading.value = 0;
  };

  const updateCategory = async (id) => {
    loading.value = 1;
    errors.value = "";
    const ref = doc(db, "categories", id);
    if (category.value.newImage) {
      const desertRef = refStorage(storage, category.value.image);
      await deleteObject(desertRef)
        .then(() => {
          console.log("Deleted old file!");
        })
        .catch((error) => {
          errors.value = error.message;
        });

      category.value.image = new File(
        [category.value.newImage],
        `${new Date().getTime()}_${category.value.newImage.name}`
      );
      const storageRef = refStorage(
        storage,
        `categories_icon/${category.value.image.name}`
      );

      await uploadBytes(storageRef, category.value.image).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      await getImage(`categories_icon/${category.value.image.name}`).then(
        (url) => {
          category.value.url = url;
        }
      );

      await updateDoc(ref, {
        name: category.value.name,
        image: category.value.url,
      }).catch((err) => {
        errors.value = err.message;
      });
    } else {
      await updateDoc(ref, {
        name: category.value.name,
      }).catch((err) => {
        errors.value = err.message;
      });
    }
    loading.value = 0;
    router.push({
      name: "category.index",
    });
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    updateCategory,
    getCategory,
    category,
    deleteCategory,
    toogleDeleteArray,
    checkAll,
    getCategories,
    deleteArray,
    chks,
    chkAll,
    categories,
    loading,
    errors,
    createCategory,
    cleanErrors,
  };
}
