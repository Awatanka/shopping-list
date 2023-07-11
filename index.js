// Firebase initialization and database setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase app configuration
const appSettings = {
  databaseURL: "https://realtime-database-317ee-default-rtdb.firebaseio.com/",
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// ... code for adding items to the shopping list and displaying them ...
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < shoppingListArray.length; i++) {
      let currentItem = shoppingListArray[i];
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}
function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  shoppingListEl.append(newEl);
  newEl.addEventListener("dblclick", function () {
    let exactLocationOfStoryInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfStoryInDB);
  });
}

inputFieldEl.addEventListener("focus", function () {
  inputFieldEl.removeAttribute("placeholder");
});

inputFieldEl.addEventListener("blur", function () {
  inputFieldEl.setAttribute("placeholder", "Add item ...");
});
