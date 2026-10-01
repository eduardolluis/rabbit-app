import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <button
        type="button"
        onClick={() =>
          onSuccess({
            id: `DEMO-PAYMENT-${Date.now()}`,
            status: "COMPLETED",
          })
        }
        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
      >
        Complete Demo Order
      </button>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) =>
          actions.order.create({
            purchase_units: [
              { amount: { value: parseFloat(amount || 0).toFixed(2) } },
            ],
          })
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(onSuccess)
        }
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
