// Импортируем Tauri API
const { invoke } = window.__TAURI__.tauri;

// Глобальная переменная для хранения счетов
let accounts = [];
let nextId = 1;

// Инициализация при загрузке страницы
window.onload = async function() {
    console.log('Window loaded');

    // Инициализация интерфейса
    initApp();

    // Загрузка данных из хранилища Tauri
    await loadAccounts();

    // Добавление обработчиков событий
    document.getElementById('add-account-row').addEventListener('click', addAccountRow);
    document.getElementById('save-accounts').addEventListener('click', saveAccounts);

    // Добавляем обработчик для удаления строк (делегирование событий)
    document.getElementById('accounts-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete')) {
            const row = e.target.closest('.account_row');
            if (row) {
                row.remove();
                updateTotalBalance();
            }
        }
    });
};

// Инициализация приложения
function initApp() {
    updateAccountsList();
    updateTotalBalance();
}

// Создание демо-счетов
function createDemoAccounts() {
    const demoAccounts = [
        {
            id: 1,
            name: 'Сбербанк',
            balance: Math.floor(Math.random() * 100000) + 50000 // Случайная сумма от 50,000 до 150,000
        },
        {
            id: 2,
            name: 'Тинькофф',
            balance: Math.floor(Math.random() * 80000) + 30000 // Случайная сумма от 30,000 до 110,000
        }
    ];

    accounts = demoAccounts;
    nextId = 3; // Следующий ID после демо-счетов
    return demoAccounts;
}

// Загрузка списка счетов из Tauri хранилища
async function loadAccounts() {
    try {
        // Вызываем Rust функцию для загрузки данных
        const savedAccounts = await invoke('load_accounts');

        if (savedAccounts && savedAccounts.length > 0) {
            accounts = savedAccounts;
            // Находим максимальный ID для новых счетов
            const maxId = Math.max(...accounts.map(acc => acc.id));
            nextId = maxId + 1;
        } else {
            // Если нет сохраненных счетов, создаем демо-счета
            accounts = createDemoAccounts();
            // Сохраняем демо-счета
            await invoke('save_accounts', { accounts });
        }

        updateAccountsList();
        updateTotalBalance();
    } catch (error) {
        console.error('Ошибка при загрузке счетов:', error);

        // В случае ошибки создаем демо-счета
        accounts = createDemoAccounts();
        updateAccountsList();
        updateTotalBalance();
    }
}

// Сохранение всех счетов
async function saveAccounts() {
    try {
        // Собираем данные из всех строк
        const rows = document.querySelectorAll('.account_row');
        const newAccounts = [];

        rows.forEach((row, index) => {
            const nameInput = row.querySelector('.account_name_input');
            const balanceInput = row.querySelector('.account_balance_input');

            const name = nameInput.value.trim();
            const balance = parseFloat(balanceInput.value) || 0;

            // Если название банка не пустое, добавляем в список
            if (name) {
                const id = parseInt(row.getAttribute('data-id')) || nextId++;
                newAccounts.push({
                    id: id,
                    name: name,
                    balance: balance
                });
            }
        });

        // Сохраняем новый список через Tauri API
        await invoke('save_accounts', { accounts: newAccounts });

        // Обновляем глобальный список
        accounts = newAccounts;

        // Обновляем интерфейс
        updateAccountsList();
        updateTotalBalance();

        // Показываем сообщение об успешном сохранении
        alert('Данные успешно сохранены');
    } catch (error) {
        console.error('Ошибка при сохранении счетов:', error);
        alert('Ошибка при сохранении данных: ' + error);
    }
}

// Добавление новой строки счета
function addAccountRow() {
    const accountsList = document.getElementById('accounts-list');
    const accountRow = document.createElement('div');
    accountRow.className = 'account_row';
    accountRow.setAttribute('data-id', nextId);

    accountRow.innerHTML = `
        <div class="account_col bank_name">
            <input type="text" class="account_name_input" placeholder="Название банка" value="">
        </div>
        <div class="account_col bank_balance">
            <input type="number" class="account_balance_input" placeholder="Баланс" value="0">
        </div>
        <div class="account_col bank_actions">
            <button class="delete" type="button">❌</button>
        </div>
    `;

    accountsList.appendChild(accountRow);

    // Добавляем обработчик для кнопки удаления
    const deleteButton = accountRow.querySelector('button.delete');
    deleteButton.addEventListener('click', handleDeleteRow);

    // Фокусируемся на новом поле ввода
    accountRow.querySelector('.account_name_input').focus();

    // Обновляем итоговую сумму
    updateTotalBalanceFromInputs();

    // Добавляем обработчики для автообновления суммы
    const inputs = accountRow.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateTotalBalanceFromInputs);
    });
}

// Обновление списка счетов в интерфейсе
function updateAccountsList() {
    const accountsList = document.getElementById('accounts-list');
    accountsList.innerHTML = '';

    accounts.forEach(account => {
        const accountRow = document.createElement('div');
        accountRow.className = 'account_row';
        accountRow.setAttribute('data-id', account.id);

        accountRow.innerHTML = `
            <div class="account_col bank_name">
                <input type="text" class="account_name_input" placeholder="Название банка" value="${account.name}">
            </div>
            <div class="account_col bank_balance">
                <input type="number" class="account_balance_input" placeholder="Баланс" value="${account.balance}">
            </div>
            <div class="account_col bank_actions">
                <button class="delete" type="button">❌</button>
            </div>
        `;

        accountsList.appendChild(accountRow);

        // Добавляем обработчик для кнопки удаления
        const deleteButton = accountRow.querySelector('button.delete');
        deleteButton.addEventListener('click', handleDeleteRow);
    });

    // Добавляем обработчики для автообновления суммы
    const inputs = document.querySelectorAll('.account_name_input, .account_balance_input');
    inputs.forEach(input => {
        input.addEventListener('input', updateTotalBalanceFromInputs);
    });
}

// Обработчик удаления строки
function handleDeleteRow(event) {
    const row = event.target.closest('.account_row');
    if (row && confirm('Вы уверены, что хотите удалить этот счет?')) {
        row.remove();
        updateTotalBalanceFromInputs();
    }
}

// Обновление итоговой суммы из текущих введенных данных
function updateTotalBalanceFromInputs() {
    const balanceInputs = document.querySelectorAll('.account_balance_input');
    let totalBalance = 0;

    balanceInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalBalance += value;
    });

    document.getElementById('total-balance').textContent = `${totalBalance.toLocaleString()} ₽`;
}

// Обновление итоговой суммы из массива счетов
function updateTotalBalance() {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    document.getElementById('total-balance').textContent = `${totalBalance.toLocaleString()} ₽`;
}
