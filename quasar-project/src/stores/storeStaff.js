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
      //   teams: [],
      // },
      // {
      //   id: 2,
      //   name: "Christian Slaven",
      //   email: "christians@marketwatch.com",
      //   letter: "C",
      //   status: "in-the-office",
      //   teams: [],
      // },
    ],
    staffFilter: "",
    staffTeam: "",
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
    getStaffOnDutyTravel(state) {
      return this.getStaffByStatus("duty-travel", state)
    },
  },

  actions: {
    getStaffByStatus(status, state = null) {
      if (!state) {
        state = this
      }

      let filter = state.staff.filter(
        (staff) =>
          staff.status === status &&
          staff.name.toLowerCase().includes(state.staffFilter.toLowerCase())
      )

      if (state.staffTeam) {
        filter = filter.filter(
          (staff) =>
            staff.teams.includes(state.staffTeam)
        )
      }

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
        this.dUpdateData(id, payload)
      }
    },
    dReadData() {
      const uri =
        "/jsonapi/node/wb_people?sort=title&include=field_avatar,field_teams&fields[file--file]=uri,url&fields[taxonomy_term--teams]=name"
      this.dProcessPeople(uri)
    },
    dProcessPeople(uri) {
      api
        .get(uri)
        .then((response) => {
          const mapper = {
            // id: 7,
            name: "title",
            email: "field_email",
            avatar: "field_avatar",
            status: "field_status",
            teams: "field_teams",
            dateAdded: "created",
            dateUpdated: "changed",
            // addedBy: "",
            // updatedBy: "changed",
          }

          let personData = response.data.data,
            personIncluded = response.data.included,
            personLinks = response.data.links

          personData.forEach((wb_person) => {
            let attributes = wb_person.attributes,
              relationships = wb_person.relationships

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

              if (mKey === "avatar") {
                let key = mapper[mKey]
                if (key in relationships && relationships[key].data) {
                  let id = relationships[key].data.id,
                    result = personIncluded.filter((incl) => incl.id === id)

                  if (result.length) {
                    person[mKey] = result[0].attributes.uri.url
                  }
                }
              }
              else if (mKey === "teams") {
                person[mKey] = []
                let key = mapper[mKey]
                if (key in relationships && relationships[key].data) {
                  // Could be multiple teams.
                  relationships[key].data.forEach((data) => {
                    let id = data.id,
                      result = personIncluded.filter((incl) => incl.id === id)

                    if (result.length) {
                      person[mKey].push(result[0].attributes.name)
                    }
                  })
                }
              }
            })

            if (this.getStaff(person.id)) {
              // already exists update their details
              this.updateStaff(person.id, person)
            } else {
              this.addStaff(person, person.id)
            }
            person = {}
          })

          if ("next" in personLinks) {
            if ("href" in personLinks.next) {
              this.dProcessPeople(personLinks.next.href)
            }
          }
        })
        .catch((error) => {
          console.log("error", error)
        })
    },
    dUpdateData(id, payload) {
      const options = {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      }

      let uri = "jsonapi/node/wb_people/" + id
      let data = {
        data: {
          type: "node--wb_people",
          id: id,
          attributes: {
            field_status: payload.status,
          },
        },
      }

      api
        .patch(uri, data, options)
        .then((response) => {
          console.log("updated")
        })
        .catch((error) => {
          console.log("error", error)
        })
    },
  },
})
