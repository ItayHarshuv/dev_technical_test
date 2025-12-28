# Net Yield Return Simulator Proposition

This project is a prototype proposal web interface for Emerald Stay website. It performs simulations to get the monthly net income and the return over the first 3 years.

Currently having the following functionality:

- Submitting purchase price of the property, monthly rent amount, annual rental fee and prospect's email address to receive the monthly net income and the return over the first 3 years, considering the management agency commission as well.

- An admin page, to check all the simulations that were done on the site.

- An advanced data-driven expected monthly net income and the return considering expected occupancy rate of the property when giving number of bedrooms, surface (m²) and property location score.

The calculation is performed in the following manner:

Agency commissions:
- First year: 30%
- Second year: 25%
- Third+ year: 20%

The formula for calculating the monthly net income:
```
Monthly Net Income = (Three Year Rent - Three Year Fee - Three Year Commission) / 36
```

The formula for calculating the monthly net return:
```
Monthly Net Return = (Monthly Net Income / Purchase Price) × 100
```

The formula for data-driven calculation is:
```
- Annual Paid Price = e^3.608 × surface_m²^0.285 × bedrooms^-0.043 × location_score^0.851 × (monthlyRent/30)^0.735
- Expected Monthly Net Return = (Expected Monthly Net Income / Purchase Price) × 100
```
