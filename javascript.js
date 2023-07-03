class Table {
  constructor(elementId, defaultUnitPrice) {
    this.table = document.getElementById(elementId);
    this.defaultUnitPrice = defaultUnitPrice;
    this.focusTracker = new Map();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.table.addEventListener("focus", this.handleFocus, true);
    this.table.addEventListener("blur", this.handleBlur, true);
    this.table.addEventListener("input", this.handleInput);
    this.table.addEventListener("keyup", this.handleKeyup, true);
  }

  handleFocus = (event) => {
    if (this.isEditableCell(event.target)) {
      event.target.style.backgroundColor = "lightblue";
      const caretPosition = this.focusTracker.get(event.target);
      if (caretPosition) {
        this.setCaretPosition(event.target, caretPosition);
      }
    }
  };

  handleBlur = (event) => {
    if (this.isEditableCell(event.target)) {
      event.target.style.backgroundColor = "";
      if (event.target.classList.contains("unit-price")) {
        const newUnitPrice = parseFloat(event.target.innerText);
        if (!isNaN(newUnitPrice)) {
          this.updateAllUnitPriceCells(newUnitPrice);
          this.updateTable();
        }
      } else if (event.target.classList.contains("quantity")) {
        this.updateTable();
      }
      this.focusTracker.set(event.target, this.getCaretPosition(event.target));
    }
  };

  handleInput = (event) => {
    if (this.isEditableCell(event.target)) {
      const cell = event.target;
      const row = cell.parentNode;
      if (cell.classList.contains("quantity")) {
        let quantity = parseFloat(cell.innerText);
        let unitPrice = parseFloat(row.querySelector(".unit-price").innerText);
        let totalPrice = quantity * unitPrice;
        row.querySelector(".total-price").innerText = isNaN(totalPrice)
          ? ""
          : totalPrice.toFixed(2);
        this.updateTotal();
      }
    }
  };

  handleQuantityInput = (event) => {
    if (
      this.isEditableCell(event.target) &&
      event.target.classList.contains("quantity")
    ) {
      const cell = event.target;
      const row = cell.parentNode;
      const rowIndex = Array.from(
        this.table.querySelectorAll("tbody tr")
      ).indexOf(row);
      const state = this.state[rowIndex];
      state.quantity = parseFloat(cell.innerText);
      this.updateRow(row, state);
      this.updateTotal();
    }
  };

  handleUnitPriceInput = (event) => {
    if (
      this.isEditableCell(event.target) &&
      event.target.classList.contains("unit-price")
    ) {
      const newUnitPrice = parseFloat(event.target.innerText);
      this.updateUnitPrices(newUnitPrice);
      this.updateTable();
    }
  };

  updateUnitPrices = (newUnitPrice) => {
    const rows = this.table.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
      const unitPriceCell = row.querySelector(".unit-price");
      unitPriceCell.innerText = newUnitPrice.toFixed(2);
    });
  };

  updateAllUnitPriceCells = (newUnitPrice) => {
    const rows = this.table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const unitPriceCell = row.getElementsByClassName("unit-price")[0];
      if (unitPriceCell) {
        unitPriceCell.innerText = newUnitPrice.toFixed(2);
      }
    });
  };

  handleKeyup = (event) => {
    if (this.isEditableCell(event.target) && event.target.innerText === "") {
      this.updateTable();
    }
  };

  updateTable() {
    const rows = Array.from(this.table.querySelectorAll("tbody tr"));
    let total = 0;

    rows.forEach((row) => {
      const quantityCell = row.getElementsByClassName("quantity")[0];
      const unitPriceCell = row.getElementsByClassName("unit-price")[0];
      const totalPriceCell = row.getElementsByClassName("total-price")[0];

      let quantity = parseFloat(quantityCell.innerText);
      let unitPrice = parseFloat(unitPriceCell.innerText);

      if (!unitPrice) {
        unitPriceCell.innerText = this.defaultUnitPrice;
        unitPrice = this.defaultUnitPrice;
      }

      if (!quantity) {
        quantityCell.innerText = "";
        totalPriceCell.innerText = "";
      } else {
        const totalPrice = quantity * unitPrice;
        totalPriceCell.innerText = totalPrice.toFixed(2);
        total += totalPrice;
      }
    });

    this.table.querySelector(
      "tbody tr:last-child td:last-child strong"
    ).innerText = total.toFixed(2);
  }

  isEditableCell(node) {
    return node.tagName === "TD" && node.contentEditable === "true";
  }

  getCaretPosition(editableDiv) {
    let caretPos = 0;
    if (window.getSelection) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableDiv);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretPos = preCaretRange.toString().length;
    }
    return caretPos;
  }

  setCaretPosition(editableDiv, pos) {
    const range = document.createRange();
    range.selectNodeContents(editableDiv);
    range.collapse(true);
    range.setEnd(editableDiv, pos);
    range.setStart(editableDiv, pos);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Table("data-table", 14219.21);
});
