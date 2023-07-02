import { boot } from "quasar/wrappers"
import axios from "axios"
import { LocalStorage } from "quasar"

let config = {
  baseURL: "http://api.where.docker.localhost:8000/",
}
const authToken = LocalStorage.getItem("auth_token")
const csrfToken = LocalStorage.getItem("csrf_token")
if (authToken && csrfToken) {
  config["Authorization"] = `Basic ${authToken}`
  config["CSRF-Token"] = csrfToken
}

const api = axios.create(config)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
