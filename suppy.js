document.getEventListener('DOMContentLoaded', (event) => {
    var table = document.getElementById('data-table');
    var defaultUnitPrice = 14219.21;

    var editableCells = table.querySelectorAll('.quantity, .unit-price');
    for (var i = 0; i < editableCells.length; i++) {
        editableCells[i].addEventListener('input', updateTotal);
        editableCells[i].addEventListener('focus', handleFocus);
        editableCells[i].addEventListener('blur', handleBlur);
    }
    
    function handleFocus(e) {
        e.target.style.backgroundColor = 'lightblue';
    }

    function handleBlur(e) {
        e.target.style.backgroundColor = '';
    }

    function updateTotal(e) {
        var row = e.target.parentNode;

        var quantityCell = row.getElementByClassName('quantity')[0];
        var unitPriceCell = row.getElementByClassName('unitPrice')[0];
        var totalPriceCell = row.getElementByClassName('totalPrice')[0];

        var quantity = quantityCell.innerText ? parseFloat(quantityCell.innerText) : null;
        var unitPrice = unitPriceCell.innerText ? parseFloat(unitPriceCell.innerText) : null;

        if (quantity && !unit)
    }

});