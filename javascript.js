document.addEventListener('DOMContentLoaded', (event) => {
    var table = document.getElementById('data-table');

    // Attach event listener to all quantity and unit price cells
    var editableCells = table.querySelectorAll('.quantity, .unit-price');
    for (var i = 0; i < editableCells.length; i++) {
        editableCells[i].addEventListener('input', updateTotal);
    }

    function updateTotal(e) {
        // Get the row of the cell that was changed
        var row = e.target.parentNode;

        // Get the quantity, unit price, and total price cells
        var quantityCell = row.getElementsByClassName('quantity')[0];
        var unitPriceCell = row.getElementsByClassName('unit-price')[0];
        var totalPriceCell = row.getElementsByClassName('total-price')[0];

        // Calculate the new total price
        var quantity = parseFloat(quantityCell.innerText);
        var unitPrice = parseFloat(unitPriceCell.innerText);
        var totalPrice = quantity * unitPrice;

        // Update the total price cell
        totalPriceCell.innerText = totalPrice.toFixed(2);
    }

    // Calculate initial totals
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var quantityCell = rows[i].getElementsByClassName('quantity')[0];
        var unitPriceCell = rows[i].getElementsByClassName('unit-price')[0];
        var totalPriceCell = rows[i].getElementsByClassName('total-price')[0];

        if (quantityCell && unitPriceCell && totalPriceCell) {
            var quantity = parseFloat(quantityCell.innerText);
            var unitPrice = parseFloat(unitPriceCell.innerText);
            var totalPrice = quantity * unitPrice;

            totalPriceCell.innerText = totalPrice.toFixed(2);
        }
    }
});
