const shoppingForm = document.getElementById('shopping-form');
const itemInput = document.getElementById('item-input');
const shoppingList = document.getElementById('shopping-list');
const notificationContainer = document.getElementById('notification-container');

let items = JSON.parse(localStorage.getItem('shoppingItems')) || [];

function renderList() {
    shoppingList.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `shopping-item ${item.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${item.name}</span>
            <button class="remove-button" data-index="${index}"><i class="fas fa-times"></i></button>
        `;
        shoppingList.appendChild(li);
    });
    saveToLocalStorage();
}

function addItem(e) {
    e.preventDefault();
    const newItem = itemInput.value.trim();
    if (newItem) {
        items.push({ name: newItem, completed: false });
        itemInput.value = '';
        renderList();
        showNotification(`Dodano produkt: ${newItem}`, 'success');
    }
}

function removeItem(index) {
    const removedItem = items[index].name;
    items.splice(index, 1);
    renderList();
    showNotification(`Usunięto produkt: ${removedItem}`, 'error');
}

function toggleCompleted(index) {
    items[index].completed = !items[index].completed;
    const listItem = shoppingList.children[index];
    listItem.classList.toggle('completed');
    if (items[index].completed) {
        listItem.querySelector('span').classList.add('animate-strikethrough');
        showNotification(`Dodano do koszyka: ${items[index].name}`, 'info');
    } else {
        listItem.querySelector('span').classList.remove('animate-strikethrough');
    }
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

shoppingForm.addEventListener('submit', addItem);
shoppingList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-button') || e.target.closest('.remove-button')) {
        const index = e.target.closest('.remove-button').getAttribute('data-index');
        removeItem(index);
    } else if (e.target.tagName === 'SPAN') {
        const index = Array.from(shoppingList.children).indexOf(e.target.parentElement);
        toggleCompleted(index);
    }
});

renderList();

// Na końcu pliku zaktualizuj:
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/todo/service-worker.js')
            .then(registration => {
                console.log('Service Worker zarejestrowany pomyślnie:', registration);
            })
            .catch(error => {
                console.log('Błąd rejestracji Service Worker:', error);
            });
    });
}
