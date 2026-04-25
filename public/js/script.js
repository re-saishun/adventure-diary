const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sunIcon = document.getElementById('theme-icon-sun');
const moonIcon = document.getElementById('theme-icon-moon');

// Theme toggle
function setTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        htmlElement.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

if (localStorage.getItem('theme') === 'dark') {
    setTheme('dark');
} else {
    setTheme('light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

// Sidebar toggle
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
}

async function fetchGoogleSheetData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Could not fetch Google Sheet data`);
        }
        const text = await response.text();
        return text.split('\n').map(row => row.split(', '));
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function createAccordion(groupedData) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    for (const groupName in groupedData) {
        const group = groupedData[groupName];
        if (group.length === 0) continue;

        const accordionItem = document.createElement('div');
        accordionItem.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4';

        const accordionHeader = document.createElement('button');
        accordionHeader.className = 'w-full flex justify-between items-center p-4 text-left text-xl font-bold text-gray-800 dark:text-white focus:outline-none';
        accordionHeader.innerHTML = `<span>${groupName}</span><svg class="w-6 h-6 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`;

        const accordionContent = document.createElement('div');
        accordionContent.className = 'p-4 hidden';

        const table = document.createElement('table');
        table.className = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700';

        const headerRow = document.createElement('tr');
        group[0].forEach((headerText, index) => {
            if (index > 0) { // Don't show the category column
                const th = document.createElement('th');
                th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider';
                th.textContent = headerText.trim();
                headerRow.appendChild(th);
            }
        });
        const thead = document.createElement('thead');
        thead.className = 'bg-gray-50 dark:bg-gray-800';
        thead.appendChild(headerRow);

        const tbody = document.createElement('tbody');
        tbody.className = 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700';
        group.slice(1).forEach(rowData => {
            if (rowData.join('').trim() === '') return;
            const row = document.createElement('tr');
            rowData.forEach((cellText, index) => {
                if (index > 0) { // Don't show the category column
                    const td = document.createElement('td');
                    td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200';
                    td.textContent = cellText.trim();
                    row.appendChild(td);
                }
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        accordionContent.appendChild(table);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionContent);
        container.appendChild(accordionItem);

        accordionHeader.addEventListener('click', () => {
            accordionContent.classList.toggle('hidden');
            accordionHeader.querySelector('svg').classList.toggle('rotate-180');
        });
    }
}

function groupData(data, categories) {
    const grouped = {};
    categories.forEach(cat => grouped[cat] = [data[0]]); // Initialize with headers

    data.slice(1).forEach(row => {
        const category = row[0].trim();
        if (grouped[category]) {
            grouped[category].push(row);
        }
    });
    return grouped;
}
