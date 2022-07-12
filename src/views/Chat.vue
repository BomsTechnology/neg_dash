<script setup>
import {
  SearchIcon,
  PaperAirplaneIcon,
  ChatAlt2Icon,
} from "@heroicons/vue/solid";
import { Timestamp } from "firebase/firestore";
import { UserCircleIcon } from "@heroicons/vue/outline";
import { reactive, onMounted, ref } from "vue";
import useUsers from "@/composables/useUser";
import useMessages from "@/composables/useMessage";

const { geChatUsers, users } = useUsers();
const { getMessages, messages, errors, cleanErrors, loading, createMessage } =
  useMessages();
const selectedUser = ref(null);
onMounted(() => {
  geChatUsers();
});
const open = reactive({
  chat: true,
  conversation: false,
});

const message = reactive({
  content: "",
  date: Timestamp.fromDate(new Date()),
  isSentByMe: false,
  state: false,
});

function changeView(view) {
  switch (view) {
    case "chat":
      open.conversation = false;
      open.chat = true;
      break;
    case "conversation":
      open.chat = false;
      open.conversation = true;
      break;
  }
}

function selectUser(user) {
  selectedUser.value = user;
  getMessages(user.id);
  changeView("chat");
  var chatDiv = document.getElementById("chatDiv");
  chatDiv.scrollTo(0, chatDiv.scrollHeight);
  // console.log(chatDiv);
  // chatDiv.scrollIntoView({
  //   behavior: "smooth",
  //   block: "end",
  //   inline: "nearest",
  // });
}

async function sendMessage() {
  if (!selectUser || message.content == "") {
    alert("Message vide ou utilisateur non selectionner");
  } else {
    await createMessage({ ...message }, selectedUser.value.id);
    message.content = "";
  }
}
</script>

<template>
  <div
    class="relative w-full p-8 h-full overflow-x-auto shadow-md sm:rounded-lg"
  >
    <div class="flex justify-between">
      <h1 class="font-bold text-3xl">Chat Assistance</h1>
    </div>
    <Error :errors="errors" @cleanErrors="cleanErrors" />
    <section class="px-4 md:px-28 mt-8">
      <div
        class="relative mb-10 flex h-[600px] w-full rounded-lg bg-white shadow-lg"
      >
        <!-- start  mobile button change view -->
        <button
          @click="changeView('conversation')"
          type="button"
          :class="[
            open.conversation
              ? 'absolute -left-2 top-2 z-10 rounded-full border border-blue-500 bg-blue-500 p-2 text-white shadow lg:hidden'
              : 'absolute -left-2 top-2 z-10 rounded-full border border-blue-500 bg-white p-2 text-blue-500 shadow lg:hidden',
          ]"
        >
          <ChatAlt2Icon class="h-5 w-5" />
        </button>
        <!-- end  mobile button change view -->

        <!-- start conversation mobile view -->
        <div v-if="open.conversation" class="w-full overflow-auto py-4">
          <div class="relative mx-2">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <SearchIcon class="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="simple-search"
              class="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Rechercher..."
              required
            />
          </div>
          <div class="mt-4 overflow-auto">
            <div
              class="flex h-24 w-full items-center space-x-2 border-b p-3 cursor-pointer hover:bg-gray-50"
              v-if="users.length != []"
              v-for="(user, index) in users"
              :key="user.id"
              @click="selectUser(user)"
            >
              <div class="h-12 w-12 overflow-hidden rounded lg:h-16 lg:w-16">
                <img
                  v-if="user.photo"
                  :src="user.photo"
                  class="h-full w-full bg-cover object-cover"
                  alt=""
                />
                <UserCircleIcon v-else class="w-full h-full text-gray-500" />
              </div>
              <div class="shrink">
                <h1 class="whitespace-normal text-sm font-bold">
                  {{
                    user.name.lenght > 24
                      ? user.name.substring(0, 24) + "..."
                      : user.name
                  }}
                </h1>
                <h6
                  class="whitespace-normal text-xs font-semibold text-gray-800"
                >
                  {{ user.email }}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <!-- end conversation mobile view -->

        <!-- start conversation pc view -->
        <div class="hidden w-[40%] flex-col py-4 lg:flex">
          <div class="relative mx-2">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <SearchIcon class="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="simple-search"
              class="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Rechercher..."
              required
            />
          </div>

          <div class="grow overflow-auto mt-10">
            <div
              class="flex h-24 w-full items-center space-x-2 border-b p-3 cursor-pointer hover:bg-gray-50"
              v-if="users.length != []"
              v-for="(user, index) in users"
              :key="user.id"
              @click="selectUser(user)"
            >
              <div></div>
              <div class="h-12 w-12 overflow-hidden rounded lg:h-16 lg:w-16">
                <img
                  v-if="user.photo"
                  :src="user.photo"
                  class="h-full w-full bg-cover object-cover"
                  alt=""
                />
                <UserCircleIcon v-else class="w-full h-full text-gray-500" />
              </div>
              <div class="shrink">
                <h1 class="whitespace-normal text-sm font-bold">
                  {{
                    user.name.lenght > 24
                      ? user.name.substring(0, 24) + "..."
                      : user.name
                  }}
                </h1>
                <h6
                  class="whitespace-normal text-xs font-semibold text-gray-800"
                >
                  {{ user.email }}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <!-- end conversation pc view -->

        <!-- start chat  view -->
        <div
          v-if="open.chat"
          class="relative flex w-full flex-col bg-gray-50 grow"
        >
          <div
            class="flex h-24 w-full flex-col items-center justify-center space-x-2 bg-white p-3"
          >
            <div
              class="h-12 w-12 overflow-hidden rounded-full drop-shadow-md"
              v-if="selectedUser"
            >
              <img
                v-if="selectedUser.photo"
                :src="selectedUser.photo"
                class="h-full w-full bg-cover object-cover"
                alt=""
              />
              <UserCircleIcon v-else class="w-full h-full text-gray-500" />
            </div>
            <h1 v-if="selectedUser" class="whitespace-normal text-sm font-bold">
              {{ selectedUser.name }}
            </h1>
          </div>

          <div id="chatDiv" class="h-full overflow-auto p-4">
            <div
              v-if="selectedUser && messages.length != []"
              v-for="(message, index) in messages"
              :key="message.id"
            >
              <div
                v-if="
                  index == 0 ||
                  messages[index].date.toDate().toLocaleDateString('fr-FR') !=
                    messages[index - 1].date
                      .toDate()
                      .toLocaleDateString('fr-FR')
                "
                class="flex items-center justify-between my-4"
              >
                <span class="w-1/5 border-b lg:w-1/4"></span>

                <span class="text-xs text-center text-gray-500 uppercase">{{
                  message.date.toDate().toLocaleDateString("fr-FR")
                }}</span>

                <span class="w-1/5 border-b lg:w-1/4"></span>
              </div>
              <div
                v-if="message.isSentByMe"
                class="mb-2 flex justify-start pr-10"
              >
                <p
                  class="whitespace-pre-line break-all rounded-r-lg rounded-bl-lg bg-white p-2 text-xs leading-normal tracking-wider"
                >
                  {{ message.content }}

                  <span class="mt-2 block text-xs font-bold">{{
                    message.date.toDate().toLocaleTimeString("fr-FR")
                  }}</span>
                </p>
              </div>

              <div v-else class="mb-2 flex justify-end pl-10">
                <p
                  class="whitespace-pre-line break-all rounded-l-lg rounded-tr-lg bg-blue-500 p-2 text-xs leading-normal tracking-wider text-white"
                >
                  {{ message.content }}
                  <span class="mt-2 block text-right text-xs font-bold">{{
                    message.date.toDate().toLocaleTimeString("fr-FR")
                  }}</span>
                </p>
              </div>
            </div>
            <div
              v-else-if="!selectedUser"
              class="h-full flex items-center justify-center"
            >
              <h1 class="text-3xl font-semibold">Select User</h1>
            </div>
            <div v-else class="h-full flex items-center justify-center">
              <h1 class="text-3xl font-semibold">No Message</h1>
            </div>
          </div>

          <form @submit.prevent="sendMessage()" class="0 w-full bg-white">
            <div
              class="dark:bg-gray-700 flex items-center rounded-lg py-2 px-3"
            >
              <textarea
                id="chat"
                rows="1"
                v-model="message.content"
                class="mx-4 block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your message..."
              ></textarea>

              <button
                type="submit"
                class="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-secondary-color"
              >
                <span v-if="loading == 1">
                  <Spin />
                </span>
                <span v-else>
                  <PaperAirplaneIcon class="h-6 w-6 rotate-90" />
                </span>
              </button>
            </div>
          </form>
        </div>
        <!-- end chat  view -->
      </div>
    </section>
  </div>
</template>
