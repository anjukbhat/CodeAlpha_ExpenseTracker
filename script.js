document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const incomeBalanceDisplay = document.getElementById('income-balance');
    const totalExpenseDisplay = document.getElementById('total-expense');
    let expenses = [];
    let incomeBalance = 0;
    let totalExpense = 0;

    // Load expenses from local storage
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
        calculateBalanceAndExpense();
        renderExpenses();
    }

    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);

        if (name.trim() === '' || isNaN(amount)) {
            alert('Please enter valid expense details');
            return;
        }

        const expense = {
            id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
            name: name,
            amount: amount
        };

        if (document.getElementById('add-expense-btn').style.display !== 'none') {
            expenses.push(expense);
            totalExpense += amount;
            incomeBalance -= amount;
        } else {
            const index = parseInt(document.getElementById('expense-form').getAttribute('data-index'));
            const oldAmount = expenses[index].amount;
            expenses[index] = expense;
            totalExpense = totalExpense - oldAmount + amount;
            incomeBalance += oldAmount - amount;
            document.getElementById('add-expense-btn').style.display = 'inline';
            document.getElementById('update-expense-btn').style.display = 'none';
            document.getElementById('cancel-update-btn').style.display = 'none';
        }

        saveExpenses();
        calculateBalanceAndExpense();
        renderExpenses();
        expenseForm.reset();
    });

    expenseList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.parentElement.getAttribute('data-id'));
            const expense = expenses.find(expense => expense.id === id);
            totalExpense -= expense.amount;
            incomeBalance += expense.amount;
            deleteExpense(id);
        } else if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.parentElement.getAttribute('data-id'));
            editExpense(id);
        }
    });

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-id', expense.id);
            li.innerHTML = `
                <span>${expense.name}: $${expense.amount}</span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function deleteExpense(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        calculateBalanceAndExpense();
        renderExpenses();
    }

    function editExpense(id) {
        const expense = expenses.find(expense => expense.id === id);
        document.getElementById('expense-name').value = expense.name;
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('add-expense-btn').style.display = 'none';
        document.getElementById('update-expense-btn').style.display = 'inline';
        document.getElementById('cancel-update-btn').style.display = 'inline';
        document.getElementById('expense-form').setAttribute('data-index', expenses.indexOf(expense));
    }

    function calculateBalanceAndExpense() {
        incomeBalance = 0; // Reset balance
        expenses.forEach(expense => {
            incomeBalance -= expense.amount;
        });
        incomeBalanceDisplay.textContent = `$${incomeBalance.toFixed(2)}`;
        totalExpenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
    }

    document.getElementById('cancel-update-btn').addEventListener('click', function() {
        document.getElementById('expense-form').reset();
        document.getElementById('add-expense-btn').style.display = 'inline';
        document.getElementById('update-expense-btn').style.display = 'none';
        document.getElementById('cancel-update-btn').style.display = 'none';
    });
});
