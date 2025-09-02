// Global variables and elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const groupNameInput = document.getElementById('groupName');
const userNameInput = document.getElementById('userName');
const startButton = document.getElementById('startButton');
const nextToInfoButton = document.getElementById('nextToInfo');
const displayGroupName = document.getElementById('displayGroupName');
const fruitSelection = document.getElementById('fruitSelection');
const selectionCount = document.getElementById('selectionCount');
const onlineUsersSection = document.getElementById('onlineUsers');
const usersList = document.getElementById('usersList');
const refreshUsersButton = document.getElementById('refreshUsers');
const alertMessage = document.getElementById('alertMessage');

let currentGroupName = '';
let currentUserName = '';
let selectedFruits = [];

// Fruit data with emojis - 15 fruits for selection
const allFruits = [
    { name: 'موز', emoji: '🍌' },
    { name: 'سیب', emoji: '🍎' },
    { name: 'بلوبری', emoji: '🫐' },
    { name: 'آناناس', emoji: '🍍' },
    { name: 'آووکادو', emoji: '🥑' },
    { name: 'پرتقال', emoji: '🍊' },
    { name: 'توت فرنگی', emoji: '🍓' },
    { name: 'سیب سبز', emoji: '🍏' },
    { name: 'کیوی', emoji: '🥝' },
    { name: 'گیلاس', emoji: '🍒' },
    { name: 'هندوانه', emoji: '🍉' },
    { name: 'انگور', emoji: '🍇' },
    { name: 'لیمو', emoji: '🍋' },
    { name: 'خربزه', emoji: '🍈' },
    { name: 'هلو', emoji: '🍑' }
];

// Tab switching logic
const switchTab = (tabId) => {
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    const selectedTabButton = document.getElementById(`tab-${tabId}`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
    const selectedTabContent = document.getElementById(`tab-content-${tabId}`);
    if (selectedTabContent) {
        selectedTabContent.classList.remove('hidden');
    }
};

// فعال کردن تب
const enableTab = (tabId) => {
    const tabButton = document.getElementById(`tab-${tabId}`);
    if (tabButton) {
        tabButton.classList.remove('disabled');
    }
};

// Show temporary alert message
function showAlertMessage() {
    alertMessage.style.display = 'block';
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}

// Render fruit selection options
function renderFruitSelection() {
    fruitSelection.innerHTML = '';
    allFruits.forEach(fruit => {
        const fruitOption = document.createElement('div');
        fruitOption.className = 'fruit-option';
        fruitOption.dataset.fruit = fruit.name;
        
        fruitOption.innerHTML = `
            <span class="selection-emoji">${fruit.emoji}</span>
            <span class="text-sm">${fruit.name}</span>
        `;
        
        fruitOption.addEventListener('click', function() {
            toggleFruitSelection(fruit);
        });
        
        fruitSelection.appendChild(fruitOption);
    });
}

// Toggle fruit selection
function toggleFruitSelection(fruit) {
    const index = selectedFruits.findIndex(f => f.name === fruit.name);
    
    if (index === -1) {
        if (selectedFruits.length < 10) {
            selectedFruits.push(fruit);
            document.querySelector(`.fruit-option[data-fruit="${fruit.name}"]`).classList.add('selected');
        }
    } else {
        selectedFruits.splice(index, 1);
        document.querySelector(`.fruit-option[data-fruit="${fruit.name}"]`).classList.remove('selected');
    }
    
    // Update selection count
    selectionCount.textContent = `${selectedFruits.length} میوه انتخاب شده از ۱۰ میوه`;
    
    // Enable/disable next button
    nextToInfoButton.disabled = selectedFruits.length !== 10;
}

// Save user data to localStorage
function saveUserToStorage() {
    const userData = {
        name: currentUserName,
        group: currentGroupName,
        joinedAt: new Date().toISOString()
    };
    
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('pokerUsers') || '[]');
    
    // Check if user already exists
    const userIndex = existingUsers.findIndex(u => u.name === currentUserName && u.group === currentGroupName);
    
    if (userIndex === -1) {
        existingUsers.push(userData);
    } else {
        existingUsers[userIndex] = userData;
    }
    
    // Save back to localStorage
    localStorage.setItem('pokerUsers', JSON.stringify(existingUsers));
    localStorage.setItem('pokerCurrentUser', JSON.stringify(userData));
    
    // Update users list
    updateUsersList();
}

// Update online users list
function updateUsersList() {
    const users = JSON.parse(localStorage.getItem('pokerUsers') || '[]');
    const currentGroup = JSON.parse(localStorage.getItem('pokerCurrentUser') || '{}').group;
    
    // Filter users by current group
    const groupUsers = users.filter(user => user.group === currentGroup);
    
    // Clear and update users list
    usersList.innerHTML = '';
    groupUsers.forEach(user => {
        const userBadge = document.createElement('div');
        userBadge.className = 'user-badge';
        userBadge.textContent = user.name;
        usersList.appendChild(userBadge);
    });
    
    // Show online users section if there are users
    onlineUsersSection.classList.toggle('hidden', groupUsers.length === 0);
}

// Event Listeners
startButton.addEventListener('click', function() {
    const userName = userNameInput.value.trim();
    const groupName = groupNameInput.value.trim();
    
    if (!userName || !groupName) {
        showAlertMessage();
        return;
    }

    currentUserName = userName;
    currentGroupName = groupName;
    
    displayGroupName.textContent = `نام گروه: ${currentGroupName} - کاربر: ${currentUserName}`;

    // Save user to storage
    saveUserToStorage();
    
    // Render fruit selection
    renderFruitSelection();
    
    switchTab('scenario');
});

// Refresh users list button
refreshUsersButton.addEventListener('click', function() {
    updateUsersList();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateUsersList();
    
    // Check for existing user data
    const existingUser = JSON.parse(localStorage.getItem('pokerCurrentUser') || '{}');
    if (existingUser.name && existingUser.group) {
        userNameInput.value = existingUser.name;
        groupNameInput.value = existingUser.group;
    }
});
