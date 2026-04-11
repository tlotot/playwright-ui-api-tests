export const REGISTRATION_DATA = {
  name: 'Tina',
  lastName: 'Kovalenko',
  password: '1234567',
  day: '10',
  month: '5',
  year: '2000',
  company: 'Microsoft',
  address1: 'Zelena',
  address2: 'Naukova',
  country: 'United States',
  state: 'CA',
  city: 'California',
  zipcode: '1234',
  phone: '0644099075',
};

export function generateUniqueEmail() {
  return `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@yahoo.com`;
}
