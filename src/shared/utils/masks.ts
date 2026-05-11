const masks = {
  /* - Autenticação - */

  name: (value: string) =>
    value
      .replace(/[^A-Za-zÀ-ÿ ]/g, "")
      .replace(/\s{2,}/g, " ")
      .slice(0, 80),

  email: (value: string) =>
    value.replace(/[^a-zA-Z0-9._%+\-@]/g, "").slice(0, 254),

  /* - Edição - */

  title: (value: string) =>
    value
      .replace(/[^A-Za-zÀ-ÿ0-9 .,\-!?()]/g, "")
      .replace(/\s{2,}/g, " ")
      .slice(0, 30),

  amount: (value: string) =>
    value
      .replace(/[^0-9.,]/g, "")
      .replace(/\./, ",")
      .replace(/(,\d{2})\d+$/, "$1")
      .replace(/,{2,}/g, ","),
};

export { masks };
