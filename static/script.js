async function showTerms() {
    const response = await fetch("/terms/");
    const terms = await response.json();
    const container = document.getElementById("termsContainer");
    container.innerHTML = ""; // Clear existing terms
    terms.forEach(term => {
        const termDiv = document.createElement("div");
        termDiv.className = "term-container";
        termDiv.innerHTML = `
            <div class="term-word">${term.word}</div>
            <div class="term-definition">${term.definition}</div>
        `;
        container.appendChild(termDiv);
    });
}

async function searchTerm() {
    const word = document.getElementById("searchWord").value;
    const response = await fetch(`/terms/`);
    const terms = await response.json();
    const foundTerm = terms.find(term => term.word.toLowerCase() === word.toLowerCase());
    if (foundTerm) {
        alert(`Определение для "${foundTerm.word}": ${foundTerm.definition}`);
    } else {
        alert("Термин не найден.");
    }
}

async function addTerm() {
    const id = prompt("Введите ID термина:");
    const word = prompt("Введите слово:");
    const definition = prompt("Введите определение:");
    const response = await fetch("/terms/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: Number(id), word, definition })
    });
    if (response.ok) {
        alert("Термин добавлен!");
        showTerms();
    } else {
        alert("Ошибка при добавлении термина.");
    }
}

async function updateTerm() {
    const id = prompt("Введите ID термина для изменения:");
    const word = prompt("Введите новое слово:");
    const definition = prompt("Введите новое определение:");
    const response = await fetch(`/terms/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: Number(id), word, definition })
    });
    if (response.ok) {
        alert("Термин изменен!");
        showTerms();
    } else {
        alert("Ошибка при изменении термина.");
    }
}

async function deleteTerm() {
    const id = prompt("Введите ID термина для удаления:");
    const response = await fetch(`/terms/${id}`, {
        method: "DELETE"
    });
    if (response.ok) {
        alert("Термин удален!");
        showTerms();
    } else {
        alert("Ошибка при удалении термина.");
    }
}