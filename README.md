# 🚗 HBL Car Loan Calculator

This is a **web-based Car Loan Calculator** designed to simulate the experience of applying for a car loan at **Habib Bank Limited (HBL)**. Users can input details such as vehicle price, down payment (security deposit), loan tenure, and explore EMI (Equated Monthly Installment) forecasts under different interest rate scenarios.

## 🌟 Features

- 🔢 **Interactive Calculator** for vehicle price, loan tenure, and deposit.
- 📊 **Real-time EMI calculation** and breakdown of financed and deposit amounts.
- 📉 **AI-based EMI Forecast Chart** for static, increasing, and decreasing interest rates.
- 🖨️ **PDF generation** for loan application details.
- 🚘 Stylish UI with car visuals and intuitive controls.
- 📂 Fully responsive and written in plain HTML, CSS, and JavaScript (no frameworks required).

## 📁 Project Structure

```bash
HBL-Car-Loan-Calculator/
│
├── index.html         # Main Loan Calculator Interface
├── style.css          # Custom Styles
├── script.js          # Core Logic and Interactivity
├── EMIs.html          # EMI Forecast Chart (AI-based)
├── car.png            # Car image used in UI
├── Arrow.png          # Up arrow for controls
├── Down-Arrow.png     # Down arrow for controls
├── tabler_arrow-up.png# Button arrow icon
├── vector-pattern.png # Background overlay
└── HBL_CarLoan.pdf    # PDF file linked in 'More Info' (optional)
````

1. **Clone the Repository:**

git clone https://github.com/Muneebniaz111/Hbl-Car-Loan-Page.git
cd Hbl-Car-Loan-Page


2. **Open `index.html` in your browser.**

3. **Interact with the controls:**

   * Adjust vehicle price, tenure, and security deposit.
   * Click “Apply Now” to generate a PDF summary.
   * Click “Predict Future EMIs” to open an EMI forecast chart.

## 📈 EMI Forecast Chart

The **EMIs.html** file allows users to visualize projected monthly EMI changes over 5 years under three scenarios:

* **Static:** Constant 10% interest
* **Increase:** +1% per year
* **Decrease:** -1% per year (minimum 1%)

Built using [Chart.js](https://www.chartjs.org/) for dynamic, responsive charts.

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla)
* [Chart.js](https://cdn.jsdelivr.net/npm/chart.js)
* [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙌 Acknowledgements

* Inspired by HBL’s car financing options.
* Icons and assets used are for educational/demonstration purposes only.

---

**🔗 Author:** \[Muneeb Niaz]
**🌐 GitHub:** ((https://github.com/Muneebniaz111/Hbl-Car-Loan-Page.git))

```
