import { useEffect, useState } from 'react';
import { Country } from '../countries';
import { getCountryOfVisitor } from './visitorCountry';

export const useStorage = () => {
  const key = 'clickplanet-country';

  const [countryState, setCounty] = useState<Country>(() => {
  const defaultValue: Country = getCountryOfVisitor();
    if (typeof window !== 'undefined') {
      const storedValue = window.localStorage.getItem(key);
        console.log('storedValue :', storedValue)

      return storedValue ? JSON.parse(storedValue) : defaultValue;
    }
    return defaultValue;
  });

console.log('country :', countryState)

  useEffect(() => {

    console.log('entrou no useEffect')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(countryState));
    }
  }, [countryState]);

  const handleSetCountry = (v: Country) => {
    setCounty(v);
  };

  return { countryState, handleSetCountry};
};
