const newItemInput = document.getElementById('newItem');
const addItemButton = document.getElementById('addItem');
const shoppingList = document.getElementById('shoppingList');
const notification = document.getElementById('notification');
const notificationContent = document.getElementById('notificationContent');
const notificationText = document.getElementById('notificationText');
const lightThemeBtn = document.getElementById('lightTheme');
const darkThemeBtn = document.getElementById('darkTheme');
const autoThemeBtn = document.getElementById('autoTheme');
const reminderDateInput = document.getElementById('reminderDate');
const setReminderButton = document.getElementById('setReminder');

lucide.createIcons();

function showNotification(message, type) {
    notificationText.textContent = message;
    notificationContent.className = `alert ${type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-warning'}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function addItem() {
    const itemText = newItemInput.value.trim();
    if (itemText) {
        if (itemExists(itemText)) {
            showNotification(`Produkt "${itemText}" już istnieje na liście!`, 'warning');
            return;
        }
        const li = createListItem(itemText);
        shoppingList.appendChild(li);
        newItemInput.value = '';
        showNotification(`Dodano produkt: ${itemText}`, 'success');
        saveItems();
    }
}

function createListItem(itemText) {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-2 bg-base-100 rounded box-shadow-custom draggable';
    li.draggable = true;
    li.innerHTML = `
        <span class="flex items-center cursor-pointer">
            <span class="strikethrough">${itemText}</span>
        </span>
<button class="btn btn-circle">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>    `;

    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragover', dragOver);
    li.addEventListener('drop', drop);
    li.addEventListener('dragenter', dragEnter);
    li.addEventListener('dragleave', dragLeave);

    li.querySelector('.strikethrough').addEventListener('click', function() {
        this.classList.toggle('active');
        saveItems();
    });

    li.querySelector('button').addEventListener('click', function() {
        li.remove();
        showNotification(`Usunięto produkt: ${itemText}`, 'error');
        saveItems();
    });

    return li;
}

function itemExists(itemText) {
    return Array.from(shoppingList.children).some(li => 
        li.querySelector('.strikethrough').textContent.toLowerCase() === itemText.toLowerCase()
    );
}

function saveItems() {
    const items = Array.from(shoppingList.children).map(li => ({
        text: li.querySelector('.strikethrough').textContent,
        completed: li.querySelector('.strikethrough').classList.contains('active')
    }));
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

function loadItems() {
    const savedItems = JSON.parse(localStorage.getItem('shoppingList')) || [];
    savedItems.forEach(item => {
        const li = createListItem(item.text);
        if (item.completed) {
            li.querySelector('.strikethrough').classList.add('active');
        }
        shoppingList.appendChild(li);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('dragging'), 0);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = e.target.closest('li');
    if (dropzone && draggableElement !== dropzone) {
        const allItems = Array.from(shoppingList.children);
        const fromIndex = allItems.indexOf(draggableElement);
        const toIndex = allItems.indexOf(dropzone);
        if (fromIndex < toIndex) {
            shoppingList.insertBefore(draggableElement, dropzone.nextSibling);
        } else {
            shoppingList.insertBefore(draggableElement, dropzone);
        }
        saveItems();
    }
    draggableElement.classList.remove('dragging');
}

function dragEnter(e) {
    e.preventDefault();
    e.target.closest('li').classList.add('drag-over');
}

function dragLeave(e) {
    e.target.closest('li').classList.remove('drag-over');
}

function setReminder() {
    const reminderDate = new Date(reminderDateInput.value);
    if (isNaN(reminderDate)) {
        showNotification('Proszę wybrać prawidłową datę i godzinę', 'error');
        return;
    }

    const now = new Date();
    if (reminderDate <= now) {
        showNotification('Data przypomnienia musi być w przyszłości', 'error');
        return;
    }

    const timeUntilReminder = reminderDate.getTime() - now.getTime();
    setTimeout(() => {
        if (Notification.permission === 'granted') {
            new Notification('Przypomnienie o zakupach', {
                body: 'Czas na zakupy!'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Przypomnienie o zakupach', {
                        body: 'Czas na zakupy!'
                    });
                }
            });
        }
        showNotification('Czas na zakupy!', 'success');
    }, timeUntilReminder);

    showNotification(`Przypomnienie ustawione na ${reminderDate.toLocaleString()}`, 'success');
}

addItemButton.addEventListener('click', addItem);
newItemInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addItem();
});
setReminderButton.addEventListener('click', setReminder);

function setTheme(theme) {
    if (theme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
    updateActiveThemeButton(theme);
}

function updateActiveThemeButton(theme) {
    [lightThemeBtn, darkThemeBtn, autoThemeBtn].forEach(btn => btn.classList.remove('btn-active'));
    if (theme === 'light') lightThemeBtn.classList.add('btn-active');
    else if (theme === 'dark') darkThemeBtn.classList.add('btn-active');
    else if (theme === 'auto') autoThemeBtn.classList.add('btn-active');
}

lightThemeBtn.addEventListener('click', () => setTheme('light'));
darkThemeBtn.addEventListener('click', () => setTheme('dark'));
autoThemeBtn.addEventListener('click', () => setTheme('auto'));

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'auto';
setTheme(savedTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    if (localStorage.getItem('theme') === 'auto') {
        setTheme('auto');
    }
});


function assignIds() {
    if (shoppingList.children.length === 0) {
        loadItems();
    }
    Array.from(shoppingList.children).forEach((li, index) => {
        li.id = `item-${index}`;
    });
}

// Initialize
assignIds();