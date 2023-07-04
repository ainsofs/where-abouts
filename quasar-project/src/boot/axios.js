import { boot } from "quasar/wrappers"
import axios from "axios"
import { LocalStorage } from "quasar"

let config = {
  baseURL: "http://api.where.docker.localhost:8000/",
}
const api = axios.create(config)

const authHeader = LocalStorage.getItem("auth_header")
const csrfToken = LocalStorage.getItem("csrf_token")

if (authHeader && csrfToken) {
  // Do it this way so that it can be unset when logging out a user.
  api.defaults.headers.common['Authorization'] = 'Basic ' + authHeader
  api.defaults.headers.common['CSRF-Token'] = csrfToken
}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
