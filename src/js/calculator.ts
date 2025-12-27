interface CalculatorFormData {
    purchasePrice: number;
    monthlyRent: number;
    annualFee: number;
    email: string;
}

enum ValidationErrorCode {
    REQUIRED_FIELD = 'REQUIRED_FIELD',
    INVALID_NUMBER = 'INVALID_NUMBER',
    INVALID_EMAIL = 'INVALID_EMAIL',
    NEGATIVE_NUMBER = 'NEGATIVE_NUMBER',
    ZERO_VALUE = 'ZERO_VALUE'
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
    }

    private initializeForms(): void {
        // Desktop form
        const desktopForm = document.getElementById('calculatorForm') as HTMLFormElement;
        if (desktopForm) {
            desktopForm.addEventListener('submit', (e: Event) => this.handleSubmit(e, desktopForm));
            this.attachFieldValidators(desktopForm);
        }

        // Modal form
        const modalForm = document.getElementById('calculatorFormModal') as HTMLFormElement;
        if (modalForm) {
            modalForm.addEventListener('submit', (e: Event) => this.handleSubmit(e, modalForm));
            this.attachFieldValidators(modalForm);
        }
    }

    private attachFieldValidators(form: HTMLFormElement): void {
        const fields = form.querySelectorAll('input[required]');
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field as HTMLInputElement, form));
            field.addEventListener('input', () => this.clearFieldError(field as HTMLInputElement));
        });
    }

    private validateField(field: HTMLInputElement, form: HTMLFormElement): ValidationError | null {
        const fieldName = field.name;
        const value = field.value.trim();
        const isModal = form.id === 'calculatorFormModal';

        // Clear previous error
        this.clearFieldError(field);

        // Check if field is empty
        if (!value) {
            const error: ValidationError = {
                code: ValidationErrorCode.REQUIRED_FIELD,
                message: 'This field is required',
                field: fieldName
            };
            this.displayFieldError(field, error, isModal);
            return error;
        }

        // Validate based on field type
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                const error: ValidationError = {
                    code: ValidationErrorCode.INVALID_EMAIL,
                    message: 'Please enter a valid email address',
                    field: fieldName
                };
                this.displayFieldError(field, error, isModal);
                return error;
            }
        } else if (field.type === 'number') {
            const numValue = parseFloat(value);
            
            if (isNaN(numValue)) {
                const error: ValidationError = {
                    code: ValidationErrorCode.INVALID_NUMBER,
                    message: 'Please enter a valid number',
                    field: fieldName
                };
                this.displayFieldError(field, error, isModal);
                return error;
            }

            if (numValue < 0) {
                const error: ValidationError = {
                    code: ValidationErrorCode.NEGATIVE_NUMBER,
                    message: 'Please enter a positive number',
                    field: fieldName
                };
                this.displayFieldError(field, error, isModal);
                return error;
            }

            if (numValue === 0) {
                const error: ValidationError = {
                    code: ValidationErrorCode.ZERO_VALUE,
                    message: 'Please enter a value greater than zero',
                    field: fieldName
                };
                this.displayFieldError(field, error, isModal);
                return error;
            }
        }

        return null;
    }

    private displayFieldError(field: HTMLInputElement, error: ValidationError, isModal: boolean): void {
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

    private clearFieldError(field: HTMLInputElement): void {
        field.classList.remove('is-invalid');
        const errorElement = field.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
        if (errorElement) {
            errorElement.remove();
        }
    }

    private validateForm(form: HTMLFormElement): ValidationError[] {
        const errors: ValidationError[] = [];
        const fields = form.querySelectorAll('input[required]') as NodeListOf<HTMLInputElement>;

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
