import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "अस्वीकरण (Disclaimer) — BhaktiMania",
  description:
    "BhaktiMania का अस्वीकरण। जानिए हमारी सामग्री के आध्यात्मिक एवं सामान्य सूचनात्मक उद्देश्य, सीमाओं और मार्गदर्शन के संबंध में स्पष्टीकरण।",
  alternates: {
    canonical: getCanonicalUrl("/disclaimer"),
  },
  openGraph: {
    title: "अस्वीकरण (Disclaimer) | BhaktiMania",
    description: "BhaktiMania आध्यात्मिक एवं संपादकीय सामग्री संबंधी अस्वीकरण।",
    type: "website",
  },
};

export default function DisclaimerPage() {
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
              अस्वीकरण
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                महत्वपूर्ण सूचना
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-3">
              अस्वीकरण (Disclaimer)
            </h1>

            <p className="text-xs sm:text-sm text-[#5A6065] font-body">
              अंतिम अद्यतन: {lastUpdated}
            </p>
          </header>

          {/* Disclaimer Content Body */}
          <article className="bg-white rounded-2xl border border-[#6B1724]/10 p-6 sm:p-10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] space-y-8 font-body text-[#1F2326] leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                1. सामान्य सूचनात्मक एवं आध्यात्मिक उद्देश्य
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania पर प्रकाशित सभी लेख, व्रत कथाएं, धार्मिक विधि-विधान, मंत्र, और दार्शनिक विचार केवल <strong>सामान्य सूचनात्मक, सांस्कृतिक एवं आध्यात्मिक स्वाध्याय</strong> के उद्देश्य से प्रस्तुत किए जाते हैं।
              </p>
              <p className="text-base leading-[1.8]">
                हमारा उद्देश्य पाठकों को सनातन परंपरा, भारतीय संस्कृति, और ईश्वर भक्ति से जोड़ना है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                2. पेशेवर सलाह का विकल्प नहीं (Not Professional Advice)
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania पर उपलब्ध किसी भी सामग्री को किसी भी परिस्थिति में <strong>चिकित्सीय (Medical), कानूनी (Legal), अथवा वित्तीय (Financial)</strong> पेशेवर सलाह के रूप में न माना जाए।
              </p>
              <p className="text-base leading-[1.8]">
                शारीरिक व मानसिक स्वास्थ्य संबंधी समस्याओं, उपवास/व्रत के दौरान आहार संबंधी निर्णय, अथवा किसी भी गंभीर व्यक्तिगत निर्णय के लिए कृपया सदैव संबंधित योग्य चिकित्सक अथवा पेशेवर विशेषज्ञ से व्यक्तिगत परामर्श लें।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                3. धार्मिक ग्रंथों एवं परंपराओं में विविधता
              </h2>
              <p className="text-base leading-[1.8]">
                सनातन धर्म के इतिहास में अनेक पुराण, संहिताएं, टीकाएं और क्षेत्रीय परंपराएं विद्यमान हैं। किसी कथा, तिथि गणना (पंचांग भेद) अथवा धार्मिक अनुष्ठान की विधि में विभिन्न विद्वानों, संप्रदायों या पंचांगों के अनुसार अंतर हो सकता है।
              </p>
              <p className="text-base leading-[1.8]">
                पाठकों से अनुरोध है कि वे अपने कुल-परंपरा, स्थानीय पंचांग और अपने गुरुजनों के मार्गदर्शन को सर्वोच्च प्राथमिकता दें।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                4. संतों, गुरुओं एवं संस्थाओं का कोई आधिकारिक प्रतिनिधित्व नहीं
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania किसी भी पूज्य संत (जैसे पूज्य प्रेमानंद जी महाराज, स्वामी विवेकानंद आदि), तीर्थ क्षेत्र (वृंदावन, काशी, अयोध्या आदि), मंदिर ट्रस्ट, अथवा धार्मिक संगठन का <strong>आधिकारिक प्रतिनिधि अथवा अधिकृत मुखपत्र नहीं है</strong>।
              </p>
              <p className="text-base leading-[1.8]">
                संतों के उपदेश एवं उद्धरण सार्वजनिक रूप से उपलब्ध व्याख्यानों एवं प्रवचनों के आधार पर श्रद्धालुओं के कल्याण हेतु श्रद्धापूर्वक संकलित किए जाते हैं। आधिकारिक सूचनाओं अथवा दीक्षा-नियमों हेतु पाठकों को सीधे संबंधित आश्रम अथवा आधिकारिक ट्रस्ट से संपर्क करना चाहिए।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                5. उद्धरणों एवं संदर्भों की पुष्टि
              </h2>
              <p className="text-base leading-[1.8]">
                हम सामग्री की सत्यता और प्रामाणिकता के प्रति अत्यंत सजग रहते हैं। फिर भी, यदि किसी पाठक को किसी उद्धरण, श्लोक अथवा अनुवाद में कोई त्रुटि प्रतीत होती है, तो वे हमारे{" "}
                <Link href="/contact" className="text-[#6B1724] underline hover:text-[#52111C]">
                  संपर्क पृष्ठ
                </Link>{" "}
                के माध्यम से हमें सूचित कर सकते हैं ताकि त्वरित समीक्षा व सुधार किया जा सके।
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
