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
export default function useReservations() {
  const router = useRouter();
  const errors = ref("");
  const reservationColRef = collection(db, "reservations");
  const loading = ref(0);
  const reservation = ref([]);
  const reservations = ref([]);
  const deleteArray = ref([]);
  const chks = ref([]);
  const chkAll = ref(false);

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

  const getReservations = async () => {
    loading.value = 1;
    reservations.value = [];
    const reservationSnapshot = await getDocs(reservationColRef).catch(
      (err) => {
        errors.value = err.message;
      }
    );
    reservationSnapshot.forEach(async (doc) => {
      let reservation = doc.data();
      reservation.id = doc.id;

      reservations.value.push(reservation);
      chks.value.push({
        id: reservation.id,
        value: false,
      });
    });
    loading.value = 0;
  };

  const createReservation = async (reservation) => {
    loading.value = 1;
    errors.value = "";
    reservation.image = new File(
      [reservation.image],
      `${new Date().getTime()}_${reservation.image.name}`
    );
    const storageRef = refStorage(
      storage,
      `reservations/${reservation.image.name}`
    );

    await uploadBytes(storageRef, reservation.image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });

    await getImage(`reservations/${reservation.image.name}`).then((url) => {
      reservation.url = url;
    });

    await addDoc(reservationColRef, {
      name: reservation.name,
      image: reservation.url,
      brand: reservation.brand,
      category: reservation.category,
      caution: reservation.caution,
      description: reservation.description,
      features: {
        airConditionner: reservation.features.airConditionner,
        color: reservation.features.color,
        geatBox: reservation.features.geatBox,
        nbDoor: reservation.features.nbDoor,
        nbPlaces: reservation.features.nbPlaces,
        power: reservation.features.power,
      },
      fuelFullPrice: reservation.fuelFullPrice,
      price: reservation.price,
      state: reservation.state,
    }).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });
    loading.value = 0;
    router.push({
      name: "reservation.index",
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

  const getReservation = async (id) => {
    loading.value = 1;
    const ref = doc(db, "reservations", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      reservation.value = docSnap.data();
    } else {
      errors.value = "No such document!";
    }
    loading.value = 0;
  };

  const expiredReservation = async (id) => {
    errors.value = "";
    const { reveal, onConfirm } = createConfirmDialog(ConfirmDeleteModal, {
      question:
        "Are you sure you want to expired its item(s)? All data will be permanently deleted. This action cannot be undone.",
    });
    reveal();
    onConfirm(async () => {
      const ref = doc(db, "reservations", id);
      await updateDoc(ref, {
        state: 3,
      }).catch((err) => {
        errors.value = err.message;
      });
      getReservations();
    });
  };

  const validateReservation = async (id) => {
    errors.value = "";
    const ref = doc(db, "reservations", id);
    await updateDoc(ref, {
      state: 2,
    }).catch((err) => {
      errors.value = err.message;
    });
    getReservations();
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    expiredReservation,
    validateReservation,
    getReservation,
    reservation,
    toogleDeleteArray,
    checkAll,
    getReservations,
    deleteArray,
    chks,
    chkAll,
    reservations,
    loading,
    errors,
    createReservation,
    cleanErrors,
  };
}
