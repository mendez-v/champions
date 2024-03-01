import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://champions-b8621-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementsList")

const $ = selector => document.getElementById(selector)

const formEl = $("form-el"),
      endorsementTxtaEl = $("endorsement-txta-el"),
      publishBtn = $("publish-btn"),
      endorsementsListEl = $("endorsements-list-el")


formEl.addEventListener("submit", (e) => {
  e.preventDefault()
})

publishBtn.addEventListener("click", () => {
  let endorsementValue = endorsementTxtaEl.value
  push(endorsementListInDB, endorsementValue)
  clearInput()
})

endorsementTxtaEl.addEventListener("input", () => {
  if (endorsementTxtaEl.value) {
    publishBtn.disabled = false
  } else {
    publishBtn.disabled = true
  }
})

onValue(endorsementListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let itemsArr = Object.entries(snapshot.val())

    clearEndorsmentsListEl()

    for (let i = 0; i < itemsArr.length; i++) {
      let currentItem = itemsArr[i]
      appendItemToEndorsementsListEl(currentItem)
    }
  } else {
    endorsementsListEl.innerHTML = "No items here ... yet"
  }
})

function appendItemToEndorsementsListEl(item) {
  let itemID = item[0]
  let itemValue = item[1]

  let LI = document.createElement("LI")
  LI.setAttribute("class", "endorsements-list__item rad-05")
  LI.setAttribute("title", "Dbclick to delete message")
  LI.textContent = itemValue
  endorsementsListEl.append(LI)

  LI.addEventListener("dblclick", () => {
    let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`)
    remove(exactLocationOfItemInDB)
  })
}

function clearInput() {
  endorsementTxtaEl.value = null
  publishBtn.disabled = true
}
function clearEndorsmentsListEl() {
  endorsementsListEl.innerHTML = ""
}
