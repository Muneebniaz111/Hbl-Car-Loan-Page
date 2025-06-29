// Initial values
let vehiclePrice = 200000;
let repayMonths = 48;
let securityDeposit = 40;

function updateValue(type, amount) {
    if (type === "price") {
        vehiclePrice = Math.max(50000, vehiclePrice + amount);
        document.getElementById("vehicle-price").innerText = vehiclePrice.toLocaleString();
    } else if (type === "months") {
        repayMonths = Math.max(12, repayMonths + amount);
        document.getElementById("repay-months").innerText = repayMonths;
    } else if (type === "deposit") {
        securityDeposit = Math.min(95, Math.max(5, securityDeposit + amount));
        document.getElementById("security-deposit").innerText = securityDeposit + "%";
    }

    calculateInstallment();
    if (typeof renderForecastChart === "function") {
        renderForecastChart();
    }
}

function calculateInstallment() {
    let depositAmount = (vehiclePrice * securityDeposit) / 100;
    let financedAmount = vehiclePrice - depositAmount;
    let interestRate = 0.10;
    let monthlyInterest = interestRate / 12;

    let emi = (financedAmount * monthlyInterest * Math.pow(1 + monthlyInterest, repayMonths)) /
              (Math.pow(1 + monthlyInterest, repayMonths) - 1);

    document.getElementById("monthly-installment").innerText = "PKR " + Math.round(emi).toLocaleString();
    document.getElementById("financed-amount").innerText = "PKR " + Math.round(financedAmount).toLocaleString();
    document.getElementById("deposit-amount").innerText = "PKR " + Math.round(depositAmount).toLocaleString();
}

function calculateMonthlyInstallment(financedAmount, months) {
    const monthlyRate = 0.10 / 12;
    return Math.round((financedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                      (Math.pow(1 + monthlyRate, months) - 1));
}

function generatePDF(name, account, installment, amount, deposit) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("HBL Loan Application Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Account Number: ${account}`, 20, 50);
    doc.text(`Monthly Installment: PKR ${formatCurrency(installment)}`, 20, 60);
    doc.text(`Financed Amount: PKR ${formatCurrency(amount)}`, 20, 70);
    doc.text(`Security Deposit: ${deposit}%`, 20, 80);

    doc.output('dataurlnewwindow');
}

function formatCurrency(num) {
    return num.toLocaleString();
}

window.onload = function () {
    calculateInstallment();

    // Optional: Call renderForecastChart if defined
    if (typeof renderForecastChart === "function") {
        renderForecastChart();
    }

    const applyBtn = document.querySelector('.apply');
    const infoBtn = document.querySelector('.info');

    if (applyBtn) {
        applyBtn.addEventListener('click', function () {
            const confirmed = confirm("Do you want to apply for the loan?");
            if (confirmed) {
                const name = prompt("Please enter your name:");
                const account = prompt("Please enter your account number:");
                if (name && account) {
                    const depositAmount = (vehiclePrice * securityDeposit) / 100;
                    const financedAmount = vehiclePrice - depositAmount;
                    const monthlyInstallment = calculateMonthlyInstallment(financedAmount, repayMonths);
                    generatePDF(name, account, monthlyInstallment, financedAmount, securityDeposit);
                } else {
                    alert("You need to provide both your name and account number.");
                }
            }
        });
    }

    if (infoBtn) {
        let pdfTab = null;
        infoBtn.addEventListener('click', function () {
            if (!pdfTab || pdfTab.closed) {
                pdfTab = window.open('HBL_CarLoan.pdf', '_blank');
            } else {
                pdfTab.focus();
            }
        });
    }
};
