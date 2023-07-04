import { boot } from "quasar/wrappers"
import axios from "axios"
import { LocalStorage } from "quasar"

let config = {
  baseURL: "http://api.where.docker.localhost:8000/",
}
const authHeader = LocalStorage.getItem("auth_header")
const csrfToken = LocalStorage.getItem("csrf_token")

if (authHeader && csrfToken) {
  config['headers'] = {
    Authorization: `Basic ${authHeader}`,
    "CSRF-Token": csrfToken,
  }
}

const api = axios.create(config)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
