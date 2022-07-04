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
export default function useCars() {
  const router = useRouter();
  const errors = ref("");
  const carColRef = collection(db, "cars");
  const loading = ref(0);
  const car = ref([]);
  const cars = ref([]);
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

  const getCars = async () => {
    loading.value = 1;
    cars.value = [];
    const carSnapshot = await getDocs(carColRef).catch((err) => {
      errors.value = err.message;
    });
    carSnapshot.forEach(async (doc) => {
      let car = doc.data();
      car.id = doc.id;

      cars.value.push(car);
      chks.value.push({
        id: car.id,
        value: false,
      });
    });
    loading.value = 0;
  };

  const createCar = async (car) => {
    loading.value = 1;
    errors.value = "";
    car.image = new File(
      [car.image],
      `${new Date().getTime()}_${car.image.name}`
    );
    const storageRef = refStorage(storage, `cars/${car.image.name}`);

    await uploadBytes(storageRef, car.image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });

    await getImage(`cars/${car.image.name}`).then((url) => {
      car.url = url;
    });

    await addDoc(carColRef, {
      name: car.name,
      image: car.url,
      brand: car.brand,
      category: car.category,
      caution: car.caution,
      description: car.description,
      features: {
        airConditionner: car.features.airConditionner,
        color: car.features.color,
        geatBox: car.features.geatBox,
        nbDoor: car.features.nbDoor,
        nbPlaces: car.features.nbPlaces,
        power: car.features.power,
      },
      fuelFullPrice: car.fuelFullPrice,
      price: car.price,
      state: car.state,
    }).catch((err) => {
      errors.value = err.message;
      loading.value = 0;
    });
    loading.value = 0;
    router.push({
      name: "car.index",
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

  const deleteCar = async () => {
    if (deleteArray.value.length != []) {
      reveal();
      onConfirm(async () => {
        for (const index in deleteArray.value) {
          const desertRef = refStorage(storage, cars.value[index].image);
          await deleteObject(desertRef)
            .then(() => {
              console.log("Deleted file!");
            })
            .catch((error) => {
              errors.value = error.message;
            });

          await deleteDoc(doc(db, "cars", deleteArray.value[index])).catch(
            (err) => {
              errors.value = err.message;
            }
          );
        }
        getCars();
      });
    }
    return;
  };

  const getCar = async (id) => {
    loading.value = 1;
    const ref = doc(db, "cars", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      car.value = docSnap.data();
    } else {
      errors.value = "No such document!";
    }
    loading.value = 0;
  };

  const updateCar = async (id) => {
    loading.value = 1;
    errors.value = "";
    const ref = doc(db, "cars", id);
    if (car.value.newImage) {
      const desertRef = refStorage(storage, car.value.image);
      await deleteObject(desertRef)
        .then(() => {
          console.log("Deleted old file!");
        })
        .catch((error) => {
          errors.value = error.message;
        });

      car.value.image = new File(
        [car.value.newImage],
        `${new Date().getTime()}_${car.value.newImage.name}`
      );
      const storageRef = refStorage(storage, `cars/${car.value.image.name}`);

      await uploadBytes(storageRef, car.value.image).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      await getImage(`cars/${car.value.image.name}`).then((url) => {
        car.value.url = url;
      });

      await updateDoc(ref, {
        name: car.value.name,
        image: car.value.url,
        brand: car.value.brand,
        category: car.value.category,
        caution: car.value.caution,
        description: car.value.description,
        features: {
          airConditionner: car.value.features.airConditionner,
          color: car.value.features.color,
          geatBox: car.value.features.geatBox,
          nbDoor: car.value.features.nbDoor,
          nbPlaces: car.value.features.nbPlaces,
          power: car.value.features.power,
        },
        fuelFullPrice: car.value.fuelFullPrice,
        price: car.value.price,
      }).catch((err) => {
        errors.value = err.message;
      });
    } else {
      await updateDoc(ref, {
        name: car.value.name,
        brand: car.value.brand,
        category: car.value.category,
        caution: car.value.caution,
        description: car.value.description,
        features: {
          airConditionner: car.value.features.airConditionner,
          color: car.value.features.color,
          geatBox: car.value.features.geatBox,
          nbDoor: car.value.features.nbDoor,
          nbPlaces: car.value.features.nbPlaces,
          power: car.value.features.power,
        },
        fuelFullPrice: car.value.fuelFullPrice,
        price: car.value.price,
      }).catch((err) => {
        errors.value = err.message;
      });
    }
    loading.value = 0;
    router.push({
      name: "car.index",
    });
  };

  const enabledCar = async (id) => {
    errors.value = "";
    const ref = doc(db, "cars", id);
    await updateDoc(ref, {
      state: 1,
    }).catch((err) => {
      errors.value = err.message;
    });
    getCars();
  };

  const disabledCar = async (id) => {
    errors.value = "";
    const ref = doc(db, "cars", id);
    await updateDoc(ref, {
      state: 2,
    }).catch((err) => {
      errors.value = err.message;
    });
    getCars();
  };

  const cleanErrors = () => {
    errors.value = "";
  };
  return {
    enabledCar,
    disabledCar,
    updateCar,
    getCar,
    car,
    deleteCar,
    toogleDeleteArray,
    checkAll,
    getCars,
    deleteArray,
    chks,
    chkAll,
    cars,
    loading,
    errors,
    createCar,
    cleanErrors,
  };
}
