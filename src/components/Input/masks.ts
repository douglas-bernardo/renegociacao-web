export function cep(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  e.currentTarget.maxLength = 9;
  let { value } = e.currentTarget;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  e.currentTarget.value = value;
  return e;
}

export function currency(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  let { value } = e.currentTarget;
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(\d{2})$/, '$1,$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');

  e.currentTarget.value = value;
  return e;
}

export function number(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  let { value } = e.currentTarget;
  value = value.replace(/\D/g, '');
  e.currentTarget.value = value;
  return e;
}

export function cpf(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  e.currentTarget.maxLength = 14;
  let { value } = e.currentTarget;
  if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
    e.currentTarget.value = value;
  }
  return e;
}

//  XX.XXX.XXX/0001-XX
export function cnpj(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  e.currentTarget.maxLength = 18;
  let { value } = e.currentTarget;
  if (!value.match(/^(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})$/)) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d{2})$/, '$1-$2');
    e.currentTarget.value = value;
  }
  return e;
}

export function dateMask(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  e.currentTarget.maxLength = 10;
  let { value } = e.currentTarget;
  value = value.replace(/^(\d\d)(\d)$/g, '$1/$2');
  value = value.replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2');
  value = value.replace(/[^\d/]/g, '');
  e.currentTarget.value = value;
  return e;
}

export function toUpper(
  e: React.FormEvent<HTMLInputElement>,
): React.FormEvent<HTMLInputElement> {
  const { value } = e.currentTarget;
  e.currentTarget.value = value.toUpperCase();
  return e;
}
