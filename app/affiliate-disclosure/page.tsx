import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "एफिलिएट प्रकटीकरण (Affiliate Disclosure) — BhaktiMania",
  description:
    "BhaktiMania का एफिलिएट प्रकटीकरण। जानिए हमारी व्यावसायिक पारदर्शिता, भविष्य के एफिलिएट संबंधों और निष्पक्ष संपादकीय नीति के बारे में।",
  alternates: {
    canonical: getCanonicalUrl("/affiliate-disclosure"),
  },
  openGraph: {
    title: "एफिलिएट प्रकटीकरण (Affiliate Disclosure) | BhaktiMania",
    description: "BhaktiMania एफिलिएट नीति एवं पारदर्शिता प्रकटीकरण।",
    type: "website",
  },
};

export default function AffiliateDisclosurePage() {
  const lastUpdated = "22 सितंबर 2026";

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F0]">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container-desktop max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="ब्रेडक्रम्ब" className="mb-6 text-xs sm:text-sm text-[#6B706A] flex items-center gap-2 font-body">
            <Link href="/" className="hover:text-[#C85A17] transition-colors">
              होम
            </Link>
            <span aria-hidden="true">→</span>
            <span className="text-[#C85A17] font-medium" aria-current="page">
              एफिलिएट प्रकटीकरण
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(200,154,60,0.12)] border border-[rgba(200,154,60,0.3)] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C85A17]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#A8440B] uppercase font-ui">
                व्यावसायिक पारदर्शिता एवं प्रकटीकरण
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#C85A17] tracking-tight leading-tight mb-3">
              एफिलिएट प्रकटीकरण (Affiliate Disclosure)
            </h1>

            <p className="text-xs sm:text-sm text-[#6B706A] font-body">
              अंतिम अद्यतन: {lastUpdated}
            </p>
          </header>

          {/* Disclosure Content Body */}
          <article className="bg-white rounded-2xl border border-[rgba(200,154,60,0.25)] p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(40,25,15,0.06)] space-y-8 font-body text-[#1C1C17] leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-[#C85A17] tracking-tight">
                1. पारदर्शिता के प्रति हमारी प्रतिबद्धता
              </h2>
              <p className="text-base leading-[1.8] text-[#3A3D39]">
                BhaktiMania अपने पाठकों के साथ पूर्ण निष्पक्षता, सत्यता और पारदर्शिता में विश्वास करता है। हमारा मुख्य उद्देश्य सनातन धर्म, भक्ति परंपरा, भगवद्गीता, पवित्र धामों और संतों की अमृतवाणी को प्रामाणिक एवं सरल रूप में प्रस्तुत करना है। जब आप हमारी वेबसाइट पढ़ते हैं, तो हमारा यह दायित्व है कि हम इस मंच के संचालन और भविष्य की व्यावसायिक सहभागिताओं के प्रति पूरी तरह पारदर्शी रहें।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[rgba(200,154,60,0.18)]">
              <h2 className="font-heading text-xl sm:text-2xl text-[#C85A17] tracking-tight">
                2. एफिलिएट लिंक क्या होते हैं? (Affiliate Links Explained)
              </h2>
              <p className="text-base leading-[1.8] text-[#3A3D39]">
                एफिलिएट लिंक एक विशेष प्रकार का वेब-लिंक होता है। जब आप किसी लेख में सुझाई गई किसी प्रामाणिक पुस्तक (जैसे गीताप्रेस गोरखपुर के ग्रंथ), पूजन सामग्री, या जप माला के लिंक पर क्लिक करके साझेदार ई-कॉमर्स वेबसाइट से कोई पात्र खरीदारी करते हैं, तो BhaktiMania को उस बिक्री पर एक छोटा कमीशन प्राप्त हो सकता है।
              </p>
              <div className="p-4 sm:p-5 rounded-xl bg-[#F8F4EC] border-l-4 border-[#C85A17] text-sm text-[#4A4E49] space-y-1">
                <strong className="text-[#1C1C17] block font-semibold">
                  पाठकों के लिए महत्वपूर्ण तथ्य (No Extra Cost to You):
                </strong>
                <p>
                  एफिलिएट लिंक के माध्यम से खरीदारी करने पर <strong>आपके लिए वस्तु के मूल्य में कोई वृद्धि नहीं होती है</strong>। आपको ठीक वही सामान्य मूल्य देना होता है जो उस वेबसाइट पर सीधे जाकर खरीदने पर मिलता। यह कमीशन ई-कॉमर्स प्रदाता द्वारा मंच के संचालन सहयोग हेतु दिया जाता है।
                </p>
              </div>
            </section>

            <section className="space-y-3 pt-6 border-t border-[rgba(200,154,60,0.18)]">
              <h2 className="font-heading text-xl sm:text-2xl text-[#C85A17] tracking-tight">
                3. अमेज़न एसोसिएट्स कार्यक्रम प्रकटीकरण (Amazon Associates Disclosure)
              </h2>
              <p className="text-base leading-[1.8] text-[#3A3D39]">
                BhaktiMania अमेज़न एसोसिएट्स इंडिया कार्यक्रम (Amazon Associates India Program) का एक प्रतिभागी है। यह कार्यक्रम उन वेबसाइटों को विज्ञापन शुल्क और कमीशन अर्जित करने का माध्यम प्रदान करता है जो Amazon.in से जुड़े लिंक उपलब्ध कराते हैं।
              </p>
              <div className="p-4 rounded-xl bg-[#FBF8F0] border border-[rgba(200,154,60,0.35)] text-sm sm:text-base text-[#1C1C17]">
                <p className="font-serif italic font-medium text-[#C85A17]">
                  &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
                </p>
                <p className="text-xs text-[#6B706A] mt-1.5 font-ui">
                  (अमेज़न एसोसिएट के रूप में, BhaktiMania योग्य खरीदारियों से नियमानुसार कमीशन प्राप्त कर सकता है।)
                </p>
              </div>
            </section>

            <section className="space-y-3 pt-6 border-t border-[rgba(200,154,60,0.18)]">
              <h2 className="font-heading text-xl sm:text-2xl text-[#C85A17] tracking-tight">
                4. संपादकीय स्वतंत्रता एवं प्रामाणिकता (Editorial Independence)
              </h2>
              <p className="text-base leading-[1.8] text-[#3A3D39]">
                हमारी संपादकीय प्राथमिकता सदैव निष्पक्ष एवं आध्यात्मिक रूप से प्रामाणिक सामग्री प्रदान करना है। किसी भी व्यावसायिक अथवा एफिलिएट संबंध से हमारी संपादकीय स्वतंत्रता प्रभावित नहीं होती:
              </p>
              <ul className="space-y-3 pl-2 sm:pl-4 text-sm sm:text-base text-[#4A4E49]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89A3C] select-none text-base">✦</span>
                  <span><strong>केवल प्रासंगिक चयन:</strong> हम केवल उन्हीं पुस्तकों (जैसे प्रामाणिक भगवद्गीता, सुंदरकांड, शिव पुराण) या आध्यात्मिक साधनों का सुझाव देते हैं जो लेख के विषय से सीधे जुड़े हों और साधक के लिए वास्तव में उपयोगी हों।</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89A3C] select-none text-base">✦</span>
                  <span><strong>कमीशन-मुक्त निष्पक्षता:</strong> किसी वस्तु के सुझाव का आधार उसका कमीशन नहीं, बल्कि उसकी धार्मिक व साहित्यिक प्रामाणिकता है।</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89A3C] select-none text-base">✦</span>
                  <span><strong>स्पष्ट प्रकटीकरण:</strong> यदि किसी लेख में कोई एफिलिएट लिंक या सुझाई गई वस्तु सम्मिलित होगी, तो वहां स्पष्ट रूप से प्रकटीकरण (Affiliate Disclosure) प्रदर्शित रहेगा।</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-[rgba(200,154,60,0.18)]">
              <h2 className="font-heading text-xl sm:text-2xl text-[#C85A17] tracking-tight">
                5. पूछताछ एवं संपर्क
              </h2>
              <p className="text-base leading-[1.8] text-[#3A3D39]">
                हमारी एफिलिएट, विज्ञापन अथवा संपादकीय नीतियों के संबंध में यदि आपके मन में कोई भी प्रश्न या सुझाव है, तो आप हमारे{" "}
                <Link href="/contact" className="text-[#C85A17] font-medium underline hover:text-[#A8440B]">
                  संपर्क पृष्ठ (Contact Us)
                </Link>{" "}
                के माध्यम से हमसे सीधे संपर्क कर सकते हैं।
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

