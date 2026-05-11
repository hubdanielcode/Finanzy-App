const regex = {
  /* - Autenticação - */

  name: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  /* - Edição - */

  title: /^(?!.*(.)\1{2,})[A-Za-zÀ-ÿ0-9 .,\-!?()]+$/,
  amount: /^\d+([.,]\d{0,2})?$/,
};

export { regex };
