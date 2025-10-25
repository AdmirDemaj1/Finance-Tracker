export interface Currency {
  code: string;
  name: string;
}

const CURRENCY_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

// Common currencies with their full names
const COMMON_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'MXN', name: 'Mexican Peso' },
];

let cachedCurrencies: Currency[] | null = null;

export const fetchCurrencies = async (): Promise<Currency[]> => {
  if (cachedCurrencies) {
    return cachedCurrencies;
  }

  try {
    const response = await fetch(CURRENCY_API_URL);
    
    if (!response.ok) {
      console.warn('Currency API failed, using fallback currencies');
      cachedCurrencies = COMMON_CURRENCIES;
      return COMMON_CURRENCIES;
    }

    const data = await response.json();
    
   
    const currencyCodes = Object.keys(data.rates || {});
    
 
    const currencies: Currency[] = [];
    
    
    COMMON_CURRENCIES.forEach(currency => {
      if (currencyCodes.includes(currency.code)) {
        currencies.push(currency);
      }
    });
    
    currencyCodes.forEach(code => {
      if (!currencies.find(c => c.code === code)) {
        currencies.push({ code, name: code });
      }
    });
    
    cachedCurrencies = currencies;
    return currencies;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    cachedCurrencies = COMMON_CURRENCIES;
    return COMMON_CURRENCIES;
  }
};

