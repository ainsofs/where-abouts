import { defineStore } from 'pinia'
import { api } from "boot/axios"
import { LocalStorage } from "quasar"
import { Buffer } from 'buffer'

export const useStoreAuthentication = defineStore("useStoreAuthentication", {
  state: () => ({
    loggedIn: LocalStorage.getItem("loggedIn") || false,
    isDownloaded: false,
    logoutToken: LocalStorage.getItem("logout_token") || null,
    csrfToken: LocalStorage.getItem("csrf_token") || null,
    authHeader: LocalStorage.getItem("auth_header") || null,
  }),

  // getters: {
  //   doubleCount(state) {
  //     return state.counter * 2
  //   },
  // },

  actions: {
    loginUser(userId, password) {
      const options = {
        withCredentials: true, // Include credentials (cookies) in the request
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

          this.logoutToken = response.data.logout_token
          this.csrfToken = response.data.csrf_token
          this.authHeader = Buffer.from(userId + ":" + password).toString('base64')

          this.setAxiosHeaders()
          this.setLocalStorage()
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    logoutUser() {
      const options = {
        withCredentials: true, // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const uri =
        "/user/logout?_format=json&token=" + this.logoutToken;

      api
        .post(uri, null, options)
        .then((/* response */) => {
          console.log('logged out')
          this.loggedIn = false

          this.clearUser()
          this.setAxiosHeaders()
          this.setLocalStorage()
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    clearUser() {
      console.log('users cleared')
      this.logoutToken = null
      this.csrfToken = null
      this.authHeader = null
    },
    setLocalStorage() {
      console.log('local storage set')
      LocalStorage.set("loggedIn", this.loggedIn);
      LocalStorage.set("logout_token", this.logoutToken);
      LocalStorage.set("csrf_token", this.csrfToken);
      LocalStorage.set("auth_header", this.authHeader);
    },
    setAxiosHeaders() {
      console.log('headers set')
      // api.defaults.headers.common['Authorization'] = 'Basic ' + this.authHeader
      api.defaults.headers.common['CSRF-Token'] = this.csrfToken
    }
    // userStatus() {
    //   const options = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Set-Cookie": JSON.stringify(this.authTokens),
    //     },
    //   };
    //   const uri = "/user/login_status?_format=json";

    //   api
    //     .get(uri, options)
    //     .then((response) => {
    //       console.log(response.data);
    //       this.loggedIn = true;
    //       this.authTokens = response.data;
    //     })
    //     .catch((error) => {
    //       console.log("error", error);
    //     });
    // },
  },
});
