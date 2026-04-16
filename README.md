# 💰 Cash Flow Minimizer — Bank Transaction Management System

A Python-based system to manage inter-bank transactions, analyze financial activity, predict cash flow, and minimize settlement transfers using optimized algorithms.

This project enables banks to efficiently track balances, understand transaction behavior, and reduce the number of required settlements.

---

## 🚀 Features

### 🏦 Bank & Transaction Management
- Add banks with supported payment types (credit/debit)
- Record transactions with timestamps
- Track real-time net balances
- Clear or manage specific transactions

---

### 📊 Analytics & Reporting
- Monthly financial summaries
- Bank statements with date filters
- Transaction statistics (totals & averages)
- Most active bank detection
- Top debtor & creditor identification

---

### 🤖 Predictive Insights
- Forecast future cash flow trends
- Estimate incoming and outgoing funds
- Analyze transaction patterns

---

### ⚖️ Cash Flow Minimization
- Identifies debtors and creditors
- Matches balances efficiently
- Minimizes number of settlement transactions
- Generates optimized transaction graph

---

### 🔍 Filtering & Querying
- Filter transactions by:
  - Date range
  - Amount range
  - Bank name or keywords
- Calculate interest on outstanding balances

---

## 🧩 Tech Stack

| Component        | Technology |
|----------------|----------|
| Language        | Python |
| Data Structures | Min Heap, Graph |
| Time Handling   | datetime |
| CLI Interface   | Interactive Menu |
| Frontend        | React + Vite + Tailwind CSS |
| Backend (Planned)| Python API |

---

## 🏃‍♂️ How to Run

### 🔧 Backend (Python CLI)

1. Install Python (3.8+ recommended)

2. Save the file as:
```
cashflow.py
```

3. Run the program:
```bash
python cashflow.py
```

4. Use the interactive CLI menu

---

### 🌐 Frontend (React)

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open in browser:
```
http://localhost:5173
```

---

## 🧠 Core Algorithm — Cash Flow Minimization

### ⚙️ Working:

1. Calculate net balance of each bank  
2. Separate:
   - Debtors (negative balance)
   - Creditors (positive balance)  
3. Use Min Heap / Priority Queue  
4. Match smallest debtor with largest creditor  
5. Repeat until all balances are settled  

---

### ✅ Benefits:
- Reduces total number of transactions  
- Optimizes settlement flow  
- Saves transaction costs  
- Improves financial efficiency  

---

## 📂 Project Structure

```
CashFlow-Minimizer/
│── cashFlow.py          # Backend logic (Python)
│── src/                 # React frontend
│   ├── components/      # UI components
│   ├── hooks/           # Custom hooks (useCashFlow)
│   ├── lib/             # Utility functions
│   └── pages/           # Application pages
│── package.json         # Node dependencies
│── vite.config.ts       # Vite config
└── tailwind.config.ts   # Tailwind CSS config
```

---

## 🛠 Development Timeline

### ✅ Completed
- Project setup with Vite + React + Tailwind CSS  
- TypeScript, ESLint, and Shadcn configuration  
- Base architecture and routing setup  
- Utility functions and global styles  

---

### 🚧 In Progress / Planned

#### 🎨 UI Development
- Reusable Shadcn UI components  
- Forms (Add Bank, Transactions)  
- Notifications & Modals  

#### ⚙️ Business Logic
- useCashFlow hook  
- Integration with Python backend  

#### 📊 Dashboard
- Analytics panels  
- Summary cards  
- Cash flow visualization graph  

#### 🗄 Backend Enhancements
- Database (SQLite / MongoDB)  
- API integration  
- Fraud / anomaly detection  

#### 📈 Advanced Features
- Charts & graphs  
- Export reports (PDF / Excel)  
- Real-time analytics  

---

## 🤝 Contributions

Contributions are welcome!

- Fork the repository  
- Create a feature branch  
- Submit a pull request  

---

## 📜 License

This project is open-source and intended for academic and learning purposes.

---

## 👤 Author

Kalyan  
Cash Flow Optimization System