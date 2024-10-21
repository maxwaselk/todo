const enterButton = document.getElementById('enter-button');
const startScreen = document.getElementById('start-screen');
const mainScreen = document.getElementById('main-screen');
const addButton = document.getElementById('add-button');
const modal = document.getElementById('modal');
const confirmAdd = document.getElementById('confirm-add');
const productInput = document.getElementById('product-input');
const shoppingList = document.getElementById('shopping-list');
const notificationContainer = document.getElementById('notification-container');

let items = JSON.parse(localStorage.getItem('shoppingItems')) || [];

// Przejście na główną stronę po kliknięciu "Wchodzę"
enterButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    displayItems();
});

// Wyświetlanie listy produktów
function displayItems() {
    shoppingList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'items-center', 'p-4', 'bg-gray-100', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md', 'transition-all', 'duration-500');
        li.innerHTML = `
            <span class="${item.bought ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}">${item.name}</span>
            <button class="remove-btn text-red-500 hover:text-red-600 transition" onclick="removeItem(${item.id})">x</button>
        `;
        li.addEventListener('click', () => toggleBought(item.id));
        shoppingList.appendChild(li);
    });
}

// Dodanie nowego produktu
addButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

confirmAdd.addEventListener('click', () => {
    const productName = productInput.value.trim();
    if (productName) {
        const newItem = {
            id: Date.now(),
            name: productName,
            bought: false
        };
        items.push(newItem);
        updateLocalStorage();
        displayItems();
        showNotification('Produkt dodany!', 'bg-green-500');
    }
    productInput.value = '';
    modal.classList.add('hidden');
});

// Usuwanie produktu
function removeItem(id) {
    items = items.filter(item => item.id !== id);
    updateLocalStorage();
    displayItems();
    showNotification('Produkt usunięty!', 'bg-red-500');
}

// Oznaczanie produktu jako kupiony
function toggleBought(id) {
    items = items.map(item => item.id === id ? { ...item, bought: !item.bought } : item);
    updateLocalStorage();
    displayItems();
}

// Powiadomienia
function showNotification(message, bgColor) {
    const notification = document.createElement('div');
    notification.className = `${bgColor} text-white p-4 rounded-md shadow-md animate-slide-in-right`;
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => notification.remove(), 500); // Usuwamy po animacji
    }, 2000);
}

// Aktualizacja localStorage
function updateLocalStorage() {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
}
