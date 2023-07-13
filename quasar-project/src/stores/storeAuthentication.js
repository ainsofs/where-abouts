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
    user: {
      drupal_internal__uid: 0,
      sw_permissions: [],
    },
    uid: 0
  }),

  getters: {
    permissions(state) {
      let permissionsObject = {
        canEditAll: false,
        canEditDepartment: false,
        canEditOwn: false,
      }
      state.user.sw_permissions.forEach((item) => {
        const [key, canAccess] = item.split(":")
        permissionsObject[key] = Number(canAccess) === 1;
      })
      return permissionsObject
    },
  },

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
          const responseData = response.data
          this.loggedIn = true;

          this.logoutToken = responseData.logout_token
          this.csrfToken = responseData.csrf_token
          this.authHeader = Buffer.from(userId + ":" + password).toString('base64')

          this.setAxiosHeaders()
          this.setLocalStorage()

          // get user permissions
          this.uid = responseData.current_user.uid
          const uri2 = 'jsonapi/user/user/?filter[uid]=' + this.uid

          api
            .get(uri2, options)
            .then((response) => {
              console.log('user info')
              const userData = response.data.data[0]

              this.user = userData.attributes

              this.router.push('/')
            })
            .catch((error) => {
              console.log("error", error);
            })

        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    logoutUser() {
      if (!this.loggedIn) {
          this.clearUser()
          this.setAxiosHeaders()
          this.setLocalStorage()

          return
      }

      const options = {
        withCredentials: true, // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // remove Authorization header because drupal doesnt like it
      delete api.defaults.headers.common['Authorization']

      const uri = "/user/logout?_format=json&token=" + this.logoutToken;

      api
        .post(uri, null, options)
        .then((/* response */) => {
          console.log('logged out')
        })
        .catch((error) => {
          console.log("error", error);
        });

      this.clearUser()
      this.setAxiosHeaders()
      this.setLocalStorage()
    },
    clearUser() {
      console.log('users cleared')
      this.loggedIn = false
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
      if (this.authHeader) {
        api.defaults.headers.common['Authorization'] = 'Basic ' + this.authHeader
      }
      else {
        api.defaults.headers.common['Authorization'] = ''
      }
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
