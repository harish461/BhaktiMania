import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "संपर्क करें (Contact Us) — BhaktiMania",
  description:
    "BhaktiMania से संपर्क करें। संपादकीय प्रतिक्रिया, सुझाव, तथ्य सुधार या कॉपीराइट संबंधी प्रश्नों के लिए हमारे संपर्क दिशानिर्देश देखें।",
  alternates: {
    canonical: getCanonicalUrl("/contact"),
  },
  openGraph: {
    title: "संपर्क करें (Contact Us) | BhaktiMania",
    description:
      "संपादकीय प्रतिक्रिया, सुझाव, तथ्य सुधार या कॉपीराइट संबंधी प्रश्नों के लिए BhaktiMania से संपर्क करें।",
    type: "website",
  },
};

const inquiryCategories = [
  {
    title: "संपादकीय प्रतिक्रिया एवं सुझाव",
    desc: "यदि आपके पास किसी लेख की विषयवस्तु, भाषा या प्रस्तुति के संबंध में कोई सकारात्मक सुझाव या टिप्पणी है।",
  },
  {
    title: "तथ्य सुधार एवं संशोधन (Corrections)",
    desc: "यदि आपको किसी लेख में कोई तथ्यात्मक, भाषाई या शास्त्रीय त्रुटि दिखाई दे, तो कृपया संदर्भ सहित सूचित करें।",
  },
  {
    title: "कॉपीराइट एवं बौद्धिक संपदा",
    desc: "सामग्री या छवियों के उचित उपयोग अथवा बौद्धिक संपदा से जुड़े किसी भी प्रश्न के समाधान के लिए।",
  },
  {
    title: "सामान्य सहयोग एवं पूछताछ",
    desc: "BhaktiMania मंच के साथ जुड़ने, लेख साझा करने या सामान्य जिज्ञासाओं के समाधान हेतु।",
  },
];

export default function ContactPage() {
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
              संपर्क करें
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                संवाद एवं सुझाव
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-4">
              संपर्क करें (Contact Us)
            </h1>

            <p className="text-base sm:text-lg text-[#5A6065] leading-relaxed font-body">
              BhaktiMania अपने पाठकों के विचारों, सुझावों और रचनात्मक प्रतिक्रिया का सदैव स्वागत करता है।
            </p>
          </header>

          <div className="space-y-8 font-body">
            {/* Contact Guidelines & Channels */}
            <article className="bg-white rounded-2xl border border-[#6B1724]/10 p-6 sm:p-10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] space-y-8 text-[#1F2326]">
              <section className="space-y-4">
                <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                  आप हमसे किन विषयों पर संपर्क कर सकते हैं?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {inquiryCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#F8F4EC]/60 border border-[#6B1724]/10"
                    >
                      <h3 className="font-heading text-base text-[#6B1724] mb-1.5">
                        {cat.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5A6065] leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Status Notice Regarding Backend Mail Connection */}
              <section className="p-5 sm:p-6 rounded-xl bg-[#F8F4EC] border-l-4 border-[#D97706] space-y-3">
                <div className="flex items-center gap-2 text-[#6B1724] font-heading font-semibold text-base sm:text-lg">
                  <span className="text-[#D97706]" aria-hidden="true">✦</span>
                  <span>संपर्क तंत्र एवं ईमेल स्थिति (Contact Configuration)</span>
                </div>
                <p className="text-sm sm:text-base text-[#5A6065] leading-relaxed">
                  BhaktiMania वर्तमान में अपने सार्वजनिक उत्पादन विन्यास (Production Launch) के अंतिम चरण में है। 
                  पाठकों के साथ पूर्ण पारदर्शिता बनाए रखने हेतु, हम किसी भी अप्रमाणित या छद्म ईमेल का उपयोग नहीं करते हैं।
                </p>
                <div className="pt-2 text-xs sm:text-sm text-[#1F2326] bg-white/80 p-3 rounded-lg border border-[#6B1724]/10">
                  <span className="font-medium text-[#6B1724]">आधिकारिक संपर्क ईमेल: </span>
                  <span className="font-mono text-[#5A6065]">
                    [उत्पादन डोमेन सेटअप के समय कॉन्फ़िगर किया जाएगा / Configurable at Launch]
                  </span>
                </div>
                <p className="text-xs text-[#5A6065] leading-relaxed">
                  * उत्पादन डोमेन और DNS सेटिंग्स पूर्ण होने के तुरंत बाद समर्पित संपादकीय ईमेल पता यहां प्रकाशित किया जाएगा।
                </p>
              </section>

              <section className="space-y-4 pt-4 border-t border-[#6B1724]/8">
                <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                  संपादकीय संशोधन नीति (Correction Guidelines)
                </h2>
                <p className="text-sm sm:text-base text-[#5A6065] leading-relaxed">
                  यदि आप किसी लेख में संशोधन का अनुरोध कर रहे हैं, तो कृपया संबंधित लेख का शीर्षक अथवा URL, प्रासंगिक संदर्भ (शास्त्र, ग्रंथ, या आधिकारिक स्त्रोत), और सुधार का संक्षिप्त विवरण अवश्य सम्मिलित करें। हमारी संपादकीय टीम 48–72 कार्य घंटों के भीतर उसकी समीक्षा करती है।
                </p>
              </section>

              <div className="pt-4 border-t border-[#6B1724]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-[#5A6065]">
                  BhaktiMania के उद्देश्य और संपादकीय टीम के बारे में अधिक जानें।
                </span>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-xl bg-[#F8F4EC] text-[#6B1724] font-medium border border-[#6B1724]/15 hover:bg-white transition-colors"
                >
                  हमारे बारे में पढ़ें →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
