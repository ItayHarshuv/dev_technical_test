interface CalculatorFormData {
    purchasePrice: number;
    monthlyRent: number;
    annualFee: number;
    email: string;
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
        }

        // Modal form
        const modalForm = document.getElementById('calculatorFormModal') as HTMLFormElement;
        if (modalForm) {
            modalForm.addEventListener('submit', (e: Event) => this.handleSubmit(e, modalForm));
        }
    }

    private handleSubmit(event: Event, form: HTMLFormElement): void {
        event.preventDefault();

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
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
