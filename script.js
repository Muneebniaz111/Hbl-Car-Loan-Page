// Initial values
let vehiclePrice = 200000;
let repayMonths = 48;
let securityDeposit = 40;

// Function to update values based on input
function updateValue(type, amount) {
    if (type === "price") {
        vehiclePrice = Math.max(50000, vehiclePrice + amount); // Min value set to 50,000
        document.getElementById("vehicle-price").innerText = vehiclePrice.toLocaleString();
    } else if (type === "months") {
        repayMonths = Math.max(12, repayMonths + amount); // Min 12 months
        document.getElementById("repay-months").innerText = repayMonths;
    } else if (type === "deposit") {
        securityDeposit = Math.max(5, securityDeposit + amount); // Min 5%
        document.getElementById("security-deposit").innerText = securityDeposit + "%";
    }

    calculateInstallment();
}

// Function to calculate the installment
function calculateInstallment() {
    let depositAmount = (vehiclePrice * securityDeposit) / 100;
    let financedAmount = vehiclePrice - depositAmount;
    let interestRate = 0.10; // 10% annual interest
    let monthlyInterest = interestRate / 12;
    
    // EMI formula: [ P * r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
    let emi = (financedAmount * monthlyInterest * Math.pow(1 + monthlyInterest, repayMonths)) / 
              (Math.pow(1 + monthlyInterest, repayMonths) - 1);

    // Update the displayed values
    document.getElementById("monthly-installment").innerText = "PKR " + emi.toLocaleString(undefined, {maximumFractionDigits: 0});
    document.getElementById("financed-amount").innerText = "PKR " + financedAmount.toLocaleString();
    document.getElementById("deposit-amount").innerText = "PKR " + depositAmount.toLocaleString();
}

// Initial calculation
calculateInstallment();

// Function to show an alert message when a button is clicked
function showMessage(buttonType) {
    if (buttonType === "apply") {
        alert("The Apply Now feature is not yet functional.");
    } else if (buttonType === "info") {
        alert("The More Info feature is not yet functional.");
    }
}

document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", function () {
        if (this.classList.contains("active")) {
            alert("Displaying!");
        } else {
            alert("This feature is currently not functional.");
        }
    });
});

// Create a global variable to track if the PDF is already opened
let pdfTab = null;

// Function to show PDF on "More Info" button click
function showMessage(messageType) {
    if (messageType === 'info') {
        if (!pdfTab || pdfTab.closed) {
            // Open the PDF file in a new tab only if it's not already opened or closed
            pdfTab = window.open('HBL_CarLoan.pdf', '_blank');
        } else {
            // If the PDF tab is already open, bring it to focus
            pdfTab.focus();
        }
    }
}

// Attach the showMessage function to the "More Info" button's onclick event
document.querySelector('.info').addEventListener('click', function() {
    showMessage('info');
});

// Get the necessary elements
const applyButton = document.querySelector('.apply');

// Event listener for the "Apply Now" button
applyButton.addEventListener('click', function() {
    // Step 1: Show confirmation message
    const userConfirmed = confirm("Do you want to apply for the loan?");

    if (userConfirmed) {
        // Step 2: Take user inputs (Name, Account Number)
        const userName = prompt("Please enter your name:");
        const userAccountNumber = prompt("Please enter your account number:");

        if (userName && userAccountNumber) {
            // Step 3: Calculate loan details
            const financedAmount = vehiclePrice * (1 - securityDeposit / 100);
            const monthlyInstallment = calculateMonthlyInstallment(financedAmount, repayMonths);

            // Step 4: Generate PDF
            generatePDF(userName, userAccountNumber, monthlyInstallment, financedAmount, securityDeposit);
        } else {
            alert("You need to provide both your name and account number.");
        }
    }
});

// Function to calculate monthly installment using a simple formula
function calculateMonthlyInstallment(financedAmount, months) {
    const interestRate = 0.10; // Example interest rate (10%)
    const monthlyInterestRate = interestRate / 12;
    const monthlyInstallment = (financedAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months));
    return Math.round(monthlyInstallment);
}

// Function to generate PDF
function generatePDF(name, accountNumber, monthlyInstallment, financedAmount, depositPercentage) {
    const { jsPDF } = window.jspdf; // Get jsPDF constructor

    const doc = new jsPDF();
    
    // Set up the PDF content
    doc.setFontSize(18);
    doc.text("Loan Application Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Account Number: ${accountNumber}`, 20, 50);
    doc.text(`Monthly Installment: PKR ${formatCurrency(monthlyInstallment)}`, 20, 60);
    doc.text(`Financed Amount: PKR ${formatCurrency(financedAmount)}`, 20, 70);
    doc.text(`Security Deposit: ${depositPercentage}%`, 20, 80);

    // Display the PDF in the browser
    doc.output('dataurlnewwindow'); // Opens the PDF in a new browser window/tab
}

// Helper function to format numbers as currency
function formatCurrency(amount) {
    return amount.toLocaleString();
}

// Example of how to update the vehicle price, repayment months, and security deposit
// You can use buttons or sliders to call updateValue()
document.getElementById("increase-price").addEventListener("click", function() {
    updateValue("price", 5000); // Increase price by 5000
});

document.getElementById("decrease-price").addEventListener("click", function() {
    updateValue("price", -5000); // Decrease price by 5000
});

document.getElementById("increase-months").addEventListener("click", function() {
    updateValue("months", 1); // Increase repayment months by 1
});

document.getElementById("decrease-months").addEventListener("click", function() {
    updateValue("months", -1); // Decrease repayment months by 1
});

document.getElementById("increase-deposit").addEventListener("click", function() {
    updateValue("deposit", 1); // Increase security deposit by 1%
});

document.getElementById("decrease-deposit").addEventListener("click", function() {
    updateValue("deposit", -1); // Decrease security deposit by 1%
});
