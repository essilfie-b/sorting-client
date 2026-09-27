const apiBaseUrl = 'http://localhost:8080/spring/api/operations';
let currentEditingId = null;

async function fetchOperations() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const operations = await response.json();
        const operationsBody = document.getElementById('operations-body');
        operationsBody.innerHTML = '';

        operations.forEach(operation => {
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-100', 'transition', 'duration-200');
            row.dataset.id = operation.id;

            const typeCell = document.createElement('td');
            typeCell.textContent = operation.type;
            typeCell.classList.add('p-3');

            const dataCell = document.createElement('td');
            dataCell.textContent = operation.data.join(', ');
            dataCell.classList.add('p-3');

            const resultCell = document.createElement('td');
            resultCell.textContent = operation.result ? operation.result.join(', ') : 'Not sorted yet';
            resultCell.classList.add('p-3');

            const actionCell = document.createElement('td');
            actionCell.classList.add('p-3', 'flex', 'space-x-2');

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '✏️';
            editBtn.classList.add('text-blue-500', 'hover:bg-blue-100', 'p-1', 'rounded');
            editBtn.addEventListener('click', () => startEditing(operation));

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.classList.add('text-red-500', 'hover:bg-red-100', 'p-1', 'rounded');
            deleteBtn.addEventListener('click', () => deleteOperation(operation.id));

            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);

            row.appendChild(typeCell);
            row.appendChild(dataCell);
            row.appendChild(resultCell);
            row.appendChild(actionCell);

            operationsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching operations:', error);
        alert(`Failed to fetch operations: ${error.message}`);
    }
}

async function deleteOperation(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        await fetchOperations();
    } catch (error) {
        console.error('Error deleting operation:', error);
        alert(`Failed to delete operation: ${error.message}`);
    }
}

function startEditing(operation) {
    document.getElementById('data-input').value = operation.data.join(', ');
    document.getElementById('sort-select').value = operation.type.toLowerCase();
    currentEditingId = operation.id;

    const executeBtn = document.getElementById('execute-sort-btn');
    executeBtn.textContent = 'Update Operation';
    executeBtn.classList.remove('bg-brand-purple');
    executeBtn.classList.add('bg-green-500');
}

async function executeSort() {
    const selectedAlgorithm = document.getElementById('sort-select').value;
    const inputData = document.getElementById('data-input').value;

    if (inputData === '') {
        alert("Please enter some data to sort.");
        return;
    }

    const dataArray = inputData.split(',').map(num => parseInt(num.trim()));

    try {
        let response;
        let url = `${apiBaseUrl}/sort?stringData=${encodeURIComponent(inputData)}&type=${selectedAlgorithm.toUpperCase()}`;

        if (currentEditingId) {
            url = `${apiBaseUrl}/${currentEditingId}`;
            response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: selectedAlgorithm.toUpperCase(),
                    data: dataArray,
                }),
            });
        } else {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        document.getElementById('sort-result').textContent = JSON.stringify(result, null, 2);
        await fetchOperations();
        resetEditingState();
    } catch (error) {
        console.error('Error executing sort:', error);
        document.getElementById('sort-result').textContent = `${error.message}`;
    }
}

function resetEditingState() {
    currentEditingId = null;
    document.getElementById('data-input').value = '';
    document.getElementById('execute-sort-btn').textContent = 'Cast Sorting Spell ✨';
    document.getElementById('execute-sort-btn').classList.remove('bg-green-500');
    document.getElementById('execute-sort-btn').classList.add('bg-brand-purple');
}

document.getElementById('execute-sort-btn').addEventListener('click', executeSort);

document.addEventListener('DOMContentLoaded', () => {
    fetchOperations();
});