# Net Yield Return Calculator

A web application for calculating monthly net income and return on investment for rental properties over a 3-year period. The application provides both basic and advanced data-driven calculation modes, and includes an admin dashboard to view all simulation history.

## Features

### Basic Calculator
- Calculate monthly net income and monthly net return percentage over 3 years
- Input fields:
  - Property purchase price
  - Monthly rental amount
  - Annual rental fee
  - Prospect's email address
- Agency Commission Structure (automatically applied in calculations):
  - **First Year**: 30%
  - **Second Year**: 25%
  - **Third Year**: 20%
- Automatically saves simulations to the database

### Advanced Calculator (Data-Driven Mode)
- Enhanced calculation using property characteristics:
  - Surface area (m²) - range: 20-120
  - Number of bedrooms (1-5)
  - Location score (1-10)
- **Accounts for expected yearly occupancy rate** of the property based on property parameters and listing price
- Provides expected monthly net income and return based on predictive modeling that factors in realistic occupancy expectations
- Uses a proprietary formula to estimate annual paid price based on property attributes, which inherently accounts for expected occupancy rates

### Admin Dashboard
- View all simulations performed on the site
- Displays:
  - Creation timestamp
  - Prospect email address
  - Property purchase price
  - Monthly rental amount
  - Annual rental fee
  - Calculated average monthly net income (3 years)
  - Calculated monthly net return percentage (3 years)

> **Note:** In a production environment, the admin dashboard would typically be protected behind authentication and authorization mechanisms. However, authentication is out of scope for this proposal/exercise.

## Calculation Formulas

### Basic Calculation

**Monthly Net Income (3-Year Average):**
```
Monthly Net Income = (Three Year Rent - Three Year Fee - Three Year Commission) / 36
```

Where:
- Three Year Rent = Monthly Rent × 12 × 3
- Three Year Fee = Annual Fee × 3
- Three Year Commission = Monthly Rent × 12 × (0.30 + 0.25 + 0.20)

> **Note:** 36 is the number of months in 3 years (12 months × 3 years).

**Monthly Net Return:**
```
Monthly Net Return (%) = (Monthly Net Income / Purchase Price) × 100
```

### Advanced Data-Driven Calculation

**Annual Paid Price Estimation:**
```
Annual Paid Price = e^3.608 × surface_m²^0.285 × bedrooms^-0.043 × location_score^0.851 × (monthlyRent/30)^0.735
```

> **Note:** This formula is based on a log-log linear regression algorithm. You can read more about log-log linear regression [here](https://en.wikipedia.org/wiki/Log%E2%80%93log_plot).

**Expected Monthly Net Income (accounting for occupancy rate):**
```
Expected Monthly Net Income = (Three Year Income - Commission - Three Year Fees) / 36
```

Where:
- Three Year Income = Annual Paid Price × 3 (already accounts for expected occupancy)
- Commission = Annual Paid Price × (0.30 + 0.25 + 0.20)
- Three Year Fees = Annual Fee × 3

**Expected Monthly Net Return:**
```
Expected Monthly Net Return (%) = (Expected Monthly Net Income / Purchase Price) × 100
```