import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

export default function FlutterwaveButton({
  publicKey,
  amount,
  customerEmail,
  customerName,
  campaignTitle,
  campaignId,
  onSuccess
}) {
  const config = {
    public_key: publicKey,
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: customerEmail,
      name: customerName,
    },
    customizations: {
      title: 'Fund ' + campaignTitle,
      description: 'Investment in Ridan Express',
      logo: 'https://mocha-cdn.com/apple-touch-icon.png',
    },
    meta: {
      campaignId: campaignId
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            console.log(response);
            closePaymentModal();
            if (response.status === "successful") {
              onSuccess(response);
            }
          },
          onClose: () => {
            console.log('Payment closed');
          },
        });
      }}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
      Invest Now
    </button>
  );
}
