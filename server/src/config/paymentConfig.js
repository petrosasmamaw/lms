import { config } from 'dotenv';

config();

export function getPaymentConfig() {
  const monthlyFee = Number(process.env.PAYMENT_MONTHLY_FEE) || 500;
  const receiverName = process.env.PAYMENT_RECEIVER_NAME || 'LMS School';

  return {
    monthlyFee,
    receiverName,
    telebirr: {
      receiverAccount: process.env.PAYMENT_RECEIVER_TELEBIRR || '',
      label: 'Telebirr',
    },
    cbe: {
      receiverAccount: process.env.PAYMENT_RECEIVER_CBE || '',
      label: 'CBE Birr',
    },
  };
}

export function getPublicPaymentConfig() {
  const cfg = getPaymentConfig();
  return {
    monthlyFee: cfg.monthlyFee,
    receiverName: cfg.receiverName,
    methods: {
      telebirr: {
        label: cfg.telebirr.label,
        receiverAccount: cfg.telebirr.receiverAccount,
        receiverName: cfg.receiverName,
      },
      cbe: {
        label: cfg.cbe.label,
        receiverAccount: cfg.cbe.receiverAccount,
        receiverName: cfg.receiverName,
      },
    },
  };
}
