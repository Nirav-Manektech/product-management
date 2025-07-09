const generateFourDigitRandomNumber = () =>
  Math.floor(1000 + Math.random() * 9000);

export const OrderOTP = generateFourDigitRandomNumber();
