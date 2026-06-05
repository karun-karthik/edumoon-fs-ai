# Personal Finance Tracker MVP - UI Wireframes

## Overview

This MVP includes the following core modules:

* Authentication
* Dashboard
* Account Management
* Transaction Tracking
* Budget Management
* Insights & Analytics
* Profile Settings

---

# 1. Login / Sign Up

## Login Screen

```text
+----------------------------------+
|          Budget Tracker          |
+----------------------------------+

  Email
  [_____________________]

  Password
  [_____________________]

  ( Login )

  ---------------------

  Don't have an account?

  ( Create Account )
```

## Sign Up Screen

```text
+----------------------------------+
|        Create Account            |
+----------------------------------+

  Full Name
  [_____________________]

  Email
  [_____________________]

  Password
  [_____________________]

  Confirm Password
  [_____________________]

  ( Sign Up )

  Already have an account?

  ( Login )
```

---

# 2. Dashboard

## Main Overview Screen

```text
+----------------------------------+
| Dashboard                        |
| Hello, John 👋                   |
+----------------------------------+

+------------------------------+
| Total Balance                |
| ₹ 1,25,000                   |
+------------------------------+

+-------------+ +-------------+
| Checking    | | Savings     |
| ₹ 45,000    | | ₹ 80,000    |
+-------------+ +-------------+

--------------------------------

Monthly Budget Progress

Groceries      ₹8k / ₹10k
████████░░

Transport      ₹2k / ₹5k
████░░░░░░

Entertainment  ₹4k / ₹3k
██████████ ⚠

--------------------------------

Recent Transactions

⬇ Grocery Store     ₹850
⬇ Fuel              ₹1,200
⬆ Salary            ₹50,000

--------------------------------

[Dashboard] [Accounts]
[+ Add] [Budget] [Profile]
```

### Components

* Total balance card
* Account summary cards
* Budget progress indicators
* Recent transactions list
* Bottom navigation

---

# 3. Account Management

## Accounts List Screen

```text
+----------------------------------+
| Accounts                         |
+----------------------------------+

( + Add Account )

--------------------------------

Checking Account
₹ 45,000

Savings Account
₹ 80,000

Credit Card
₹ -12,000

--------------------------------
```

## Add Account Modal

```text
+----------------------+
| Add Account          |
+----------------------+

Account Name
[____________]

Type
[ Checking ▼ ]

Current Balance
[____________]

( Save )
```

### Account Types

* Checking
* Savings
* Credit Card
* Cash Wallet

---

# 4. Transaction Tracking

## Transactions List

```text
+----------------------------------+
| Transactions                     |
+----------------------------------+

[ Search ]

Category ▼
Date ▼

--------------------------------

03 Jun
Groceries            ₹850

03 Jun
Fuel                 ₹1,200

02 Jun
Salary              ₹50,000

--------------------------------

( + Add Transaction )
```

## Add Transaction

```text
+----------------------------------+
| Add Transaction                  |
+----------------------------------+

Amount
[____________]

Type
( ) Expense
( ) Income

Category
[ Groceries ▼ ]

Date
[ 03 Jun 2026 ]

Description
[____________]

Account
[ Checking ▼ ]

( Save )
```

### Transaction Fields

| Field       | Required |
| ----------- | -------- |
| Amount      | Yes      |
| Type        | Yes      |
| Category    | Yes      |
| Date        | Yes      |
| Description | No       |
| Account     | Yes      |

---

# 5. Categories & Budgeting

## Budget Overview

```text
+----------------------------------+
| Monthly Budgets                  |
+----------------------------------+

Month: June 2026 ▼

--------------------------------

Groceries
Budget: ₹10,000
Spent : ₹8,000

[ Edit ]

--------------------------------

Transport
Budget: ₹5,000
Spent : ₹2,000

[ Edit ]

--------------------------------

( + Add Budget )
```

## Set Budget Modal

```text
+----------------------+
| Set Budget           |
+----------------------+

Category
[ Groceries ▼ ]

Monthly Limit
[ 10000 ]

( Save )
```

### Default Categories

* Groceries
* Rent
* Utilities
* Transportation
* Entertainment
* Dining
* Shopping
* Healthcare
* Education
* Miscellaneous

---

# 6. Insights & Analytics

## Spending Breakdown

```text
+----------------------------------+
| Insights                         |
+----------------------------------+

Spending by Category

      Pie Chart
   (Visualization)

--------------------------------

Top Categories

1. Groceries      ₹8,000
2. Rent          ₹15,000
3. Transport      ₹2,000
```

## Monthly Trend

```text
--------------------------------

Monthly Trend

Jan  ████
Feb  ██████
Mar  ████████
Apr  █████
May  ███████

(Line / Bar Chart)

--------------------------------
```

## Available Insights

* Spending by category
* Monthly spending trend
* Highest spending category
* Budget utilization
* Account balance overview

---

# 7. Profile Settings

```text
+----------------------------------+
| Profile Settings                 |
+----------------------------------+

Name
[ John Doe ]

Email
[ john@email.com ]

Currency
[ INR ▼ ]

Theme
[ Light ▼ ]

--------------------------------

( Save Changes )

( Logout )
```

---

# Navigation Structure

```text
Login
  │
  ▼
Dashboard
  ├── Accounts
  │     └── Add Account
  │
  ├── Transactions
  │     └── Add Transaction
  │
  ├── Budget
  │     └── Set Budget
  │
  ├── Insights
  │
  └── Profile
```

---

# Bottom Navigation

```text
┌─────────────────────────────┐
│ Dashboard                   │
├─────────────────────────────┤
│                             │
│      Screen Content         │
│                             │
├─────────────────────────────┤
│ Home | Txns | + | Budget | Me│
└─────────────────────────────┘
```

---

# MVP Feature Mapping

| Feature                  | Screen             |
| ------------------------ | ------------------ |
| Sign Up / Login          | Authentication     |
| Account Balance Entry    | Accounts           |
| Account Overview         | Dashboard          |
| Manual Transaction Entry | Transactions       |
| Transaction History      | Transactions       |
| Categories               | Budget             |
| Monthly Budget Setup     | Budget             |
| Budget vs Actual         | Dashboard + Budget |
| Spending Breakdown       | Insights           |
| Monthly Trends           | Insights           |
| Profile Settings         | Profile            |

---

# Recommended Tech Stack

## Frontend

* React
* Next.js
* Tailwind CSS
* Recharts (Charts)

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT Authentication

## Deployment

* Vercel (Frontend)
* Railway / Render (Backend)
* Supabase / PostgreSQL
