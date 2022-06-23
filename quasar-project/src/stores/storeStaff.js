import { defineStore } from 'pinia'
import { uid } from "quasar"
import { api } from "boot/axios"
import {
  setAddedDate,
  setUpdatedDate,
} from "src/functions/functions-set-audit-date"

export const useStoreStaff = defineStore("useStoreStaff", {
  state: () => ({
    staff: [
      // {
      //   id: 1,
      //   name: "Charlie Reed",
      //   email: "charlier@discuz.net",
      //   letter: "C",
      //   status: "in-the-office",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 2,
      //   name: "Christian Slaven",
      //   email: "christians@marketwatch.com",
      //   letter: "C",
      //   status: "in-the-office",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 3,
      //   name: "Epeli Tagi",
      //   email: "epelit@microsoft.com",
      //   letter: "E",
      //   status: "in-the-office",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 4,
      //   name: "Seka Fawdrey",
      //   email: "sfawdrey3@wired.com",
      //   letter: "S",
      //   status: "in-the-office",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 5,
      //   name: "Brunhilde Panswick",
      //   email: "bpanswick4@csmonitor.com",
      //   avatar: "avatar2.jpg",
      //   status: "working-remotely",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 6,
      //   name: "Winfield Stapforth",
      //   email: "wstapforth5@pcworld.com",
      //   avatar: "avatar6.jpg",
      //   status: "working-remotely",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 7,
      //   name: "Ainsof So'o",
      //   email: "ainsofs@csmonitor.com",
      //   avatar: "avatar4.jpg",
      //   status: "in-the-office",
      //   team: "",
      //   tags: [],
      // },
      // {
      //   id: 8,
      //   name: "Billy Chan-Ting",
      //   email: "billyc@pcworld.com",
      //   avatar: "avatar1.jpg",
      //   status: "in-the-office",
      //   team: "",
      //   tags: [],
      // },
    ],
  }),

  getters: {
    getStaffInTheOffice(state) {
      return this.getStaffByStatus("in-the-office", state)
    },
    getStaffWorkingRemotely(state) {
      return this.getStaffByStatus("working-remotely", state)
    },
    getStaffOutOfOffice(state) {
      return this.getStaffByStatus("out-of-office", state)
    },
    getStaffOnLeave(state) {
      return this.getStaffByStatus("on-leave", state)
    },
  },

  actions: {
    getStaffByStatus(status, state = null) {
      if (!state) {
        state = this
      }

      let filter = state.staff.filter((staff) => staff.status === status)

      return filter
    },
    getStaff(id) {
      return this.staff.filter((staff) => staff.id === id)[0]
    },
    addStaff(payload, id = null) {
      if (!id) {
        let uid = uid()
        id = uid
      }
      payload.id = id
      payload = setAddedDate(payload)
      this.staff.push(payload)
    },
    updateStaff(id, payload) {
      let staff = this.getStaff(id)
      if (staff) {
        staff = setUpdatedDate(payload, staff)
        console.log('updated')
      }
    },
    dReadData() {
      api
        .get("/jsonapi/node/wb_people")
        .then((response) => {

          const mapper = {
            // id: 7,
            name: "title",
            email: "field_email",
            // avatar: "avatar4.jpg",
            status: "field_status",
            // team: "",
            // tags: [],
            dateAdded: "created",
            dateUpdated: "changed",
            // addedBy: "",
            // updatedBy: "changed",
          }

          let personData = response.data.data
          personData.forEach((wb_person) => {
            let attributes = wb_person.attributes
            let keys = Object.keys(attributes),
              person = {},
              mapperKeys = Object.keys(mapper)

            person.id = wb_person.id
            mapperKeys.forEach((mKey) => {
              keys.forEach((key) => {
                if (mapper[mKey] === key) {
                  person[mKey] = attributes[key]
                }
              })
            })

            if (this.getStaff(person.id)) {
              // already exists update their details
              console.log('updating')
              this.updateStaff(person.id, person)
            }
            else {
              console.log("adding");
              this.addStaff(person, person.id)
            }
            person = {}
          })

        })
        .catch((error) => {
          console.log("error", error);
        })
    },
  },
})
