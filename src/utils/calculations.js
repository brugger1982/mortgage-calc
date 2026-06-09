export const calculateMonthlyPayment = (principal, annualInterestRate, years) => {
  if (principal <= 0 || years <= 0) return 0;
  if (annualInterestRate === 0) return principal / (years * 12);
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const numPayments = years * 12;
  
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
  return payment;
};

export const calculateNetProceeds = (salePrice, remainingMortgage, commissionRate, sellerClosingCosts) => {
  const commission = salePrice * (commissionRate / 100);
  return salePrice - remainingMortgage - commission - sellerClosingCosts;
};

export const calculatePMI = (downPayment, homePrice, loanAmount, pmiRate = 0.5) => {
  if (homePrice <= 0) return 0;
  const downPaymentPercent = downPayment / homePrice;
  if (downPaymentPercent >= 0.20) {
    return 0; 
  }
  const annualPMI = loanAmount * (pmiRate / 100); 
  return annualPMI / 12; 
};

export const calculateTotalMonthly = (
  principalAndInterest,
  annualPropertyTax,
  annualInsurance,
  monthlyPMI,
  monthlyHOA
) => {
  const monthlyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  return principalAndInterest + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
};

export const calculateRemainingBalance = (principal, annualInterestRate, termYears, yearsPassed) => {
  if (annualInterestRate === 0) return principal - (principal / termYears) * yearsPassed;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalPayments = termYears * 12;
  const paymentsMade = yearsPassed * 12;
  
  const currentBalance = principal * 
    (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, paymentsMade)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
  return currentBalance;
};
