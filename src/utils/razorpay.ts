// Razorpay Checkout Utility for Mobile and Desktop
// Provides reliable script loading and standard checkout invocation with UPI Intent support

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isNarrowScreen = window.innerWidth < 768;
  return isMobileUA || isNarrowScreen;
};

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (typeof (window as any).Razorpay !== 'undefined') {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      // Fallback check after 1.5s
      setTimeout(() => {
        resolve(typeof (window as any).Razorpay !== 'undefined');
      }, 1500);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

export interface RazorpayLaunchConfig {
  keyId: string;
  orderId?: string;
  amountInPaise: number;
  name: string;
  description: string;
  prefill: {
    name: string;
    contact: string;
    email?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  onDismiss?: () => void;
  onError?: (error: any) => void;
}

export const launchRazorpayStandardCheckout = async (
  config: RazorpayLaunchConfig
): Promise<boolean> => {
  const isScriptReady = await loadRazorpayScript();
  if (!isScriptReady || typeof (window as any).Razorpay === 'undefined') {
    console.error('Razorpay SDK failed to load.');
    if (config.onError) {
      config.onError(new Error('Razorpay Checkout SDK उपलब्ध नाही.'));
    }
    return false;
  }

  // Ensure key is valid live key
  if (!config.keyId || !config.keyId.startsWith('rzp_live')) {
    console.error('Invalid Razorpay key ID for live checkout:', config.keyId);
    if (config.onError) {
      config.onError(new Error('अवैध Razorpay Live Key.'));
    }
    return false;
  }

  try {
    const options: any = {
      key: config.keyId,
      amount: config.amountInPaise,
      currency: 'INR',
      name: config.name || 'AI Marathi Guru',
      description: config.description || 'Live Online Course Registration Fee',
      order_id: config.orderId || undefined,
      prefill: {
        name: config.prefill.name,
        contact: config.prefill.contact,
        email: config.prefill.email || '',
      },
      notes: config.notes || {},
      theme: {
        color: '#E53935',
      },
      handler: function (response: any) {
        config.onSuccess(response);
      },
      modal: {
        confirm_close: true,
        ondismiss: function () {
          if (config.onDismiss) {
            config.onDismiss();
          }
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on('payment.failed', function (resp: any) {
      console.error('Razorpay payment failed event:', resp.error);
      if (config.onError) {
        config.onError(resp.error);
      }
    });

    rzp.open();
    return true;
  } catch (err) {
    console.error('Error invoking Razorpay checkout:', err);
    if (config.onError) {
      config.onError(err);
    }
    return false;
  }
};
