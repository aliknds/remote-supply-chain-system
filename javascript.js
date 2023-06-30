class Table {
    constructor(elementId, defaultUnitPrice) {
        this.table = document.getElementById(elementId);
        this.defaultUnitPrice = defaultUnitPrice;
        this.state = this.getInitialState();
        this.setupEventListeners();
    }

    getInitialState() {
        // Get the initial state from the DOM
        // This would be replaced with AJAX or similar in a real app
        const rows = Array.from(this.table.querySelectorAll('tr')).slice(0, -1);
        return rows.map(row => {
            const cells = row.children;
            return {
                quantity: parseFloat(cells[1].innerText) || 0,
                unitPrice: parseFloat(cells[2].innerText) || this.defaultUnitPrice,
                totalPrice: parseFloat(cells[3].innerText) || 0,
            };
        });
    }

    setupEventListeners() {
        this.table.addEventListener('focus', this.handleFocus, true);
        this.table.addEventListener('blur', this.handleBlur, true);
        this.table.addEventListener('input', this.handleInput);
        this.table.addEventListener('keyup', this.handleKeyup, true);
    }

    handleFocus = (event) => {
        if (this.isEditableCell(event.target)) {
            event.target.classList.add('focused');
        }
    }

    handleBlur = (event) => {
        if (this.isEditableCell(event.target)) {
            event.target.classList.remove('focused');
        }
    }

    handleInput = (event) => {
        if (this.isEditableCell(event.target)) {
            const cell = event.target;
            const row = cell.parentNode;
            const rowIndex = Array.from(this.table.children).indexOf(row);
            const state = this.state[rowIndex];
            if (cell.classList.contains('quantity')) {
                state.quantity = parseFloat(cell.innerText);
            } else {
                state.unitPrice = parseFloat(cell.innerText);
            }
            this.updateRow(row, state);
            this.updateTotal();
        }
    }

    handleKeyup = (event) => {
        if (this.isEditableCell(event.target) && event.target.innerText === '') {
            this.handleInput(event);
        }
    }

    updateRow(row, state) {
        row.children[2].innerText = state.unitPrice.toFixed(2);
        state.totalPrice = state.quantity * state.unitPrice;
        row.children[3].innerText = state.totalPrice.toFixed(2);
    }

    updateTotal() {
        const total = this.state.reduce((sum, row) => sum + row.totalPrice, 0);
        this.table.querySelector('tfoot td:last-child').innerText = total.toFixed(2);
    }

    isEditableCell(node) {
        return node.tagName === 'TD' && node.contentEditable === 'true';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Table('data-table', 14219.21);
});
