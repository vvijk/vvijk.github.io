import data from './svenska-ord-len5.json' assert { type: 'json'};

function filterWords(data, values) {
    const matchingWords = data.filter(word => {
        for (let i = 0; i < Object.keys(values).length; i++) {
            const userInputChar = values[Object.keys(values)[i]];
            
            if (userInputChar && userInputChar.toLowerCase() !== word[i].toLowerCase()) {
                return false;
            }
        }
        return true;
    });
    
    return matchingWords;
}

document.addEventListener('DOMContentLoaded', function () {
    const entryInputs = document.querySelectorAll('.entry');
    const btn = document.getElementById('find');

    // Add event listener to all inputs
    entryInputs.forEach((input, index) => {
        input.addEventListener('input', function (event) {
            const inputValue = event.target.value;

            // Fill out the current input
            entryInputs[index].value = inputValue;

            // Move focus to the next input
            if (inputValue && entryInputs[index].value.length === entryInputs[index].maxLength) {
                const nextInputIndex = index + 1;

                if (nextInputIndex < entryInputs.length) {
                    entryInputs[nextInputIndex].focus();
                }
            }
        });
    });

    btn.addEventListener('click', function() {
        const userInputArray = [];
        entryInputs.forEach(function (input) {
            userInputArray.push(input.value);
        });

        const matchingWords = filterWords(data, userInputArray);
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';
        const resultParagraph = document.createElement('p');
    
        resultParagraph.textContent = `${matchingWords.join(' - ')}`;

        resultDiv.appendChild(resultParagraph);
    });
});

document.getElementById('back').addEventListener('click', function() {
    window.location.href = '../../index.html';
});

let clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function() {
    const entryInputs = document.querySelectorAll('.entry');
    entryInputs.forEach(function(input) {
        input.value = '';
    });
});

