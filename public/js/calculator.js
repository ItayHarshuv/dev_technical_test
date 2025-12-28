"use strict";
var ValidationErrorCode;
(function (ValidationErrorCode) {
    ValidationErrorCode["REQUIRED_FIELD"] = "REQUIRED_FIELD";
    ValidationErrorCode["INVALID_NUMBER"] = "INVALID_NUMBER";
    ValidationErrorCode["INVALID_EMAIL"] = "INVALID_EMAIL";
    ValidationErrorCode["NEGATIVE_NUMBER"] = "NEGATIVE_NUMBER";
    ValidationErrorCode["ZERO_VALUE"] = "ZERO_VALUE";
    ValidationErrorCode["SURFACE_OUT_OF_RANGE"] = "SURFACE_OUT_OF_RANGE";
    ValidationErrorCode["BEDROOMS_OUT_OF_RANGE"] = "BEDROOMS_OUT_OF_RANGE";
    ValidationErrorCode["LOCATION_SCORE_OUT_OF_RANGE"] = "LOCATION_SCORE_OUT_OF_RANGE";
    ValidationErrorCode["INVALID_INTEGER"] = "INVALID_INTEGER";
})(ValidationErrorCode || (ValidationErrorCode = {}));
class Calculator {
    constructor() {
        this.resultsContainer = document.getElementById('resultsContainer');
        this.initializeForms();
        this.initializeDataDrivenToggle();
    }
    initializeForms() {
        // Desktop form
        const desktopForm = document.getElementById('calculatorForm');
        if (desktopForm) {
            desktopForm.addEventListener('submit', (e) => this.handleSubmit(e, desktopForm));
            this.attachFieldValidators(desktopForm);
            this.attachDataDrivenValidators('Desktop', desktopForm);
        }
        // Modal form
        const modalForm = document.getElementById('calculatorFormModal');
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => this.handleSubmit(e, modalForm));
            this.attachFieldValidators(modalForm);
            this.attachDataDrivenValidators('Modal', modalForm);
        }
    }
    initializeDataDrivenToggle() {
        // Desktop toggle
        const desktopToggle = document.getElementById('dataDrivenToggleDesktop');
        const desktopFields = document.getElementById('dataDrivenFieldsDesktop');
        if (desktopToggle && desktopFields) {
            desktopToggle.addEventListener('click', () => {
                const isVisible = !desktopFields.classList.contains('d-none');
                if (isVisible) {
                    desktopFields.classList.add('d-none');
                    this.clearDataDrivenFields('Desktop');
                }
                else {
                    desktopFields.classList.remove('d-none');
                    this.setDataDrivenFieldsRequired('Desktop', true);
                }
            });
        }
        // Modal toggle
        const modalToggle = document.getElementById('dataDrivenToggleModal');
        const modalFields = document.getElementById('dataDrivenFieldsModal');
        if (modalToggle && modalFields) {
            modalToggle.addEventListener('click', () => {
                const isVisible = !modalFields.classList.contains('d-none');
                if (isVisible) {
                    modalFields.classList.add('d-none');
                    this.clearDataDrivenFields('Modal');
                }
                else {
                    modalFields.classList.remove('d-none');
                    this.setDataDrivenFieldsRequired('Modal', true);
                }
            });
        }
    }
    attachDataDrivenValidators(suffix, form) {
        const surfaceField = document.getElementById(`surface${suffix}`);
        const bedroomsField = document.getElementById(`bedrooms${suffix}`);
        const locationScoreField = document.getElementById(`locationScore${suffix}`);
        if (surfaceField) {
            surfaceField.addEventListener('blur', () => this.validateField(surfaceField, form));
            surfaceField.addEventListener('input', () => this.clearFieldError(surfaceField));
        }
        if (bedroomsField) {
            bedroomsField.addEventListener('change', () => this.validateField(bedroomsField, form));
            bedroomsField.addEventListener('change', () => this.clearFieldError(bedroomsField));
        }
        if (locationScoreField) {
            locationScoreField.addEventListener('blur', () => this.validateField(locationScoreField, form));
            locationScoreField.addEventListener('input', () => this.clearFieldError(locationScoreField));
        }
    }
    clearDataDrivenFields(suffix) {
        const surfaceField = document.getElementById(`surface${suffix}`);
        const bedroomsField = document.getElementById(`bedrooms${suffix}`);
        const locationScoreField = document.getElementById(`locationScore${suffix}`);
        if (surfaceField) {
            surfaceField.value = '';
            this.clearFieldError(surfaceField);
            surfaceField.removeAttribute('required');
        }
        if (bedroomsField) {
            bedroomsField.value = '';
            this.clearFieldError(bedroomsField);
            bedroomsField.removeAttribute('required');
        }
        if (locationScoreField) {
            locationScoreField.value = '';
            this.clearFieldError(locationScoreField);
            locationScoreField.removeAttribute('required');
        }
    }
    setDataDrivenFieldsRequired(suffix, required) {
        const surfaceField = document.getElementById(`surface${suffix}`);
        const bedroomsField = document.getElementById(`bedrooms${suffix}`);
        const locationScoreField = document.getElementById(`locationScore${suffix}`);
        if (surfaceField) {
            if (required) {
                surfaceField.setAttribute('required', 'required');
            }
            else {
                surfaceField.removeAttribute('required');
            }
        }
        if (bedroomsField) {
            if (required) {
                bedroomsField.setAttribute('required', 'required');
            }
            else {
                bedroomsField.removeAttribute('required');
            }
        }
        if (locationScoreField) {
            if (required) {
                locationScoreField.setAttribute('required', 'required');
            }
            else {
                locationScoreField.removeAttribute('required');
            }
        }
    }
    attachFieldValidators(form) {
        const fields = form.querySelectorAll('input[required], select[required]');
        fields.forEach(field => {
            if (field.tagName === 'INPUT') {
                field.addEventListener('blur', () => this.validateField(field, form));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
            else if (field.tagName === 'SELECT') {
                field.addEventListener('change', () => this.validateField(field, form));
                field.addEventListener('change', () => this.clearFieldError(field));
            }
        });
    }
    validateField(field, form) {
        const fieldName = field.name;
        const value = field.value.trim();
        const isModal = form.id === 'calculatorFormModal';
        const isRequired = field.hasAttribute('required');
        // Clear previous error
        this.clearFieldError(field);
        // Check if field is empty and required
        if (isRequired && !value) {
            const error = {
                code: ValidationErrorCode.REQUIRED_FIELD,
                message: 'This field is required',
                field: fieldName
            };
            this.displayFieldError(field, error, isModal);
            return error;
        }
        // Skip validation if field is empty and not required
        if (!value) {
            return null;
        }
        // Validate based on field type and name
        if (field.tagName === 'SELECT') {
            // Validate bedrooms (must be 1-4)
            if (fieldName === 'bedrooms') {
                const bedroomsValue = parseInt(value);
                if (isNaN(bedroomsValue) || bedroomsValue < 1 || bedroomsValue > 4) {
                    const error = {
                        code: ValidationErrorCode.BEDROOMS_OUT_OF_RANGE,
                        message: 'Please select a number of bedrooms between 1 and 4',
                        field: fieldName
                    };
                    this.displayFieldError(field, error, isModal);
                    return error;
                }
            }
        }
        else if (field.tagName === 'INPUT') {
            const inputField = field;
            if (inputField.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    const error = {
                        code: ValidationErrorCode.INVALID_EMAIL,
                        message: 'Please enter a valid email address',
                        field: fieldName
                    };
                    this.displayFieldError(inputField, error, isModal);
                    return error;
                }
            }
            else if (inputField.type === 'number') {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    const error = {
                        code: ValidationErrorCode.INVALID_NUMBER,
                        message: 'Please enter a valid number',
                        field: fieldName
                    };
                    this.displayFieldError(inputField, error, isModal);
                    return error;
                }
                // Validate surface (20-120)
                if (fieldName === 'surface') {
                    if (numValue < 20 || numValue > 120) {
                        const error = {
                            code: ValidationErrorCode.SURFACE_OUT_OF_RANGE,
                            message: 'Surface must be between 20 and 120 m²',
                            field: fieldName
                        };
                        this.displayFieldError(inputField, error, isModal);
                        return error;
                    }
                }
                // Validate location score (5-10)
                else if (fieldName === 'locationScore') {
                    if (numValue < 5 || numValue > 10) {
                        const error = {
                            code: ValidationErrorCode.LOCATION_SCORE_OUT_OF_RANGE,
                            message: 'Location score must be between 5.0 and 10.0',
                            field: fieldName
                        };
                        this.displayFieldError(inputField, error, isModal);
                        return error;
                    }
                }
                // Validate other number fields
                else {
                    if (numValue < 0) {
                        const error = {
                            code: ValidationErrorCode.NEGATIVE_NUMBER,
                            message: 'Please enter a positive number',
                            field: fieldName
                        };
                        this.displayFieldError(inputField, error, isModal);
                        return error;
                    }
                    if (numValue === 0) {
                        const error = {
                            code: ValidationErrorCode.ZERO_VALUE,
                            message: 'Please enter a value greater than zero',
                            field: fieldName
                        };
                        this.displayFieldError(inputField, error, isModal);
                        return error;
                    }
                }
            }
        }
        return null;
    }
    displayFieldError(field, error, isModal) {
        // Add error class to field
        field.classList.add('is-invalid');
        // Create or update error message element
        let errorElement = field.parentElement?.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentElement?.appendChild(errorElement);
        }
        errorElement.textContent = error.message;
        errorElement.setAttribute('data-error-code', error.code);
    }
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentElement?.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }
    validateForm(form) {
        const errors = [];
        const fields = form.querySelectorAll('input[required], select[required]');
        fields.forEach(field => {
            const error = this.validateField(field, form);
            if (error) {
                errors.push(error);
            }
        });
        return errors;
    }
    handleSubmit(event, form) {
        event.preventDefault();
        // Validate all fields
        const errors = this.validateForm(form);
        if (errors.length > 0) {
            // Focus on first error field
            const firstErrorField = form.querySelector('.is-invalid');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }
        const formDataObj = new FormData(form);
        const data = {
            purchasePrice: parseFloat(formDataObj.get('purchasePrice')),
            monthlyRent: parseFloat(formDataObj.get('monthlyRent')),
            annualFee: parseFloat(formDataObj.get('annualFee')),
            email: formDataObj.get('email')
        };
        // Add optional data driven analysis fields if they exist
        const surface = formDataObj.get('surface');
        const bedrooms = formDataObj.get('bedrooms');
        const locationScore = formDataObj.get('locationScore');
        if (surface) {
            data.surface = parseFloat(surface);
        }
        if (bedrooms) {
            data.bedrooms = parseInt(bedrooms);
        }
        if (locationScore) {
            data.locationScore = parseFloat(locationScore);
        }
        this.displayResults(data);
        // Close modal if it's open
        const modalElement = document.getElementById('calculatorModal');
        if (modalElement) {
            // Access Bootstrap modal through window object
            const bootstrapModal = window.bootstrap?.Modal;
            if (bootstrapModal) {
                const modal = bootstrapModal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    async saveSimulation(data) {
        try {
            const response = await fetch('/api/simulations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyPurchasePrice: data.purchasePrice,
                    monthlyRentalAmount: data.monthlyRent,
                    annualRentalFee: data.annualFee,
                    prospectEmailAddress: data.email
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to save simulation:', errorData);
            }
        }
        catch (error) {
            console.error('Error saving simulation:', error);
        }
    }
    displayResults(data) {
        if (!this.resultsContainer) {
            return;
        }
        // Calculate annual rent
        const threeYearRent = data.monthlyRent * 12 * 3;
        const threeYearFee = data.annualFee * 3;
        const threeYearCommission = (data.monthlyRent * 12) * (0.3 + 0.25 + 0.2);
        const threeYearMonthlyAverageNetIncome = (threeYearRent - threeYearFee - threeYearCommission) / 36;
        const monthlyNetReturnForThreeYears = (threeYearMonthlyAverageNetIncome / data.purchasePrice) * 100;
        // Calculate Expected Monthly Net Income if data-driven analysis fields are present
        let expectedMonthlyNetIncome = null;
        let expectedMonthlyNetReturn = null;
        if (data.surface && data.bedrooms && data.locationScore) {
            // Calculate annual_paid_price using the formula:
            // annual_paid_price ≈ e^3.608 * surface_m2^0.285 * bedrooms^-0.043 * location_score^0.851 * avg_listed_price^0.735
            const annualPaidPrice = Math.exp(3.608)
                * Math.pow(data.surface, 0.285)
                * Math.pow(data.bedrooms, -0.043)
                * Math.pow(data.locationScore, 0.851)
                * Math.pow(data.monthlyRent / 30, 0.735);
            // Calculate expected monthly net income over 3 years:
            // Following the same pattern as the existing calculation:
            // - Total income over 3 years: annual_paid_price * 3
            // - Commission (on one year's income, similar to existing pattern): annual_paid_price * (0.3 + 0.25 + 0.2)
            // - Fees over 3 years: 3 * annualFee
            // - Monthly net income: (total_income - commission - fees) / 36
            const commissionRate = 0.3 + 0.25 + 0.2; // 0.75
            const threeYearIncome = annualPaidPrice * 3;
            const commission = annualPaidPrice * commissionRate; // Commission on one year, matching existing pattern
            const threeYearFeeTotal = data.annualFee * 3;
            const threeYearNetIncome = threeYearIncome - commission - threeYearFeeTotal;
            expectedMonthlyNetIncome = threeYearNetIncome / 36;
            // Calculate expected monthly net return percentage
            expectedMonthlyNetReturn = (expectedMonthlyNetIncome / data.purchasePrice) * 100;
        }
        // Populate the existing elements in the partial
        const averageMonthlyNetIncomeEl = document.getElementById('averageMonthlyNetIncome');
        const monthlyNetReturnEl = document.getElementById('monthlyNetReturn');
        const expectedIncomeSectionEl = document.getElementById('expectedIncomeSection');
        const expectedMonthlyNetIncomeEl = document.getElementById('expectedMonthlyNetIncome');
        const expectedMonthlyNetReturnEl = document.getElementById('expectedMonthlyNetReturn');
        if (averageMonthlyNetIncomeEl) {
            averageMonthlyNetIncomeEl.textContent = `$${threeYearMonthlyAverageNetIncome.toFixed(2)}`;
        }
        if (monthlyNetReturnEl) {
            monthlyNetReturnEl.textContent = `${monthlyNetReturnForThreeYears.toFixed(2)}%`;
        }
        // Show/hide expected income section based on whether data-driven fields are present
        if (expectedIncomeSectionEl) {
            if (expectedMonthlyNetIncome !== null && expectedMonthlyNetReturn !== null) {
                expectedIncomeSectionEl.classList.remove('d-none');
                if (expectedMonthlyNetIncomeEl) {
                    expectedMonthlyNetIncomeEl.textContent = `$${expectedMonthlyNetIncome.toFixed(2)}`;
                }
                if (expectedMonthlyNetReturnEl) {
                    expectedMonthlyNetReturnEl.textContent = `${expectedMonthlyNetReturn.toFixed(2)}%`;
                }
            }
            else {
                expectedIncomeSectionEl.classList.add('d-none');
            }
        }
        // Show the results container
        this.resultsContainer.classList.remove('d-none');
        // Scroll to results
        this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Save simulation to MongoDB
        this.saveSimulation(data);
    }
}
// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
