const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const searchBox = document.querySelector(".search-box");
const sortSelect = document.querySelector(".sort");
const clearAllButton = document.getElementById("clear-all");

form.addEventListener("submit", addTransaction);
searchBox.addEventListener("input", renderList);
sortSelect.addEventListener("change", renderList);

clearAllButton.addEventListener("click", function() {
  const confirmation = confirm("Are you sure you want to clear all transactions?");
  if (confirmation) {
    clearAllTransactions();
  }
});

let pieChart, barChart;

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = formatter.format(balanceTotal).substring(1);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);

  renderPieChart(incomeTotal, expenseTotal);
  renderBarChart();
}

function renderList() {
  list.innerHTML = "";
  status.textContent = "";

  const searchQuery = searchBox.value.toLowerCase();
  const sortBy = sortSelect.value;

  const filteredTransactions = transactions.filter(({ name, category }) => {
    return (
      name.toLowerCase().includes(searchQuery) ||
      category.toLowerCase().includes(searchQuery)
    );
  });

  if (sortBy === "date") {
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "expense") {
    filteredTransactions.sort((a, b) => a.amount - b.amount);
  } else if (sortBy === "income") {
    filteredTransactions.sort((a, b) => b.amount - a.amount);
  }

  if (filteredTransactions.length === 0) {
    status.textContent = "No transactions found.";
    return;
  }

  filteredTransactions.forEach(({ id, name, amount, date, type, category }) => {
    const sign = type === "income" ? 1 : -1;

    const li = document.createElement("li");
    

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${category}</p>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const name = formData.get("name");
  const amount = parseFloat(formData.get("amount"));
  const date = new Date(formData.get("date"));
  const category = formData.get("category");
  const type = formData.get("type") === "on" ? "income" : "expense";

  if (!name || isNaN(amount) || amount <= 0 || !date || !category) {
    status.textContent = "Please fill out all fields correctly.";
    return;
  }

  transactions.push({
    id: transactions.length + 1,
    name: name,
    amount: amount,
    date: date,
    type: type,
    category: category,
  });

  this.reset();
  updateTotal();
  saveTransactions();
  renderList();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderPieChart(incomeTotal, expenseTotal) {
  const ctx = document.getElementById("pieChart").getContext("2d");

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#9ACD32", "#ed8493"],
      }]
    }
  });
}

function renderBarChart() {
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  transactions.forEach((trx) => {
    const month = new Date(trx.date).getMonth();
    if (trx.type === "income") {
      monthlyIncome[month] += trx.amount;
    } else if (trx.type === "expense") {
      monthlyExpense[month] += trx.amount;
    }
  });

  const ctx = document.getElementById("barChart").getContext("2d");

  if (barChart) {
    barChart.destroy();
  }

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Income",
          data: monthlyIncome,
          backgroundColor: "#9ACD32"
        },
        {
          label: "Expense",
          data: monthlyExpense,
          backgroundColor: "#ed8493"
        }
      ]
    }
  });
}

function clearAllTransactions() {
  transactions.length = 0;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderList();
  updateTotal();
}

renderList();
updateTotal();
