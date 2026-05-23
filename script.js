<<<<<<< HEAD
// ─── State ────────────────────────────────────
let vehiclePrice  = 200000;
let repayMonths   = 48;
let securityDeposit = 40;

// ─── Tab Switcher ─────────────────────────────
function switchTab(el) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ─── Update Value ─────────────────────────────
function updateValue(type, amount) {
  if (type === 'price') {
    vehiclePrice = Math.min(10000000, Math.max(50000, vehiclePrice + amount));
    const el = document.getElementById('vehicle-price');
    el.innerText = vehiclePrice.toLocaleString();
    animatePulse(el);
    // progress: 50k–10M
    const pct = ((vehiclePrice - 50000) / (10000000 - 50000)) * 100;
    document.getElementById('price-bar').style.width = pct + '%';

  } else if (type === 'months') {
    repayMonths = Math.min(84, Math.max(12, repayMonths + amount));
    const el = document.getElementById('repay-months');
    el.innerText = repayMonths;
    animatePulse(el);
    const pct = ((repayMonths - 12) / (84 - 12)) * 100;
    document.getElementById('months-bar').style.width = pct + '%';

  } else if (type === 'deposit') {
    securityDeposit = Math.min(95, Math.max(5, securityDeposit + amount));
    const el = document.getElementById('security-deposit');
    el.innerText = securityDeposit + '%';
    animatePulse(el);
    const pct = ((securityDeposit - 5) / (95 - 5)) * 100;
    document.getElementById('deposit-bar').style.width = pct + '%';
  }

  calculateInstallment();

  if (typeof renderForecastChart === 'function') {
    renderForecastChart();
  }
}

// ─── Pulse Animation ──────────────────────────
function animatePulse(el) {
  el.classList.remove('pulse');
  void el.offsetWidth; // reflow
  el.classList.add('pulse');
}

// ─── EMI Calculation ──────────────────────────
function calculateInstallment() {
  const depositAmount  = (vehiclePrice * securityDeposit) / 100;
  const financedAmount = vehiclePrice - depositAmount;
  const interestRate   = 0.10;
  const monthlyRate    = interestRate / 12;

  const emi = (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, repayMonths)) /
              (Math.pow(1 + monthlyRate, repayMonths) - 1);

  setResultText('monthly-installment', Math.round(emi));
  setResultText('financed-amount',     Math.round(financedAmount));
  setResultText('deposit-amount',      Math.round(depositAmount));
}

function setResultText(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = Math.round(val).toLocaleString();
    animatePulse(el);
  }
}

// ─── Helper: Calculate EMI ────────────────────
function calculateMonthlyInstallment(financedAmount, months) {
  const monthlyRate = 0.10 / 12;
  return Math.round(
    (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function formatCurrency(num) {
  return Number(num).toLocaleString();
}

// ─── Modal ────────────────────────────────────
function openModal() {
  const depositAmount  = (vehiclePrice * securityDeposit) / 100;
  const financedAmount = vehiclePrice - depositAmount;
  const emi = calculateMonthlyInstallment(financedAmount, repayMonths);

  // Populate summary
  document.getElementById('ms-emi').innerText      = 'PKR ' + formatCurrency(emi);
  document.getElementById('ms-financed').innerText = 'PKR ' + formatCurrency(Math.round(financedAmount));
  document.getElementById('ms-deposit').innerText  = 'PKR ' + formatCurrency(Math.round(depositAmount));
  document.getElementById('ms-months').innerText   = repayMonths + ' months';

  document.getElementById('apply-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('apply-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function submitApplication() {
  const name    = document.getElementById('applicant-name').value.trim();
  const account = document.getElementById('applicant-account').value.trim();

  if (!name || !account) {
    showToast('Please enter both your name and account number.');
    return;
  }

  const depositAmount  = (vehiclePrice * securityDeposit) / 100;
  const financedAmount = vehiclePrice - depositAmount;
  const emi = calculateMonthlyInstallment(financedAmount, repayMonths);

  generatePDF(name, account, emi, financedAmount, securityDeposit);
  closeModal();
  showToast('PDF generated successfully!');
}

// ─── PDF Generation ───────────────────────────
function generatePDF(name, account, installment, amount, deposit) {
  if (!window.jspdf) {
    showToast('PDF library not loaded. Please check your connection.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(6, 84, 62);
  doc.text('HBL Car Loan Application', 20, 24);

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Generated: ' + new Date().toLocaleDateString('en-PK', { dateStyle: 'long' }), 20, 32);

  doc.setDrawColor(6, 84, 62);
  doc.setLineWidth(0.5);
  doc.line(20, 36, 190, 36);

  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  const rows = [
    ['Applicant Name',    name],
    ['Account Number',    account],
    ['Monthly EMI',       'PKR ' + formatCurrency(installment)],
    ['Financed Amount',   'PKR ' + formatCurrency(Math.round(amount))],
    ['Security Deposit',  deposit + '%'],
    ['Repayment Period',  repayMonths + ' months'],
    ['Annual Interest',   '10%'],
  ];

  let y = 50;
  rows.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.setTextColor(6, 84, 62);
    doc.text(label + ':', 20, y);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(value, 90, y);
    y += 12;
  });

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('* This is an estimate. Final terms subject to HBL approval.', 20, 200);

  doc.output('dataurlnewwindow');
}

// ─── Toast ────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ─── Init ─────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  calculateInstallment();

  // Initialize progress bars
  const priceBar = document.getElementById('price-bar');
  if (priceBar) {
    priceBar.style.width = ((vehiclePrice - 50000) / (10000000 - 50000)) * 100 + '%';
  }
  const monthsBar = document.getElementById('months-bar');
  if (monthsBar) {
    monthsBar.style.width = ((repayMonths - 12) / (84 - 12)) * 100 + '%';
  }
  const depositBar = document.getElementById('deposit-bar');
  if (depositBar) {
    depositBar.style.width = ((securityDeposit - 5) / (95 - 5)) * 100 + '%';
  }

  // Apply Now button → opens modal
  const applyBtn = document.querySelector('.apply');
  if (applyBtn) {
    applyBtn.addEventListener('click', openModal);
  }

  // More Info button → opens PDF
  const infoBtn = document.querySelector('.info');
  if (infoBtn) {
    let pdfTab = null;
    infoBtn.addEventListener('click', () => {
      if (!pdfTab || pdfTab.closed) {
        pdfTab = window.open('HBL_CarLoan.pdf', '_blank');
      } else {
        pdfTab.focus();
      }
    });
  }

  // Close modal on overlay click
  const overlay = document.getElementById('apply-modal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Keyboard: Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
=======
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
>>>>>>> b5ab4b1a347160b5572a6d1de1cfb6a9e8512a54
