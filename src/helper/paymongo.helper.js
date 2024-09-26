const { PAYMONGO_SK } = process.env;

const checkoutAPI = async (line_items) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Basic " + btoa(PAYMONGO_SK),
    },
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items,
          description: "Eye Care",
          payment_method_types: ["gcash", "card"],
        },
      },
    }),
  };

  const fetchRes = await fetch(
    "https://api.paymongo.com/v1/checkout_sessions",
    options
  );

  return await fetchRes.json();
};

const getCheckoutSession = async (checkout_id) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: "Basic " + btoa(PAYMONGO_SK),
    },
  };

  const fetchRes = await fetch(
    "https://api.paymongo.com/v1/checkout_sessions/" + checkout_id,
    options
  );

  return await fetchRes.json();
};

const expireCheckoutSession = async (checkout_id) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: "Basic " + btoa(PAYMONGO_SK),
    },
  };

  const fetchRes = await fetch(
    "https://api.paymongo.com/v1/checkout_sessions/" + checkout_id + "/expire",
    options
  );

  return await fetchRes.json();
};

module.exports = {
  checkoutAPI,
  getCheckoutSession,
  expireCheckoutSession,
};
