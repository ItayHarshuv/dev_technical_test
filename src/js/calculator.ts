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
        const formConfigs = [
            { id: 'calculatorForm', suffix: 'Desktop' },
            { id: 'calculatorFormModal', suffix: 'Modal' }
        ];

        formConfigs.forEach(config => {
            const form = document.getElementById(config.id) as HTMLFormElement;
            if (form) {
                form.addEventListener('submit', (e: Event) => this.handleSubmit(e, form));
                this.attachFieldValidators(form);
                this.attachDataDrivenValidators(config.suffix, form);
            }
        });
    }

    private initializeDataDrivenToggle(): void {
        const toggleConfigs = [
            { 
                toggleId: 'dataDrivenToggleDesktop', 
                fieldsId: 'dataDrivenFieldsDesktop', 
                suffix: 'Desktop',
                containerId: 'searchBoxContainerDesktop'
            },
            { 
                toggleId: 'dataDrivenToggleModal', 
                fieldsId: 'dataDrivenFieldsModal', 
                suffix: 'Modal',
                containerId: null
            }
        ];

        toggleConfigs.forEach(config => {
            const toggle = document.getElementById(config.toggleId);
            const fields = document.getElementById(config.fieldsId);
            if (toggle && fields) {
                toggle.addEventListener('click', () => {
                    const isVisible = !fields.classList.contains('d-none');
                    if (isVisible) {
                        // Hide fields and collapse form
                        fields.classList.add('d-none');
                        this.clearDataDrivenFields(config.suffix);
                        
                        // Update button text
                        toggle.textContent = 'Data Driven Analysis';
                        
                        // For desktop: remove expanded state
                        if (config.suffix === 'Desktop' && config.containerId) {
                            const container = document.getElementById(config.containerId);
                            if (container) {
                                container.classList.remove('expanded');
                            }
                        }
                    } else {
                        // Show fields and expand form
                        fields.classList.remove('d-none');
                        this.setDataDrivenFieldsRequired(config.suffix, true);
                        
                        // Update button text
                        toggle.textContent = 'Hide Data Driven Analysis';
                        
                        // For desktop: add expanded state
                        if (config.suffix === 'Desktop' && config.containerId) {
                            const container = document.getElementById(config.containerId);
                            if (container) {
                                container.classList.add('expanded');
                            }
                        }
                    }
                });
            }
        });
    }

    private getDataDrivenFields(suffix: string): {
        surface: HTMLInputElement | null;
        bedrooms: HTMLSelectElement | null;
        locationScore: HTMLInputElement | null;
    } {
        return {
            surface: document.getElementById(`surface${suffix}`) as HTMLInputElement,
            bedrooms: document.getElementById(`bedrooms${suffix}`) as HTMLSelectElement,
            locationScore: document.getElementById(`locationScore${suffix}`) as HTMLInputElement
        };
    }

    private attachDataDrivenValidators(suffix: string, form: HTMLFormElement): void {
        const fields = this.getDataDrivenFields(suffix);

        // Surface and locationScore are input fields - use blur/input
        [fields.surface, fields.locationScore].forEach(field => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(field!, form));
                field.addEventListener('input', () => this.clearFieldError(field!));
            }
        });

        // Bedrooms is a select field - use change
        if (fields.bedrooms) {
            fields.bedrooms.addEventListener('change', () => {
                this.validateField(fields.bedrooms!, form);
                this.clearFieldError(fields.bedrooms!);
            });
        }
    }

    private clearDataDrivenFields(suffix: string): void {
        const fields = this.getDataDrivenFields(suffix);
        
        Object.values(fields).forEach(field => {
            if (field) {
                field.value = '';
                this.clearFieldError(field);
                field.removeAttribute('required');
            }
        });
    }

    private setDataDrivenFieldsRequired(suffix: string, required: boolean): void {
        const fields = this.getDataDrivenFields(suffix);
        
        Object.values(fields).forEach(field => {
            if (field) {
                if (required) {
                    field.setAttribute('required', 'required');
                } else {
                    field.removeAttribute('required');
                }
            }
        });
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
            return this.createAndDisplayError(
                field,
                ValidationErrorCode.REQUIRED_FIELD,
                'This field is required',
                fieldName,
                isModal
            );
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
                    return this.createAndDisplayError(
                        field,
                        ValidationErrorCode.BEDROOMS_OUT_OF_RANGE,
                        'Please select a number of bedrooms between 1 and 4',
                        fieldName,
                        isModal
                    );
                }
            }
        } else if (field.tagName === 'INPUT') {
            const inputField = field as HTMLInputElement;
            
            if (inputField.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return this.createAndDisplayError(
                        inputField,
                        ValidationErrorCode.INVALID_EMAIL,
                        'Please enter a valid email address',
                        fieldName,
                        isModal
                    );
                }
            } else if (inputField.type === 'number') {
                const numValue = parseFloat(value);
                
                if (isNaN(numValue)) {
                    return this.createAndDisplayError(
                        inputField,
                        ValidationErrorCode.INVALID_NUMBER,
                        'Please enter a valid number',
                        fieldName,
                        isModal
                    );
                }

                // Validate surface (20-120)
                if (fieldName === 'surface') {
                    if (numValue < 20 || numValue > 120) {
                        return this.createAndDisplayError(
                            inputField,
                            ValidationErrorCode.SURFACE_OUT_OF_RANGE,
                            'Surface must be between 20 and 120 m²',
                            fieldName,
                            isModal
                        );
                    }
                }
                // Validate location score (5-10)
                else if (fieldName === 'locationScore') {
                    if (numValue < 5 || numValue > 10) {
                        return this.createAndDisplayError(
                            inputField,
                            ValidationErrorCode.LOCATION_SCORE_OUT_OF_RANGE,
                            'Location score must be between 5.0 and 10.0',
                            fieldName,
                            isModal
                        );
                    }
                }
                // Validate other number fields
                else {
                    if (numValue < 0) {
                        return this.createAndDisplayError(
                            inputField,
                            ValidationErrorCode.NEGATIVE_NUMBER,
                            'Please enter a positive number',
                            fieldName,
                            isModal
                        );
                    }

                    if (numValue === 0) {
                        return this.createAndDisplayError(
                            inputField,
                            ValidationErrorCode.ZERO_VALUE,
                            'Please enter a value greater than zero',
                            fieldName,
                            isModal
                        );
                    }
                }
            }
        }

        return null;
    }

    private createAndDisplayError(
        field: HTMLInputElement | HTMLSelectElement,
        code: ValidationErrorCode,
        message: string,
        fieldName: string,
        isModal: boolean
    ): ValidationError {
        const error: ValidationError = { code, message, field: fieldName };
        this.displayFieldError(field, error, isModal);
        return error;
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
            } else {
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
