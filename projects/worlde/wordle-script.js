import data from './svenska-ord-len5.json' assert { type: 'json' };

function filterWords(data, letters, statuses) {
    return data.filter(word => {
        let absentLetters = new Set();

        // Check for correct and absent
        for (let i = 0; i < letters.length; i++) {
            if (statuses[i] === "correct" && letters[i].toLowerCase() !== word[i].toLowerCase()) {
                return false;
            }
            if (statuses[i] === "absent") {
                absentLetters.add(letters[i].toLowerCase());
            }
        }

        // Verify absent letters are not in the word
        if (Array.from(absentLetters).some(letter => word.includes(letter))) {
            return false;
        }

        // Check for present but incorrect position
        for (let i = 0; i < letters.length; i++) {
            if (statuses[i] === "present" && (!word.includes(letters[i].toLowerCase()) || word[i].toLowerCase() === letters[i].toLowerCase())) {
                return false;
            }
        }

        return true;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const entryInputs = document.querySelectorAll('.entry');
    const resultDiv = document.getElementById('result');
    const btnFind = document.getElementById('find');
    const btnClear = document.getElementById('clear');
    const btnBack = document.getElementById('back');

    function updateInputColor(input, status) {
        input.classList.remove('correct', 'present', 'absent', 'unknown');
        if (status !== 'unknown') {
            input.classList.add(status);
        }
    }

    function cycleStatus(input) {
        let currentStatus = input.getAttribute('data-status');
        let nextStatus = getNextStatus(currentStatus);
        input.setAttribute('data-status', nextStatus);
        updateInputColor(input, nextStatus);
    }

    function getNextStatus(currentStatus) {
        switch (currentStatus) {
            case 'unknown': return 'absent';
            case 'absent': return 'present';
            case 'present': return 'correct';
            case 'correct': return 'unknown';
            default: return 'unknown';
        }
    }

    function triggerSearch() {
        const letters = Array.from(entryInputs, input => input.value);
        const statuses = Array.from(entryInputs, input => input.getAttribute('data-status'));
        const matchingWords = filterWords(data, letters, statuses);

        resultDiv.innerHTML = '';
        if (matchingWords.length > 0) {
            const list = document.createElement('ul');
            matchingWords.forEach(word => {
                const item = document.createElement('li');
                item.textContent = word;
                list.appendChild(item);
            });
            resultDiv.appendChild(list);
        } else {
            const noResults = document.createElement('p');
            noResults.textContent = 'No matching words found.';
            resultDiv.appendChild(noResults);
        }
    }

    entryInputs.forEach((input, index) => {
        input.addEventListener('input', function () {
            input.value = input.value.toUpperCase().replace(/[^A-ZÅÄÖ]/g, '');
            if (input.value.length === input.maxLength) {
                const nextInput = entryInputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });

        input.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "Tab":
                    event.preventDefault();
                    let nextIndex = index + 1;
                    if (nextIndex >= entryInputs.length) {
                        nextIndex = 0;
                    }
                    entryInputs[nextIndex].focus();
                    break;
                case " ":
                    event.preventDefault();
                    cycleStatus(input);
                    break;
                case "Enter":
                    event.preventDefault();
                    triggerSearch();
                    break;
                case "Backspace":
                    if (!input.value && index > 0) {
                        event.preventDefault();
                        entryInputs[index - 1].focus();
                    }
                    break;
            }
        });
    });

    btnFind.addEventListener('click', triggerSearch);

    btnClear.addEventListener('click', function() {
        entryInputs.forEach(input => {
            input.value = '';
            input.setAttribute('data-status', 'unknown');
            input.classList.remove('correct', 'present', 'absent', 'unknown');
        });
        resultDiv.innerHTML = '';
    });

    btnBack.addEventListener('click', function() {
        window.location.href = '../../index.html';
    });

    if (entryInputs.length > 0) {
        entryInputs[0].focus();
    }
});
