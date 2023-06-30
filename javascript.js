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
            if (event.target.classList.contains('unit-price')) {
                const selection = this.saveSelection(event.target);
                const newUnitPrice = parseFloat(event.target.innerText) || this.defaultUnitPrice;
                const unitPriceCells = this.table.querySelectorAll('.unit-price');
                unitPriceCells.forEach(cell => {
                    cell.innerText = newUnitPrice.toFixed(2);
                });
                this.restoreSelection(event.target, selection);
            }
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
                const selection = this.saveSelection(unitPriceCell);
                unitPriceCell.innerText = this.defaultUnitPrice;
                unitPrice = this.defaultUnitPrice;
                this.restoreSelection(unitPriceCell, selection);
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

    saveSelection(element) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(element);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            const start = preSelectionRange.toString().length;

            return {
                start: start,
                end: start + range.toString().length
            };
        } else {
            return null;
        }
    }

    restoreSelection(element, savedSel) {
        let charIndex = 0;
        const range = document.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        const nodeStack = [element];
        let node;
        let foundStart = false;
        let stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                const nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Table('data-table', 14219.21);
});
