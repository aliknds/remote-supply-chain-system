class Table {
    constructor(elementId, defaultUnitPrice) {
        this.table = document.getElementById(elementId);
        this.defaultUnitPrice = defaultUnitPrice;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.table.addEventListener('focus', this.handleFocus, true);
        this.table.addEventListener('blur', this.handleBlur, true);
        this.table.addEventListener('input', this.handleInput);
        this.table.addEventListener('keyup', this.handleKeyup, true);
    }

    handleFocus = (event) => {
        if (this.isEditableCell(event.target)) {
            event.target.style.backgroundColor = 'lightblue';
        }
    }

    handleBlur = (event) => {
        if (this.isEditableCell(event.target)) {
            event.target.style.backgroundColor = '';
            this.updateTable();
        }
    }

    handleInput = (event) => {
        if (this.isEditableCell(event.target)) {
            this.updateTable();
        }
    }

    handleKeyup = (event) => {
        if (this.isEditableCell(event.target) && event.target.innerText === '') {
            this.updateTable();
        }
    }

    updateTable() {
        const rows = Array.from(this.table.querySelectorAll('tbody tr'));
        let total = 0;

        rows.forEach(row => {
            const quantityCell = row.getElementsByClassName('quantity')[0];
            const unitPriceCell = row.getElementsByClassName('unit-price')[0];
            const totalPriceCell = row.getElementsByClassName('total-price')[0];

            let quantity = parseFloat(quantityCell.innerText);
            let unitPrice = parseFloat(unitPriceCell.innerText);

            if (!unitPrice) {
                unitPriceCell.innerText = this.defaultUnitPrice;
                unitPrice = this.defaultUnitPrice;
            }

            if (!quantity) {
                quantityCell.innerText = '';
                totalPriceCell.innerText = '';
            } else {
                const totalPrice = quantity * unitPrice;
                totalPriceCell.innerText = totalPrice.toFixed(2);
                total += totalPrice;
            }
        });

        this.table.querySelector('tbody tr:last-child td:last-child strong').innerText = total.toFixed(2);
    }

    isEditableCell(node) {
        return node.tagName === 'TD' && node.contentEditable === 'true';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Table('data-table', 14219.21);
});
