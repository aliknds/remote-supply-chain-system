document.addEventListener('DOMContentLoaded', (event) => {
    var table = document.getElementById('data-table');
    var defaultUnitPrice = 14219.21;

    var quantityInputs = table.querySelectorAll('.quantity');
    var unitPriceInputs = table.querySelectorAll('.unit-price');
    
    quantityInputs.forEach(input => input.addEventListener('input', updateTotal));
    unitPriceInputs.forEach(input => {
        input.addEventListener('input', function(event) {
            updateTotal(event);
            updateAllUnitPrices(event);
        });
    });

    // Attach event listener to all quantity and unit-price cells
    var editableCells = table.querySelectorAll('.quantity, .unit-price');
    for (var i = 0; i < editableCells.length; i++) {
        editableCells[i].addEventListener('input', updateTotal);
        editableCells[i].addEventListener('focus', handleFocus);
        editableCells[i].addEventListener('blur', handleBlur);
        // Added keyup event
        editableCells[i].addEventListener('keyup', handleKeyup); 
    }

    function handleFocus(e) {
        e.target.style.backgroundColor = 'lightblue';
    }

    function handleBlur(e) {
        e.target.style.backgroundColor = ''; // always clear the color on blur
    }

    function handleKeyup(e) {
        if (e.target.innerText === '') {
            updateTotal(e);
        }
    }

    function updateTotal(e) {
        var row = e.target.parentNode.parentNode;
        var quantityInput = row.querySelector('.quantity');
        var unitPriceInput = row.querySelector('.unit-price');
        var totalPriceCell = row.querySelector('.total-price');

        var quantity = quantityInput.value ? parseFloat(quantityInput.value) : 0;
        var unitPrice = unitPriceInput.value ? parseFloat(unitPriceInput.value) : 0;

        if(quantity && !unitPrice){
            unitPriceInput.value = defaultUnitPrice;
            unitPrice = defaultUnitPrice;
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

        var dunCell = table.querySelector('tbody tr:last-child td:last-child strong');
        dunCell.innerText = sum.toFixed(2);
    }

    quantityInputs.forEach(input => updateTotal({ target: input }));
    
    // Initialize the table
    updateDun();


    // Calculate initial totals
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var quantityCell = rows[i].getElementsByClassName('quantity')[0];
        var unitPriceCell = rows[i].getElementsByClassName('unit-price')[0];
        var totalPriceCell = rows[i].getElementsByClassName('total-price')[0];

        if (quantityCell && unitPriceCell && totalPriceCell) {
            var quantity = quantityCell.innerText ? parseFloat(quantityCell.innerText) : null;
            var unitPrice = unitPriceCell.innerText ? parseFloat(unitPriceCell.innerText) : null;

            if (quantity && unitPrice) {
                var totalPrice = quantity * unitPrice;
                totalPriceCell.innerText = totalPrice.toFixed(2);
            } else {
                totalPriceCell.innerText = '';
            }
        }
    }
    
    initializeTable();
    
    function initializeTable() {
        // Loop over all rows and call updateTotal for each one
        var rows = table.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            updateTotal({ target: rows[i].getElementsByClassName('quantity')[0] });
        }
    }
});
