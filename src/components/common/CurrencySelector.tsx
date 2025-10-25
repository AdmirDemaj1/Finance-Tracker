import React, { useEffect, useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { fetchCurrencies, Currency } from '../../services/currencyApi';

const CurrencySelector: React.FC = () => {
  const { displayCurrency, setDisplayCurrency, isLoadingRates } = useCurrency();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState<boolean>(true);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Failed to load currencies:', error);
      } finally {
        setIsLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  console.log("currencies", currencies);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    console.log('e.target.value', e.target.value);
    setDisplayCurrency(e.target.value);
  };

  return (
    <div className="currency-selector">
      <label htmlFor="display-currency">
        Display Currency:
      </label>
      <select
        id="display-currency"
        value={displayCurrency}
        onChange={handleCurrencyChange}
        disabled={isLoadingCurrencies || isLoadingRates}
        className="currency-select"
      >
        {isLoadingCurrencies ? (
          <option value="">Loading...</option>
        ) : (
          currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))
        )}
      </select>
      {isLoadingRates && <span className="loading-indicator">Updating rates...</span>}
    </div>
  );
};

export default CurrencySelector;

