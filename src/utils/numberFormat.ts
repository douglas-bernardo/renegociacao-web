export const numberFormat = (value: number | bigint): string => {
  const result = new Intl.NumberFormat('pt-br', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
  return result;
};

export const numberFormatAsCurrency = (value: number | bigint): string =>
  new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);

export const priceToNumber = (value: string | undefined): number => {
  if (value) {
    return Number(
      value.replace(/(,|\.)([0-9]{3})/g, '$2').replace(/(,|\.)/, '.'),
    );
  }
  return 0;
};
