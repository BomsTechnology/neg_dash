import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import * as ConfirmDialog from "vuejs-confirm-dialog";
import App from "./App.vue";
import Error from "@/components/Error.vue";
import Spin from "@/components/Spin.vue";

import "./index.css";
import { initializeFirebase } from "./firebase";

initializeFirebase;
const pinia = createPinia();
const app = createApp(App);
app.component("Error", Error);
app.component("Spin", Spin);
app.use(router);
app.use(ConfirmDialog);
app.use(pinia);
app.mount("#app");
