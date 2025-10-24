import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  displayCurrency: string;
  setDisplayCurrency: (currency: string) => void;
  exchangeRates: Record<string, number>;
  isLoadingRates: boolean;
  convertAmount: (amount: number, fromCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DISPLAY_CURRENCY_KEY = 'finance-tracker-display-currency';
const EXCHANGE_RATES_KEY = 'finance-tracker-exchange-rates';
const RATES_CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [displayCurrency, setDisplayCurrencyState] = useState<string>(() => {
    return localStorage.getItem(DISPLAY_CURRENCY_KEY) || 'EUR';
  });
  
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);

  const setDisplayCurrency = (currency: string) => {
    setDisplayCurrencyState(currency);
    localStorage.setItem(DISPLAY_CURRENCY_KEY, currency);
  };

  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    
    try {
      // Check cache first (with currency-specific key)
      const cacheKey = `${EXCHANGE_RATES_KEY}-${displayCurrency}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { rates, timestamp, baseCurrency } = JSON.parse(cachedData);
        if (Date.now() - timestamp < RATES_CACHE_DURATION && baseCurrency === displayCurrency) {
          setExchangeRates(rates);
          setIsLoadingRates(false);
          return;
        }
      }

      // Fetch fresh rates
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${displayCurrency}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();
      const rates = data.rates || {};

      // Add base currency (1:1)
      rates[displayCurrency] = 1;

      setExchangeRates(rates);
      
      // Cache the rates with currency-specific key
      localStorage.setItem(cacheKey, JSON.stringify({
        rates,
        baseCurrency: displayCurrency,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Use fallback rates if available
      const cacheKey = `${EXCHANGE_RATES_KEY}-${displayCurrency}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { rates } = JSON.parse(cachedData);
        setExchangeRates(rates);
      }
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, [displayCurrency]);

  const convertAmount = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === displayCurrency) {
      return amount;
    }

    const fromRate = exchangeRates[fromCurrency];
    
    if (!fromRate) {
      console.warn(`Exchange rate not found for ${fromCurrency}, returning original amount`);
      return amount;
    }

    // The API gives rates where: 1 displayCurrency = rate * otherCurrency
    // For example, if displayCurrency is EUR and rates[USD] = 1.10, it means 1 EUR = 1.10 USD
    // To convert FROM USD TO EUR: amount_in_USD / 1.10 = amount_in_EUR
    // To convert FROM EUR TO USD: amount_in_EUR * 1.10 = amount_in_USD
    // 
    // Since we're converting FROM fromCurrency TO displayCurrency, we divide
    return amount / fromRate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        displayCurrency,
        setDisplayCurrency,
        exchangeRates,
        isLoadingRates,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

