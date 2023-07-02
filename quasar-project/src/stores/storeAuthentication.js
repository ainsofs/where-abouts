import { defineStore } from 'pinia'
import { api } from "boot/axios"
import { LocalStorage } from "quasar"
import { Buffer } from 'buffer'

export const useStoreAuthentication = defineStore("useStoreAuthentication", {
  state: () => ({
    loggedIn: false,
    isDownloaded: false,
    authTokens: null,
  }),

  // getters: {
  //   doubleCount(state) {
  //     return state.counter * 2
  //   },
  // },

  actions: {
    loginUser(userId, password) {
      const options = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        name: userId,
        pass: password,
      };
      const uri = "/user/login?_format=json";

      api
        .post(uri, data, options)
        .then((response) => {
          console.log(response.data);
          this.loggedIn = true;
          this.authTokens = response.data;

          LocalStorage.set("loggedIn", true);
          LocalStorage.set("csrf_token", response.data.csrf_token);
          LocalStorage.set("auth_token", Buffer.from(userId + ":" + password).toString('base64'));
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    logoutUser() {
      this.loggedIn = false
      this.authTokens = null

      const options = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const uri =
        "/user/logout?_format=json&token=" + this.authTokens.logout_token;

      api
        .post(uri, null, options)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    userStatus() {
      const options = {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": JSON.stringify(this.authTokens),
        },
      };
      const uri = "/user/login_status?_format=json";

      api
        .get(uri, options)
        .then((response) => {
          console.log(response.data);
          this.loggedIn = true;
          this.authTokens = response.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
});
