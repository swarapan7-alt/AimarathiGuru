import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'refund';
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  const getTitle = () => {
    switch (type) {
      case 'privacy':
        return 'Privacy Policy (गोपनीयता धोरण)';
      case 'terms':
        return 'Terms & Conditions (अटी व शर्ती)';
      case 'refund':
        return 'Refund Policy (परतावा धोरण)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-lg font-marathi-title">{getTitle()}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-slate-700 text-xs sm:text-sm font-marathi-sub space-y-4 max-h-[70vh] overflow-y-auto leading-relaxed">
          {type === 'privacy' && (
            <>
              <p><strong>१. माहिती संकलन:</strong> AI Marathi Guru (Swara Udyog) केवळ नोंदणी, प्रमाणपत्र आणि कोर्स संवादासाठी तुमचे नाव, ईमेल, मोबाईल नंबर आणि जिल्हा संकलित करते.</p>
              <p><strong>२. माहिती सुरक्षा:</strong> तुमची कोणतीही वैयक्तिक माहिती कोणत्याही तृतीय पक्षाला विकली किंवा शेअर केली जात नाही. सर्व पेमेंट प्रक्रियांसाठी Razorpay चे 256-bit एन्क्रिप्शन वापरले जाते.</p>
              <p><strong>३. संपर्क:</strong> गोपनीयता धोरणाबाबत अधिक माहितीसाठी 9801555171 वर संपर्क साधू शकता.</p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p><strong>१. लाइव्ह क्लास नियम:</strong> कोर्स दिलेल्या वेळेनुसार (सकाळी 11 वा. किंवा संध्याकाळी 7 वा.) Google Meet वर थेट होईल. दिलेल्या वेळेत उपस्थित राहणे ही विद्यार्थ्याची जबाबदारी आहे.</p>
              <p><strong>२. बौद्धिक संपदा:</strong> कोर्समधील PDF नोट्स व मटेरियल केवळ वैयक्तिक वापरासाठी आहे. ते व्यावसायिक पुनर्विक्रीसाठी वापरता येणार नाही.</p>
              <p><strong>३. प्रमाणपत्र:</strong> क्लास उपस्थिती व पूर्णतेनंतर डिझिटल प्रमाणपत्र दिले जाईल.</p>
            </>
          )}

          {type === 'refund' && (
            <>
              <p><strong>१. फी संरचना:</strong> नोंदणी फी फक्त ₹१९९ आहे जी पूर्णपणे लाइव्ह ट्रेनिंग आणि डिजिटल रिसोर्सेससाठी आहे.</p>
              <p><strong>२. रिफंड नियम:</strong> जर तांत्रिक कारणामुळे किंवा आमच्या कडून क्लास रद्द झाला तर १००% फी परत केली जाईल. इतर कारणांसाठी नोंदणीनंतर फी रिफंड केली जाणार नाही, पण तुम्ही पुढील रविवारी क्लास री-शेड्युल करू शकता.</p>
              <p><strong>३. मदत:</strong> पेमेंट किंवा रिफंडच्या चौकशीसाठी 9801555171 वर कॉल करा.</p>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
          >
            समजले (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
