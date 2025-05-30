export const getNextInvoiceNumber = (): string => {
    const currentYear = new Date().getFullYear();
    const storedInvoiceNumber = localStorage.getItem("invoiceCounter");

    let nextNumber = 1;
    if (storedInvoiceNumber) {
        const [storedYear, storedCount] = storedInvoiceNumber.split("-");
        if (parseInt(storedYear) === currentYear) {
            nextNumber = parseInt(storedCount);
        }
    }

    return `${currentYear}-${String(nextNumber).padStart(4, "0")}`;
};
