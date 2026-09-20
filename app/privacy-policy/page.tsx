import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "गोपनीयता नीति (Privacy Policy) — BhaktiMania",
  description:
    "BhaktiMania की गोपनीयता नीति। जानिए हम अपने पाठकों की गोपनीयता का सम्मान कैसे करते हैं, तकनीकी डेटा और भविष्य की सेवाओं के नियम क्या हैं।",
  alternates: {
    canonical: getCanonicalUrl("/privacy-policy"),
  },
  openGraph: {
    title: "गोपनीयता नीति (Privacy Policy) | BhaktiMania",
    description: "BhaktiMania की गोपनीयता नीति एवं डेटा सुरक्षा दिशानिर्देश।",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "20 सितंबर 2026";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container-desktop max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="ब्रेडक्रम्ब" className="mb-6 text-xs sm:text-sm text-[#5A6065] flex items-center gap-2 font-body">
            <Link href="/" className="hover:text-[#6B1724] transition-colors">
              होम
            </Link>
            <span aria-hidden="true">→</span>
            <span className="text-[#6B1724] font-medium" aria-current="page">
              गोपनीयता नीति
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                पारदर्शिता एवं सुरक्षा
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-3">
              गोपनीयता नीति (Privacy Policy)
            </h1>

            <p className="text-xs sm:text-sm text-[#5A6065] font-body">
              अंतिम अद्यतन (Last Updated): {lastUpdated}
            </p>
          </header>

          {/* Policy Document Body */}
          <article className="bg-white rounded-2xl border border-[#6B1724]/10 p-6 sm:p-10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] space-y-8 font-body text-[#1F2326] leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                1. प्रस्तावना (Introduction)
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania (&quot;हम&quot;, &quot;हमारा&quot;, अथवा &quot;मंच&quot;) अपने पाठकों और उपयोगकर्ताओं की निजता का पूर्ण सम्मान करता है। यह गोपनीयता नीति यह स्पष्ट करती है कि जब आप हमारी वेबसाइट का उपयोग करते हैं, तो किस प्रकार की सूचनाएं प्राप्त या उपयोग की जा सकती हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                2. जो सूचनाएं आप स्वेच्छा से प्रदान करते हैं
              </h2>
              <p className="text-base leading-[1.8]">
                वर्तमान में BhaktiMania पर सार्वजनिक पाठकों के लिए खाता (User Account) बनाने या लॉगिन करने की आवश्यकता नहीं है। यदि आप ईमेल या भविष्य के संपर्क माध्यमों द्वारा हमसे संवाद करते हैं, तो आपके द्वारा स्वेच्छा से भेजा गया नाम या ईमेल पता केवल आपके प्रश्न का उत्तर देने हेतु उपयोग किया जाएगा।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                3. तकनीकी लॉग एवं बुनियादी कुकीज़ (Server Logs & Cookies)
              </h2>
              <p className="text-base leading-[1.8]">
                अधिकांश आधुनिक वेब अनुप्रयोगों की भांति, हमारा होस्टिंग अवसंरचना सुरक्षा और प्रदर्शन बनाए रखने हेतु बुनियादी तकनीकी लॉग (जैसे IP पता, ब्राउज़र का प्रकार, अनुरोधित पृष्ठ और समय) स्वचालित रूप से संधारित कर सकता है।
              </p>
              <p className="text-base leading-[1.8]">
                हम प्रशासनिक प्रमाणीकरण सत्रों के अतिरिक्त सामान्य पाठकों पर कोई अनधिकृत या आक्रामक ट्रैकिंग कुकीज़ स्थापित नहीं करते हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                4. भविष्य के विज्ञापन एवं विश्लेषिकी सेवाएं (Advertising & Analytics — Conditional)
              </h2>
              <p className="text-base leading-[1.8]">
                <strong>वर्तमान स्थिति:</strong> वर्तमान में BhaktiMania पर न तो कोई लाइव विज्ञापन नेटवर्क (जैसे Google AdSense) सक्रिय है और न ही तृतीय-पक्ष वेब एनालिटिक्स सॉफ्टवेयर (जैसे Google Analytics) सक्रिय रूप से उपयोगकर्ता ट्रैकिंग कर रहा है।
              </p>
              <p className="text-base leading-[1.8]">
                <strong>भविष्य की शर्तें:</strong> भविष्य में मंच के संचालन व्यय के प्रबंधन हेतु जब Google AdSense अथवा अनुमोदित विज्ञापन प्रणालियों को जोड़ा जाएगा, तो वे तृतीय-पक्ष कुकीज़ का उपयोग प्रासंगिक विज्ञापन दिखाने हेतु कर सकते हैं। उपयोगकर्ता अपने ब्राउज़र सेटिंग्स में जाकर कभी भी कुकीज़ को अक्षम (disable) कर सकते हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                5. तृतीय-पक्ष लिंक एवं एफिलिएट संबंध (Third-Party Links)
              </h2>
              <p className="text-base leading-[1.8]">
                हमारे लेखों में बाह्य संदर्भों, पुस्तकों अथवा प्रासंगिक धार्मिक सामग्री के लिंक हो सकते हैं। यदि भविष्य में किसी एफिलिएट लिंक के माध्यम से पाठक खरीदारी करते हैं, तो उस बाह्य वेबसाइट की अपनी स्वतंत्र गोपनीयता नीति लागू होगी। हमारा अन्य वेबसाइटों की नीतियों अथवा सामग्री पर कोई नियंत्रण नहीं है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                6. डेटा सुरक्षा (Data Security)
              </h2>
              <p className="text-base leading-[1.8]">
                हम अपने मंच की सुरक्षा को अत्यंत गंभीरता से लेते हैं। हमारी वेबसाइट HTTPS एन्क्रिप्शन द्वारा सुरक्षित है, तथा प्रशासनिक प्रणालियों में केवल अधिकृत संपादकीय टीम को ही न्यूनतम आवश्यक विशेषाधिकार (least-privilege access) प्राप्त हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                7. नीति में परिवर्तन (Policy Updates)
              </h2>
              <p className="text-base leading-[1.8]">
                हम समय-समय पर इस गोपनीयता नीति को अद्यतन कर सकते हैं। किसी भी संशोधन की स्थिति में अद्यतन तिथि पृष्ठ के शीर्ष पर प्रकाशित की जाएगी।
              </p>
            </section>

            <div className="pt-6 border-t border-[#6B1724]/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#5A6065]">
              <span>गोपनीयता संबंधी प्रश्नों के लिए:</span>
              <Link
                href="/contact"
                className="text-[#6B1724] font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>संपर्क पृष्ठ देखें</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
