document.addEventListener('DOMContentLoaded', (event) => {
    var table = document.getElementById('data-table');
    var defaultUnitPrice = 14219.21;

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
        // Get the row of the cell that was changed
        var row = e.target.parentNode;

        // Get the quantity, unit price, and total price cells
        var quantityCell = row.getElementsByClassName('quantity')[0];
        var unitPriceCell = row.getElementsByClassName('unit-price')[0];
        var totalPriceCell = row.getElementsByClassName('total-price')[0];

        // Reset the background color of the cells
        quantityCell.style.backgroundColor = '';
        unitPriceCell.style.backgroundColor = '';

        // Parse the quantity and unit price
        var quantity = quantityCell.innerText ? parseFloat(quantityCell.innerText) : 0;
        var unitPrice = unitPriceCell.innerText ? parseFloat(unitPriceCell.innerText) : 0;

        // If quantity is entered and unit price is not present, set default unit price
        if(quantity && !unitPriceCell.innerText){
            unitPriceCell.innerText = defaultUnitPrice;
            unitPrice = defaultUnitPrice;
        } else if (!quantity || !unitPrice) {
            quantityCell.innerText = '';
            unitPriceCell.innerText = '';
            totalPriceCell.innerText = ''; // Clear total if quantity or unit price is not valid
            updateDun();
            return;
        }

        // Calculate the new total price
        var totalPrice = quantity * unitPrice;

        // Update the total price cell
        if (!isNaN(totalPrice)) {
            totalPriceCell.innerText = totalPrice.toFixed(2);
        } else {
            totalPriceCell.innerText = ''; // Show an empty string instead of NaN
        }

        updateDun();
    }

    // Calculate and update the Дун cell
    function updateDun() {
        var totalPriceCells = table.querySelectorAll('.total-price');
        var sum = 0;
        
        totalPriceCells.forEach((cell) => {
            var cellValue = parseFloat(cell.innerText);
            if (!isNaN(cellValue)) {
                sum += cellValue;
            }
        });

        // Get the Дун cell
        var dunCell = table.querySelector('tbody tr:last-child td:last-child strong');

        // Update the Дун cell
        dunCell.innerText = sum.toFixed(2);
    }
    
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
