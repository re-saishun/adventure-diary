const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
});

async function fetchGoogleSheetData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Could not fetch Google Sheet data`);
        }
        const text = await response.text();
        // A more robust CSV parsing might be needed for complex data
        return text.split('\n').map(row => row.split(', '));
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return empty array on error
    }
}

function displayData(data) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';
    if (data.length < 2) { // Check if there is data beyond the header
        dataContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No data to display.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700';

    const thead = document.createElement('thead');
    thead.className = 'bg-gray-50 dark:bg-gray-800';

    const headerRow = document.createElement('tr');
    data[0].forEach(headerText => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider';
        th.textContent = headerText.trim();
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const tbody = document.createElement('tbody');
    tbody.className = 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700';

    for (let i = 1; i < data.length; i++) {
        if(data[i].join('').trim() === '') continue; // Skip empty rows
        const row = document.createElement('tr');
        data[i].forEach(cellText => {
            const td = document.createElement('td');
            td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200';
            td.textContent = cellText.trim();
            row.appendChild(td);
        });
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    dataContainer.appendChild(table);
}
