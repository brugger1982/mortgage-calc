import React, { useMemo } from 'react';
import { useUrlState } from './hooks/useUrlState';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { 
  calculateMonthlyPayment, 
  calculateNetProceeds, 
  calculatePMI, 
  calculateTotalMonthly,
  calculateRemainingBalance
} from './utils/calculations';

function App() {
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useUrlState('firstTime', true);
  
  const [sellingState, setSellingState] = useUrlState('sell', {
    homePrice: 500000,
    mortgageBalance: 200000,
    agentCommission: 6,
    sellerClosingCosts: 1,
  });

  const [buyingState, setBuyingState] = useUrlState('buy', {
    homePrice: 600000,
    downPayment: 120000,
    additionalCash: 20000,
    interestRate: 6.5,
    adjustedInterestRate: 8.5,
    loanType: '30-fixed',
    propertyTaxMode: 'percentage',
    propertyTaxValue: 1.2,
    homeInsuranceAnnual: 1200,
    hoaMonthly: 0,
    closingCostsRate: 3
  });

  // Derived Calculations
  const netProceeds = useMemo(() => {
    if (isFirstTimeBuyer) return 0;
    return calculateNetProceeds(
      sellingState.homePrice,
      sellingState.mortgageBalance,
      sellingState.agentCommission,
      (sellingState.sellerClosingCosts / 100) * sellingState.homePrice
    );
  }, [isFirstTimeBuyer, sellingState]);

  const effectiveDownPayment = useMemo(() => {
    if (isFirstTimeBuyer) return buyingState.downPayment;
    return Math.max(0, netProceeds) + (buyingState.additionalCash || 0);
  }, [isFirstTimeBuyer, buyingState.downPayment, buyingState.additionalCash, netProceeds]);

  const monthlyBreakdown = useMemo(() => {
    const loanAmount = Math.max(0, buyingState.homePrice - effectiveDownPayment);
    
    let years = 30;
    if (buyingState.loanType === '15-fixed') years = 15;
    else if (buyingState.loanType === '20-fixed') years = 20;

    const pAndI = calculateMonthlyPayment(loanAmount, buyingState.interestRate, years);
    
    let annualPropertyTax = 0;
    const taxVal = buyingState.propertyTaxValue || buyingState.propertyTaxRate || 0;
    if (buyingState.propertyTaxMode === 'per100k') {
      annualPropertyTax = (buyingState.homePrice / 100000) * taxVal;
    } else if (buyingState.propertyTaxMode === 'annual') {
      annualPropertyTax = taxVal;
    } else {
      // Default to percentage
      annualPropertyTax = buyingState.homePrice * (taxVal / 100);
    }

    const pmi = calculatePMI(effectiveDownPayment, buyingState.homePrice, loanAmount);
    
    const total = calculateTotalMonthly(
      pAndI,
      annualPropertyTax,
      buyingState.homeInsuranceAnnual,
      pmi,
      buyingState.hoaMonthly
    );

    let armDetails = null;
    if (buyingState.loanType.includes('arm')) {
      const fixedYears = parseInt(buyingState.loanType.split('-')[0], 10);
      const remainingBalance = calculateRemainingBalance(loanAmount, buyingState.interestRate, years, fixedYears);
      const remainingYears = years - fixedYears;
      const adjustedPAndI = calculateMonthlyPayment(remainingBalance, buyingState.adjustedInterestRate || 8.5, remainingYears);
      
      const adjustedTotal = calculateTotalMonthly(
        adjustedPAndI,
        annualPropertyTax,
        buyingState.homeInsuranceAnnual,
        0, // Assume PMI is typically gone by the time an ARM adjusts, to simplify the worst-case comparison
        buyingState.hoaMonthly
      );

      armDetails = {
        fixedYears,
        adjustedRate: buyingState.adjustedInterestRate || 8.5,
        adjustedPayment: adjustedTotal
      };
    }

    return {
      principalAndInterest: pAndI,
      propertyTax: annualPropertyTax / 12,
      insurance: buyingState.homeInsuranceAnnual / 12,
      pmi: pmi,
      hoa: buyingState.hoaMonthly,
      total: total,
      armDetails: armDetails
    };
  }, [buyingState, effectiveDownPayment]);

  const cashToClose = useMemo(() => {
    const loanAmount = Math.max(0, buyingState.homePrice - effectiveDownPayment);
    const closingCosts = Math.max(0, loanAmount * (buyingState.closingCostsRate / 100));
    return {
      downPayment: effectiveDownPayment,
      closingCosts: closingCosts,
      total: effectiveDownPayment + closingCosts
    };
  }, [buyingState, effectiveDownPayment]);

  return (
    <div className="container animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Mortgage & Housing Calculator
        </h1>
        <p style={{ fontSize: '1.125rem' }}>
          Plan your financial future with absolute clarity.
        </p>
      </header>

      <div className="grid">
        <CalculatorForm 
          isFirstTimeBuyer={isFirstTimeBuyer}
          setIsFirstTimeBuyer={setIsFirstTimeBuyer}
          sellingState={sellingState}
          setSellingState={setSellingState}
          buyingState={buyingState}
          setBuyingState={setBuyingState}
          netProceeds={netProceeds}
          effectiveDownPayment={effectiveDownPayment}
        />

        <ResultsDashboard 
          monthlyBreakdown={monthlyBreakdown}
          cashToClose={cashToClose}
          isFirstTimeBuyer={isFirstTimeBuyer}
          netProceeds={netProceeds}
        />
      </div>
      
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Values provided are estimates and do not constitute financial advice. Local taxes and fees vary.</p>
      </footer>
    </div>
  );
}

export default App;
