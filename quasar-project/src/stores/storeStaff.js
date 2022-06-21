import { defineStore } from 'pinia'
import {
  setAddedDate,
  setUpdatedDate,
} from "src/functions/functions-set-audit-date"

export const useStoreStaff = defineStore("useStoreStaff", {
  state: () => ({
    staff: [
      {
        id: 1,
        name: "Charlie Reed",
        email: "charlier@discuz.net",
        letter: "C",
        status: "in-the-office",
        team: "",
        tags: [],
      },
      {
        id: 2,
        name: "Christian Slaven",
        email: "christians@marketwatch.com",
        letter: "C",
        status: "in-the-office",
        team: "",
        tags: [],
      },
      {
        id: 3,
        name: "Epeli Tagi",
        email: "epelit@microsoft.com",
        letter: "E",
        status: "in-the-office",
        team: "",
        tags: [],
      },
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
      {
        id: 7,
        name: "Ainsof So'o",
        email: "ainsofs@csmonitor.com",
        avatar: "avatar4.jpg",
        status: "in-the-office",
        team: "",
        tags: [],
      },
      {
        id: 8,
        name: "Billy Chan-Ting",
        email: "billyc@pcworld.com",
        avatar: "avatar1.jpg",
        status: "in-the-office",
        team: "",
        tags: [],
      },
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
      return this.staff.filter((staff) => staff.id === id)
    },
    updateStaff(id, payload) {
      let staff = this.getStaff(id)
      if (staff) {
        staff = setUpdatedDate(payload, staff)
        console.log('success')
      }
    }
  },
})
