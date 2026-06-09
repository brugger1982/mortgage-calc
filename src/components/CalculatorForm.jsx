import React from 'react';
import { Home, DollarSign, ArrowRight } from 'lucide-react';

const InputWithSlider = ({ label, name, value, onChange, min, max, step = 1, helperText, symbol = '', warningZonePercent, headerRight }) => {
  let trackStyle = {};
  if (warningZonePercent !== undefined && max > 0) {
    trackStyle = { background: `linear-gradient(to right, var(--warning) 0%, var(--warning) ${warningZonePercent}%, var(--border-color) ${warningZonePercent}%, var(--border-color) 100%)` };
  }

  return (
    <div className="input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ margin: 0 }}>{label}</label>
        {headerRight}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {symbol === '$' && <span style={{ color: 'var(--text-secondary)' }}>$</span>}
        <input 
          type="number" 
          className="input-field" 
          name={name} 
          value={value} 
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        {symbol === '%' && <span style={{ color: 'var(--text-secondary)' }}>%</span>}
      </div>
      <input 
        type="range" 
        className="slider" 
        name={name} 
        value={value} 
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        style={trackStyle}
      />
      {helperText && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

export const CalculatorForm = ({ 
  isFirstTimeBuyer, 
  setIsFirstTimeBuyer, 
  sellingState, 
  setSellingState, 
  buyingState, 
  setBuyingState,
  netProceeds,
  effectiveDownPayment
}) => {

  const handleSellChange = (e) => {
    const { name, value } = e.target;
    setSellingState(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleBuyChange = (e) => {
    const { name, value } = e.target;
    setBuyingState(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleBuyStringChange = (e) => {
    const { name, value } = e.target;
    setBuyingState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <h2>Scenario Overview</h2>
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface-hover)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', width: 'fit-content' }}>
          <button 
            className="btn"
            style={{ 
              backgroundColor: !isFirstTimeBuyer ? 'var(--surface)' : 'transparent', 
              color: !isFirstTimeBuyer ? 'var(--primary-accent)' : 'var(--text-secondary)',
              boxShadow: !isFirstTimeBuyer ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              borderRadius: 'var(--radius-md)',
              minWidth: '180px'
            }}
            onClick={() => setIsFirstTimeBuyer(false)}
          >
            Selling & Buying
          </button>
          <button 
            className="btn"
            style={{ 
              backgroundColor: isFirstTimeBuyer ? 'var(--surface)' : 'transparent', 
              color: isFirstTimeBuyer ? 'var(--primary-accent)' : 'var(--text-secondary)',
              boxShadow: isFirstTimeBuyer ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              borderRadius: 'var(--radius-md)',
              minWidth: '180px'
            }}
            onClick={() => setIsFirstTimeBuyer(true)}
          >
            First-Time Buyer
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        {!isFirstTimeBuyer && (
          <div>
            <h3><Home size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/>Selling Your Current Home</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Estimate the net proceeds from your sale.</p>
            
            <InputWithSlider
              label="Expected Sale Price"
              name="homePrice"
              value={sellingState.homePrice}
              onChange={handleSellChange}
              min={50000}
              max={99999999}
              step={10000}
              symbol="$"
              helperText="Typically ranges from $100k - $2M+"
            />
            
            <InputWithSlider
              label="Remaining Mortgage Balance"
              name="mortgageBalance"
              value={sellingState.mortgageBalance}
              onChange={handleSellChange}
              min={0}
              max={sellingState.homePrice}
              step={5000}
              symbol="$"
              helperText="Usually 0 - 80% of your home's sale price"
            />

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <InputWithSlider
                label="Agent Commissions"
                name="agentCommission"
                value={sellingState.agentCommission}
                onChange={handleSellChange}
                min={0}
                max={10}
                step={0.5}
                symbol="%"
                helperText="Typically 5% - 6% total"
              />
              <InputWithSlider
                label="Seller Closing Costs"
                name="sellerClosingCosts"
                value={sellingState.sellerClosingCosts}
                onChange={handleSellChange}
                min={0}
                max={10}
                step={0.5}
                symbol="%"
                helperText="Typically 1% - 3%"
              />
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>Estimated Net Proceeds:</span>
                <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  ${Math.max(0, netProceeds).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3><DollarSign size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/>Buying Your New Home</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Configure the loan parameters.</p>
          
          <InputWithSlider
            label="Purchase Price"
            name="homePrice"
            value={buyingState.homePrice}
            onChange={handleBuyChange}
            min={50000}
            max={99999999}
            step={10000}
            symbol="$"
            helperText="The listing price or your offer price"
          />

          {isFirstTimeBuyer ? (
            <InputWithSlider
              label="Down Payment"
              name="downPayment"
              value={buyingState.downPayment}
              onChange={handleBuyChange}
              min={0}
              max={buyingState.homePrice}
              step={1000}
              symbol="$"
              helperText={`Currently ${((buyingState.downPayment / buyingState.homePrice) * 100 || 0).toFixed(1)}% Down. PMI applies under 20%.`}
              warningZonePercent={20}
            />
          ) : (
            <div style={{ marginBottom: '1.5rem' }}>
              <InputWithSlider
                label="Additional Cash Towards Down Payment"
                name="additionalCash"
                value={buyingState.additionalCash || 0}
                onChange={handleBuyChange}
                min={0}
                max={buyingState.homePrice}
                step={1000}
                symbol="$"
                helperText="Extra savings to add to your net proceeds"
              />
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--primary-accent)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Down Payment:</span>
                <span style={{ fontWeight: 600 }}>
                  ${effectiveDownPayment.toLocaleString()} 
                  <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                    ({((effectiveDownPayment / buyingState.homePrice) * 100 || 0).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <InputWithSlider
              label="Interest Rate"
              name="interestRate"
              value={buyingState.interestRate}
              onChange={handleBuyChange}
              min={1}
              max={15}
              step={0.125}
              symbol="%"
              helperText="Current avg is around 6% - 8%"
            />

            <div className="input-group">
              <label>Loan Type</label>
              <select className="input-field" name="loanType" value={buyingState.loanType} onChange={handleBuyStringChange}>
                <optgroup label="Fixed Rate">
                  <option value="15-fixed">15-Year Fixed</option>
                  <option value="20-fixed">20-Year Fixed</option>
                  <option value="30-fixed">30-Year Fixed</option>
                </optgroup>
                <optgroup label="Adjustable Rate (ARM)">
                  <option value="5-arm">5/1 ARM (30 yr)</option>
                  <option value="7-arm">7/1 ARM (30 yr)</option>
                  <option value="10-arm">10/1 ARM (30 yr)</option>
                </optgroup>
              </select>
              <div className="helper-text">ARMs adjust after the initial period.</div>
            </div>
          </div>

          {buyingState.loanType.includes('arm') && (
            <div className="grid grid-1" style={{ marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--warning)' }}>
                <InputWithSlider
                  label="Expected Rate After Adjustment"
                  name="adjustedInterestRate"
                  value={buyingState.adjustedInterestRate ?? 8.5}
                  onChange={handleBuyChange}
                  min={1}
                  max={15}
                  step={0.125}
                  symbol="%"
                  helperText={`Estimate the new rate after the initial ${parseInt(buyingState.loanType)} years.`}
                />
              </div>
            </div>
          )}

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <InputWithSlider
              label="Property Tax"
              headerRight={
                <select 
                  className="input-field" 
                  style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem', height: 'auto', marginBottom: 0 }}
                  name="propertyTaxMode" 
                  value={buyingState.propertyTaxMode || 'percentage'} 
                  onChange={handleBuyStringChange}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="per100k">Cost per $100k</option>
                  <option value="annual">Total Annual ($)</option>
                </select>
              }
              name="propertyTaxValue"
              value={buyingState.propertyTaxValue ?? buyingState.propertyTaxRate ?? 1.2}
              onChange={handleBuyChange}
              min={0}
              max={
                buyingState.propertyTaxMode === 'annual' ? 50000 :
                buyingState.propertyTaxMode === 'per100k' ? 5000 : 5
              }
              step={
                buyingState.propertyTaxMode === 'annual' ? 500 :
                buyingState.propertyTaxMode === 'per100k' ? 50 : 0.1
              }
              symbol={buyingState.propertyTaxMode === 'percentage' ? '%' : '$'}
              helperText={
                buyingState.propertyTaxMode === 'annual' ? "Total property tax bill per year" :
                buyingState.propertyTaxMode === 'per100k' ? "Taxes owed for every $100,000 of home value" :
                "National avg ~1.1%, varies by county"
              }
            />
            <InputWithSlider
              label="Buying Closing Costs"
              name="closingCostsRate"
              value={buyingState.closingCostsRate}
              onChange={handleBuyChange}
              min={0}
              max={10}
              step={0.5}
              symbol="%"
              helperText="Typically 2% - 5% of loan amount"
            />
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <InputWithSlider
              label="Home Insurance (Annual)"
              name="homeInsuranceAnnual"
              value={buyingState.homeInsuranceAnnual}
              onChange={handleBuyChange}
              min={0}
              max={10000}
              step={100}
              symbol="$"
              helperText="Typical cost is $1,000 - $3,000 per year"
            />
            <InputWithSlider
              label="HOA Fees (Monthly)"
              name="hoaMonthly"
              value={buyingState.hoaMonthly}
              onChange={handleBuyChange}
              min={0}
              max={2000}
              step={10}
              symbol="$"
              helperText="Homeowners Association dues, if applicable"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
