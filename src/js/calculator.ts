interface CalculatorFormData {
    purchasePrice: number;
    monthlyRent: number;
    annualFee: number;
    email: string;
    surface?: number;
    bedrooms?: number;
    locationScore?: number;
}

enum ValidationErrorCode {
    REQUIRED_FIELD = 'REQUIRED_FIELD',
    INVALID_NUMBER = 'INVALID_NUMBER',
    INVALID_EMAIL = 'INVALID_EMAIL',
    NEGATIVE_NUMBER = 'NEGATIVE_NUMBER',
    ZERO_VALUE = 'ZERO_VALUE',
    SURFACE_OUT_OF_RANGE = 'SURFACE_OUT_OF_RANGE',
    BEDROOMS_OUT_OF_RANGE = 'BEDROOMS_OUT_OF_RANGE',
    LOCATION_SCORE_OUT_OF_RANGE = 'LOCATION_SCORE_OUT_OF_RANGE',
    INVALID_INTEGER = 'INVALID_INTEGER'
}

interface ValidationError {
    code: ValidationErrorCode;
    message: string;
    field: string;
}

class Calculator {
    private resultsContainer: HTMLElement | null;

    constructor() {
        this.resultsContainer = document.getElementById('resultsContainer');
        this.initializeForms();
        this.initializeDataDrivenToggle();
    }

    private initializeForms(): void {
        // Desktop form
        const desktopForm = document.getElementById('calculatorForm') as HTMLFormElement;
        if (desktopForm) {
            desktopForm.addEventListener('submit', (e: Event) => this.handleSubmit(e, desktopForm));
            this.attachFieldValidators(desktopForm);
            this.attachDataDrivenValidators('Desktop', desktopForm);
        }

        // Modal form
        const modalForm = document.getElementById('calculatorFormModal') as HTMLFormElement;
        if (modalForm) {
            modalForm.addEventListener('submit', (e: Event) => this.handleSubmit(e, modalForm));
            this.attachFieldValidators(modalForm);
            this.attachDataDrivenValidators('Modal', modalForm);
        }
    }

    private initializeDataDrivenToggle(): void {
        // Desktop toggle
        const desktopToggle = document.getElementById('dataDrivenToggleDesktop');
        const desktopFields = document.getElementById('dataDrivenFieldsDesktop');
        if (desktopToggle && desktopFields) {
            desktopToggle.addEventListener('click', () => {
                const isVisible = !desktopFields.classList.contains('d-none');
                if (isVisible) {
                    desktopFields.classList.add('d-none');
                    this.clearDataDrivenFields('Desktop');
                } else {
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
                } else {
                    modalFields.classList.remove('d-none');
                    this.setDataDrivenFieldsRequired('Modal', true);
                }
            });
        }
    }

    private attachDataDrivenValidators(suffix: string, form: HTMLFormElement): void {
        const surfaceField = document.getElementById(`surface${suffix}`) as HTMLInputElement;
        const bedroomsField = document.getElementById(`bedrooms${suffix}`) as HTMLSelectElement;
        const locationScoreField = document.getElementById(`locationScore${suffix}`) as HTMLInputElement;

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

    private clearDataDrivenFields(suffix: string): void {
        const surfaceField = document.getElementById(`surface${suffix}`) as HTMLInputElement;
        const bedroomsField = document.getElementById(`bedrooms${suffix}`) as HTMLSelectElement;
        const locationScoreField = document.getElementById(`locationScore${suffix}`) as HTMLInputElement;

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

    private setDataDrivenFieldsRequired(suffix: string, required: boolean): void {
        const surfaceField = document.getElementById(`surface${suffix}`) as HTMLInputElement;
        const bedroomsField = document.getElementById(`bedrooms${suffix}`) as HTMLSelectElement;
        const locationScoreField = document.getElementById(`locationScore${suffix}`) as HTMLInputElement;

        if (surfaceField) {
            if (required) {
                surfaceField.setAttribute('required', 'required');
            } else {
                surfaceField.removeAttribute('required');
            }
        }
        if (bedroomsField) {
            if (required) {
                bedroomsField.setAttribute('required', 'required');
            } else {
                bedroomsField.removeAttribute('required');
            }
        }
        if (locationScoreField) {
            if (required) {
                locationScoreField.setAttribute('required', 'required');
            } else {
                locationScoreField.removeAttribute('required');
            }
        }
    }

    private attachFieldValidators(form: HTMLFormElement): void {
        const fields = form.querySelectorAll('input[required], select[required]');
        fields.forEach(field => {
            if (field.tagName === 'INPUT') {
                field.addEventListener('blur', () => this.validateField(field as HTMLInputElement, form));
                field.addEventListener('input', () => this.clearFieldError(field as HTMLInputElement));
            } else if (field.tagName === 'SELECT') {
                field.addEventListener('change', () => this.validateField(field as HTMLSelectElement, form));
                field.addEventListener('change', () => this.clearFieldError(field as HTMLSelectElement));
            }
        });
    }

    private validateField(field: HTMLInputElement | HTMLSelectElement, form: HTMLFormElement): ValidationError | null {
        const fieldName = field.name;
        const value = field.value.trim();
        const isModal = form.id === 'calculatorFormModal';
        const isRequired = field.hasAttribute('required');

        // Clear previous error
        this.clearFieldError(field);

        // Check if field is empty and required
        if (isRequired && !value) {
            const error: ValidationError = {
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
                    const error: ValidationError = {
                        code: ValidationErrorCode.BEDROOMS_OUT_OF_RANGE,
                        message: 'Please select a number of bedrooms between 1 and 4',
                        field: fieldName
                    };
                    this.displayFieldError(field, error, isModal);
                    return error;
                }
            }
        } else if (field.tagName === 'INPUT') {
            const inputField = field as HTMLInputElement;
            
            if (inputField.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    const error: ValidationError = {
                        code: ValidationErrorCode.INVALID_EMAIL,
                        message: 'Please enter a valid email address',
                        field: fieldName
                    };
                    this.displayFieldError(inputField, error, isModal);
                    return error;
                }
            } else if (inputField.type === 'number') {
                const numValue = parseFloat(value);
                
                if (isNaN(numValue)) {
                    const error: ValidationError = {
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
                        const error: ValidationError = {
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
                        const error: ValidationError = {
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
                        const error: ValidationError = {
                            code: ValidationErrorCode.NEGATIVE_NUMBER,
                            message: 'Please enter a positive number',
                            field: fieldName
                        };
                        this.displayFieldError(inputField, error, isModal);
                        return error;
                    }

                    if (numValue === 0) {
                        const error: ValidationError = {
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

    private displayFieldError(field: HTMLInputElement | HTMLSelectElement, error: ValidationError, isModal: boolean): void {
        // Add error class to field
        field.classList.add('is-invalid');

        // Create or update error message element
        let errorElement = field.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentElement?.appendChild(errorElement);
        }

        errorElement.textContent = error.message;
        errorElement.setAttribute('data-error-code', error.code);
    }

    private clearFieldError(field: HTMLInputElement | HTMLSelectElement): void {
        field.classList.remove('is-invalid');
        const errorElement = field.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
        if (errorElement) {
            errorElement.remove();
        }
    }

    private validateForm(form: HTMLFormElement): ValidationError[] {
        const errors: ValidationError[] = [];
        const fields = form.querySelectorAll('input[required], select[required]') as NodeListOf<HTMLInputElement | HTMLSelectElement>;

        fields.forEach(field => {
            const error = this.validateField(field, form);
            if (error) {
                errors.push(error);
            }
        });

        return errors;
    }

    private handleSubmit(event: Event, form: HTMLFormElement): void {
        event.preventDefault();

        // Validate all fields
        const errors = this.validateForm(form);
        
        if (errors.length > 0) {
            // Focus on first error field
            const firstErrorField = form.querySelector('.is-invalid') as HTMLInputElement;
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }

        const formDataObj = new FormData(form);
        const data: CalculatorFormData = {
            purchasePrice: parseFloat(formDataObj.get('purchasePrice') as string),
            monthlyRent: parseFloat(formDataObj.get('monthlyRent') as string),
            annualFee: parseFloat(formDataObj.get('annualFee') as string),
            email: formDataObj.get('email') as string
        };

        // Add optional data driven analysis fields if they exist
        const surface = formDataObj.get('surface') as string;
        const bedrooms = formDataObj.get('bedrooms') as string;
        const locationScore = formDataObj.get('locationScore') as string;

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
            const bootstrapModal = (window as any).bootstrap?.Modal;
            if (bootstrapModal) {
                const modal = bootstrapModal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }

    private async saveSimulation(data: CalculatorFormData): Promise<void> {
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
        } catch (error) {
            console.error('Error saving simulation:', error);
        }
    }

    private displayResults(data: CalculatorFormData): void {
        if (!this.resultsContainer) {
            return;
        }

        // Calculate annual rent
        const threeYearRent = data.monthlyRent * 12 * 3;
        const threeYearFee = data.annualFee * 3;
        const threeYearCommission = (data.monthlyRent * 12) * (0.3 + 0.25 + 0.2)
        const threeYearMonthlyAverageNetIncome = (threeYearRent - threeYearFee - threeYearCommission) / 36;
        const monthlyNetReturnForThreeYears = (threeYearMonthlyAverageNetIncome / data.purchasePrice) * 100;
        
        // Calculate Expected Monthly Net Income if data-driven analysis fields are present
        let expectedMonthlyNetIncome: number | null = null;
        let expectedMonthlyNetReturn: number | null = null;
        if (data.surface && data.bedrooms && data.locationScore) {
            // Calculate annual_paid_price using the formula:
            // annual_paid_price ≈ e^3.608 * surface_m2^0.285 * bedrooms^-0.043 * location_score^0.851 * avg_listed_price^0.735
            const annualPaidPrice = 
                Math.exp(3.608) 
                * Math.pow(data.surface, 0.285) 
                * Math.pow(data.bedrooms, -0.043) 
                * Math.pow(data.locationScore, 0.851) 
                * Math.pow(data.monthlyRent/30, 0.735);
            
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
        
        let expectedIncomeHtml = '';
        if (expectedMonthlyNetIncome !== null) {
            expectedIncomeHtml = `
                    <hr>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Expected Monthly Net Income (calculating expected booking rate):</strong>
                        </div>
                        <div class="col-md-6">
                            $${expectedMonthlyNetIncome.toFixed(2)}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Expected Monthly Net Return:</strong>
                        </div>
                        <div class="col-md-6">
                            <span class="h5 text-success">${expectedMonthlyNetReturn!.toFixed(2)}%</span>
                        </div>
                    </div>
            `;
        }
        
        this.resultsContainer.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Calculation Results</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Average Monthly Net Income Over 3 Years:</strong>
                        </div>
                        <div class="col-md-6">
                            $${threeYearMonthlyAverageNetIncome.toFixed(2)}
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Monthly Net Return Over 3 Years:</strong>
                        </div>
                        <div class="col-md-6">
                            <span class="h5 text-success">${monthlyNetReturnForThreeYears.toFixed(2)}%</span>
                        </div>
                    </div>
                    ${expectedIncomeHtml}
                </div>
            </div>
        `;

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
