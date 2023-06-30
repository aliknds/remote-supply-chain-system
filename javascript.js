document.addEventListener('DOMContentLoaded', (event) => {
    var table = document.getElementById('data-table');
    var defaultUnitPrice = 14219.21;
    var rows = table.getElementsByTagName('tr');
    var dunCell = table.querySelector('tbody tr:last-child td:last-child strong');

    // Add event listener to the table itself
    table.addEventListener('input', handleInput);
    table.addEventListener('focus', handleFocus, true); // useCapture set to true to catch the event on the way down
    table.addEventListener('blur', handleBlur, true);
    table.addEventListener('keyup', handleKeyup, true);

    function handleFocus(e) {
        if(e.target.classList.contains('quantity') || e.target.classList.contains('unit-price')) {
            e.target.classList.add('focused');
        }
    }

    function handleBlur(e) {
        if(e.target.classList.contains('quantity') || e.target.classList.contains('unit-price')) {
            e.target.classList.remove('focused');
        }
    }

    function handleKeyup(e) {
        if ((e.target.classList.contains('quantity') || e.target.classList.contains('unit-price')) && e.target.innerText === '') {
            updateTotal(e);
        }
    }

    function handleInput(e) {
        if(e.target.classList.contains('unit-price')) {
            updateAllUnitPrices(e);
        } else if(e.target.classList.contains('quantity')) {
            updateTotal(e);
        }
    }

    function updateAllUnitPrices(e) {
        var newUnitPrice = e.target.innerText;

        Array.from(rows).forEach(row => {
            var unitPriceCell = row.getElementsByClassName('unit-price')[0];
            if (unitPriceCell) {
                unitPriceCell.innerText = newUnitPrice;
            }
            
            var quantityCell = row.getElementsByClassName('quantity')[0];
            if (quantityCell) {
                updateTotal({ target: quantityCell });
            }
        });
    }

    function updateTotal(e) {
        var row = e.target.parentNode;
        var quantityCell = row.getElementsByClassName('quantity')[0];
        var unitPriceCell = row.getElementsByClassName('unit-price')[0];
        var totalPriceCell = row.getElementsByClassName('total-price')[0];

        var quantity = quantityCell.innerText ? parseFloat(quantityCell.innerText) : 0;
        var unitPrice = unitPriceCell.innerText ? parseFloat(unitPriceCell.innerText) : 0;

        if(quantity && !unitPriceCell.innerText){
            unitPriceCell.innerText = defaultUnitPrice;
            unitPrice = defaultUnitPrice;
        } else if (!quantity || !unitPrice) {
            quantityCell.innerText = '';
            unitPriceCell.innerText = '';
            totalPriceCell.innerText = '';
            updateDun();
            return;
        }

        var totalPrice = quantity * unitPrice;

        if (!isNaN(totalPrice)) {
            totalPriceCell.innerText = totalPrice.toFixed(2);
        } else {
            totalPriceCell.innerText = '';
        }

        updateDun();
    }

    function updateDun() {
        var totalPriceCells = table.querySelectorAll('.total-price');
        var sum = 0;
        
        totalPriceCells.forEach((cell) => {
            var cellValue = parseFloat(cell.innerText);
            if (!isNaN(cellValue)) {
                sum += cellValue;
            }
        });

        dunCell.innerText = sum.toFixed(2);
    }
    
    initializeTable();

    function initializeTable() {
        Array.from(rows).forEach(row => {
            updateTotal({ target: row.getElementsByClassName('quantity')[0] });
        });
    }
});
