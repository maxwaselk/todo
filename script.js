const form = document.getElementById('shopping-form');
const itemInput = document.getElementById('item-input');
const categoryInput = document.getElementById('category-input');
const shoppingList = document.getElementById('shopping-list');
const filterBoughtButton = document.getElementById('filter-bought');
const sortButton = document.getElementById('sort-items');
const notificationContainer = document.getElementById('notification-container');

let items = JSON.parse(localStorage.getItem('shoppingItems')) || [];

document.addEventListener('DOMContentLoaded', displayItems);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();
    const itemCategory = categoryInput.value.trim() || 'Inne';

    if (itemName) {
        addItem(itemName, itemCategory);
        itemInput.value = '';
        categoryInput.value = '';
        showNotification('Produkt dodany!');
    }
});

function addItem(name, category) {
    const newItem = {
        id: Date.now(),
        name,
        category,
        bought: false
    };

    items.push(newItem);
    updateLocalStorage();
    displayItems();
}

function displayItems() {
    shoppingList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'items-center', 'p-4', 'bg-gray-100', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md', 'transition-all', 'duration-500');
        
        li.innerHTML = `
            <span class="item-name ${item.bought ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}">${item.name}</span>
            <span class="category text-sm text-gray-500 dark:text-gray-400">(${item.category})</span>
            <div class="actions flex space-x-4">
                <button class="toggle-btn bg-blue-500 text-white p-2 rounded-full transition duration-300 ease-in-out hover:bg-blue-600" onclick="toggleBought(${item.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="remove-btn bg-red-500 text-white p-2 rounded-full transition duration-300 ease-in-out hover:bg-red-600" onclick="removeItem(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        shoppingList.appendChild(li);
    });
}

function toggleBought(id) {
    items = items.map(item => item.id === id ? { ...item, bought: !item.bought } : item);
    updateLocalStorage();
    showNotification('Produkt przeniesiony do koszyka');
    displayItems();
}

function removeItem(id) {
    items = items.filter(item => item.id !== id);
    updateLocalStorage();
    showNotification('Produkt usunięty');
    displayItems();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'bg-green-500 text-white p-4 rounded-md shadow-md animate-slide-in-right';
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => notification.remove(), 500); // Usuwamy po animacji
    }, 2000);
}

function updateLocalStorage() {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
}

filterBoughtButton.addEventListener('click', () => {
    const boughtItems = items.filter(item => item.bought);
    shoppingList.innerHTML = '';
    boughtItems.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'items-center', 'p-4', 'bg-gray-100', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md', 'transition-all', 'duration-500');
        
        li.innerHTML = `
            <span class="item-name line-through text-gray-500 dark:text-gray-400">${item.name}</span>
            <span class="category text-sm text-gray-500 dark:text-gray-400">(${item.category})</span>
        `;
        shoppingList.appendChild(li);
    });
});

sortButton.addEventListener('click', () => {
    items.sort((a, b) => a.name.localeCompare(b.name));
    updateLocalStorage();
    displayItems();
});
