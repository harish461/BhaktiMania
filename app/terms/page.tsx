import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "नियम और शर्तें (Terms & Conditions) — BhaktiMania",
  description:
    "BhaktiMania की नियम और शर्तें। जानिए वेबसाइट के उपयोग, सामग्री के स्वामित्व, कॉपीराइट और सीमाओं के बारे में आवश्यक नियम।",
  alternates: {
    canonical: getCanonicalUrl("/terms"),
  },
  openGraph: {
    title: "नियम और शर्तें (Terms & Conditions) | BhaktiMania",
    description: "BhaktiMania वेबसाइट उपयोग की नियम और शर्तें।",
    type: "website",
  },
};

export default function TermsPage() {
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
              नियम और शर्तें
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                वेबसाइट उपयोग दिशानिर्देश
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-3">
              नियम और शर्तें (Terms & Conditions)
            </h1>

            <p className="text-xs sm:text-sm text-[#5A6065] font-body">
              अंतिम अद्यतन: {lastUpdated}
            </p>
          </header>

          {/* Terms Content Body */}
          <article className="bg-white rounded-2xl border border-[#6B1724]/10 p-6 sm:p-10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] space-y-8 font-body text-[#1F2326] leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                1. मंच का उपयोग एवं स्वीकृति (Acceptance of Terms)
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania (&quot;वेबसाइट&quot;) पर उपलब्ध सामग्री का उपयोग करके आप इन नियमों और शर्तों का पालन करने की सहमति व्यक्त करते हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया वेबसाइट का उपयोग न करें।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                2. बौद्धिक संपदा एवं कॉपीराइट (Intellectual Property)
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania पर प्रकाशित सभी मौलिक लेख, संपादकीय विश्लेषण, संकलित विचार, और साइट डिजाइन BhaktiMania अथवा उसके सामग्री रचनाकारों की बौद्धिक संपदा हैं। 
              </p>
              <p className="text-base leading-[1.8]">
                आप व्यक्तिगत और गैर-व्यावसायिक अध्ययन हेतु लेख पढ़ सकते हैं अथवा उचित श्रेय (credit/attribution) और मूल लिंक के साथ छोटा अंश साझा कर सकते हैं। संपूर्ण लेख की अनधिकृत प्रतिलिपि (plagiarism) या व्यावसायिक पुनर्प्रकाशन वर्जित है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                3. धार्मिक एवं संपादकीय सामग्री की सीमाएं (Editorial Content Scope)
              </h2>
              <p className="text-base leading-[1.8]">
                हमारी सामग्री सनातन धर्म के शास्त्रों, लोक-परंपराओं और आध्यात्मिक विचारों के अध्ययन पर आधारित है। सनातन परंपरा अत्यंत विशाल है और विभिन्न संप्रदायों या ग्रंथों में कथाओं, तिथियों अथवा व्याख्याओं में भिन्नता स्वाभाविक है।
              </p>
              <p className="text-base leading-[1.8]">
                BhaktiMania किसी भी गुरु, संत, मठ अथवा धार्मिक संस्थान का आधिकारिक प्रतिनिधि होने का दावा नहीं करता है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                4. बाह्य लिंक एवं भावी व्यावसायिक संबंध (External & Affiliate Links)
              </h2>
              <p className="text-base leading-[1.8]">
                वेबसाइट पर बाह्य स्रोतों के लिंक हो सकते हैं। भविष्य में, मंच के रखरखाव हेतु कुछ लिंक एफिलिएट लिंक हो सकते हैं, जिनका पूरा विवरण हमारे{" "}
                <Link href="/affiliate-disclosure" className="text-[#6B1724] underline hover:text-[#52111C]">
                  एफिलिएट प्रकटीकरण
                </Link>{" "}
                में दिया गया है। बाह्य वेबसाइटों की सामग्री या सेवाओं के लिए BhaktiMania उत्तरदायी नहीं होगा।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                5. निषिद्ध आचरण (Prohibited Conduct)
              </h2>
              <p className="text-base leading-[1.8]">
                उपयोगकर्ता वेबसाइट की सुरक्षा को भंग करने, सर्वर पर अत्यधिक भार डालने, अनधिकृत स्वचालित स्क्रैपिंग करने, अथवा किसी भी प्रकार की दुर्भावनापूर्ण सामग्री प्रसारित करने के लिए इस मंच का उपयोग नहीं करेंगे।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                6. दायित्व की सीमा (Limitation of Liability)
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania पर दी गई जानकारी &quot;जैसी है&quot; (as is) आधार पर प्रदान की जाती है। यद्यपि हम सामग्री की शुद्धता और प्रामाणिकता का पूरा ध्यान रखते हैं, फिर भी किसी अनजानी भूल, तकनीकी त्रुटि अथवा व्याख्यात्मक अंतर के कारण हुए किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए BhaktiMania कानूनी रूप से उत्तरदायी नहीं होगा।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                7. शर्तों में संशोधन एवं संपर्क (Changes & Inquiries)
              </h2>
              <p className="text-base leading-[1.8]">
                हम किसी भी समय इन नियमों में परिवर्तन करने का अधिकार सुरक्षित रखते हैं। इन शर्तों से संबंधित किसी भी प्रश्न के लिए आप हमारे{" "}
                <Link href="/contact" className="text-[#6B1724] underline hover:text-[#52111C]">
                  संपर्क पृष्ठ
                </Link>{" "}
                के माध्यम से जुड़ सकते हैं।
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
