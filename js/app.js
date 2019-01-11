//expenses class
class Expense {
  constructor(expenseName, expenseValue) {
    this.expenseName = expenseName;
    this.expenseValue = expenseValue;
  }
}

//storage class
class Store {
  //get expenses from local storage
  static getExpenses() {
    let expenses;
    if (localStorage.getItem("expenses") == null) {
      expenses = [];
    } else {
      expenses = JSON.parse(localStorage.getItem("expenses"));
    }
    return expenses;
  }

  static addExpenses(expense) {
    let expenses = Store.getExpenses();
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  static removeExpense(expenseName) {
    let expenses = Store.getExpenses();
    expenses.forEach((expense, index) => {
      if (expense.expenseName === expenseName) {
        expenses.splice(index, 1);
      }
      localStorage.setItem("expenses", JSON.stringify(expenses));
    });
  }

  static removeAllExpenses() {
    let expenses = Store.getExpenses();
    expenses = [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
}

//ui class
class UI {
  static addExpenseToList(expense) {
    let expenseList = document.querySelector("#expense-list");
    let row = document.createElement("tr");
    row.innerHTML = `
              <td>${expense.expenseName}</td>
              <td>${expense.expenseValue}</td>
              <td><a href="#" class="text-danger delete">X</a></td>
  
  `;
    expenseList.appendChild(row);
  }
  //display expenses in list
  static displayExpenses() {
    let expenses = Store.getExpenses();

    expenses.forEach(expense => UI.addExpenseToList(expense));
  }

  //display total expense
  static showTotalExpenses() {
    let totalExpenses = 0;
    let expenses = Store.getExpenses();
    for (let i in expenses) {
      totalExpenses += parseFloat(expenses[i].expenseValue);
    }

    let div = document.createElement("div");
    div.className = `total-expenses-class alert-success`;
    let h4 = document.createElement("h4");
    h4.innerHTML = `Your total expenses cost is <span class="text-danger ml-2">${totalExpenses}</span>`;
    div.appendChild(h4);

    const container = document.querySelector(".container");
    const clearExpensesDiv = document.querySelector("#clear-expenses");
    container.insertBefore(div, clearExpensesDiv);

    setTimeout(
      () => document.querySelector(".total-expenses-class").remove(),
      5000
    );
  }

  static deleteExpenseFromList(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearExpenses() {
    c;
    document.querySelector("#expense-list").innerHTML = "";
  }

  static clearFields() {
    document.querySelector("#expenseName").value = "";
    document.querySelector("#expenseValue").value = "";
  }

  static showAlert(message, className) {
    const container = document.querySelector(".container");
    const form = document.querySelector("#expense-form");

    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.innerHTML = `${message}`;
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}
// Event total Expenses
document
  .querySelector("#calculate-total-expenses")
  .addEventListener("click", UI.showTotalExpenses);
//Event display books
document.addEventListener("DOMContentLoaded", UI.displayExpenses);
//Event submit to list
document.querySelector("#expense-form").addEventListener("submit", e => {
  //prevent default action
  e.preventDefault();
  const expenseName = document.querySelector("#expenseName").value;
  const expenseValue = document.querySelector("#expenseValue").value;

  if (expenseName == "" || expenseValue == "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    let expense = new Expense(expenseName, expenseValue);
    UI.addExpenseToList(expense);
    Store.addExpenses(expense);

    UI.clearFields();

    UI.showAlert("Added to List", "success");
  }
});

//Event all clear Expenses
document
  .querySelector("#clear-expenses")
  .addEventListener("click", UI.clearExpenses);
//remove all from storage
Store.removeAllExpenses();

//Event delete from list
document.querySelector("#expense-list").addEventListener("click", e => {
  //remove expense from list
  UI.deleteExpenseFromList(e.target);
  //remove expense from storage
  Store.removeExpense(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent
  );
  //show alert
  UI.showAlert("Removed successfully", "success");
});
