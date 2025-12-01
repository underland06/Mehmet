export const formatNumber = (value: string | number | undefined | null): string => {
  if (!value && value !== 0) return '';
  const stringValue = value.toString();
  const cleanValue = stringValue.replace(/[^0-9]/g, '');
  if (!cleanValue) return '';
  return new Intl.NumberFormat('tr-TR').format(parseInt(cleanValue));
};

export const parseNumber = (formattedValue: string | number | undefined | null): number => {
  if (!formattedValue) return 0;
  return parseFloat(formattedValue.toString().replace(/\./g, '').replace(',', '.'));
};