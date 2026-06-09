import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export const ResultsDashboard = ({ 
  monthlyBreakdown, 
  cashToClose,
  isFirstTimeBuyer,
  netProceeds
}) => {
  const { principalAndInterest, propertyTax, insurance, pmi, hoa, total } = monthlyBreakdown;

  const pieData = [
    { name: 'Principal & Interest', value: principalAndInterest, color: '#3b82f6' },
    { name: 'Property Taxes', value: propertyTax, color: '#10b981' },
    { name: 'Home Insurance', value: insurance, color: '#f59e0b' },
  ];

  if (pmi > 0) pieData.push({ name: 'PMI', value: pmi, color: '#ef4444' });
  if (hoa > 0) pieData.push({ name: 'HOA', value: hoa, color: '#8b5cf6' });

  const totalCashNeeded = isFirstTimeBuyer 
    ? cashToClose.total 
    : Math.max(0, cashToClose.total - netProceeds);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Level Numbers */}
      <div className="grid grid-2" style={{ textAlign: 'center' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Estimated Monthly Payment</h3>
          <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 }}>
            ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            ~${Math.round(total * 12 / 52).toLocaleString()} / week
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            {isFirstTimeBuyer ? 'Total Cash to Close' : 'Out of Pocket to Close'}
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            ${totalCashNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          {!isFirstTimeBuyer && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              After applying net proceeds from sale
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Chart */}
      <div className="grid grid-2" style={{ alignItems: 'center' }}>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Math.round(value)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Monthly Breakdown</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pieData.map((item, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 600 }}>${Math.round(item.value).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {monthlyBreakdown.armDetails && (
        <div className="animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={18} /> ARM Adjustment Warning
          </h3>
          <p style={{ margin: 0 }}>
            After the initial <strong>{monthlyBreakdown.armDetails.fixedYears}-year</strong> fixed period, your rate is estimated to adjust to <strong>{monthlyBreakdown.armDetails.adjustedRate}%</strong>. 
            Your new estimated monthly payment would jump to <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>${Math.round(monthlyBreakdown.armDetails.adjustedPayment).toLocaleString()}</strong>.
          </p>
        </div>
      )}

    </div>
  );
};
