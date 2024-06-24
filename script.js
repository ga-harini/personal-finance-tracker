document.addEventListener("DOMContentLoaded", function() {
    let expenses = [];
    let chart; 
  
    function addExpense(event) {
      event.preventDefault();
      const amount = parseFloat(document.getElementById("amount").value);
      const category = document.getElementById("category").value;
      const date = document.getElementById("date").value;
      const currency = document.getElementById("currency").value;
  
      const appId = "5335ed96192b48c780bfe041da87536b"; // Replace with your App ID
      const apiUrl = "https://openexchangerates.org/api/latest.json";
      fetch(`${apiUrl}?app_id=${appId}&base=USD`)
      .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Error: Unable to fetch exchange rates (status code: ${response.status})`);
          }
        })
      .then(data => {
          if (data && data.rates) {
            const exchangeRate = data.rates[currency.toUpperCase()];
            if (exchangeRate) {
              const usdAmount = amount / exchangeRate;
              expenses.push({ amount: usdAmount, category, date, currency });
              updateSummary();
              updateChart();
            } else {
              console.error(`Error: Unable to find exchange rate for ${currency}`);
            }
          } else {
            console.error("Error: Unable to fetch exchange rates");
          }
        })
      .catch(error => console.error(error));
    }
  
    function updateSummary() {
      const expenseList = document.getElementById("expense-list");
      expenseList.innerHTML = "";
      expenses.forEach(expense => {
        const listItem = document.createElement("li");
        listItem.textContent = `${expense.category} - ${expense.amount.toFixed(2)} USD - ${expense.date} - ${expense.currency}`;
        expenseList.appendChild(listItem);
      });
    }
  
    function updateChart() {
      const ctx = document.getElementById("expense-chart").getContext("2d");
      if (chart) {
        chart.destroy(); 
      }
      chart = new Chart(ctx, { 
        type: "bar",
        data: {
          labels: expenses.map(expense => expense.category),
          datasets: [{
            label: "Expenses (USD)",
            data: expenses.map(expense => expense.amount),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    document.getElementById("add-expense-btn").addEventListener("click", addExpense);
  });