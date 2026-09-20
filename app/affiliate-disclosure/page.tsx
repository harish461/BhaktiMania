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
              एफिलिएट प्रकटीकरण
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                व्यावसायिक पारदर्शिता
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-3">
              एफिलिएट प्रकटीकरण (Affiliate Disclosure)
            </h1>

            <p className="text-xs sm:text-sm text-[#5A6065] font-body">
              अंतिम अद्यतन: {lastUpdated}
            </p>
          </header>

          {/* Disclosure Content Body */}
          <article className="bg-white rounded-2xl border border-[#6B1724]/10 p-6 sm:p-10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] space-y-8 font-body text-[#1F2326] leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                1. पारदर्शिता के प्रति हमारी प्रतिबद्धता
              </h2>
              <p className="text-base leading-[1.8]">
                BhaktiMania अपने पाठकों के साथ पूर्ण ईमानदारी और पारदर्शिता में विश्वास करता है। हम चाहते हैं कि जब आप हमारी वेबसाइट पढ़ें, तो आपको यह स्पष्ट रूप से ज्ञात हो कि भविष्य में इस मंच का आर्थिक संचालन किस प्रकार प्रबंधित किया जा सकता है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                2. एफिलिएट लिंक क्या होते हैं?
              </h2>
              <p className="text-base leading-[1.8]">
                एफिलिएट लिंक एक विशेष प्रकार का वेब-लिंक होता है। यदि कोई पाठक उस लिंक पर क्लिक करके किसी साझेदार वेबसाइट (जैसे ई-कॉमर्स पुस्तक विक्रेता, पूजन सामग्री प्रदाता आदि) से कोई पात्र वस्तु खरीदता है, तो BhaktiMania को उस बिक्री पर एक छोटा कमीशन प्राप्त हो सकता है।
              </p>
              <div className="p-4 rounded-xl bg-[#F8F4EC] border-l-4 border-[#D97706] text-sm text-[#5A6065]">
                <strong className="text-[#1F2326] block mb-1">
                  महत्वपूर्ण तथ्य (No Extra Cost to You):
                </strong>
                एफिलिएट लिंक के माध्यम से खरीदारी करने पर <strong>आपके लिए वस्तु के मूल्य में कोई वृद्धि नहीं होती है</strong>। आपको वही मूल्य देना होता है जो उस वेबसाइट पर सामान्य रूप से उपलब्ध होता है।
              </div>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                3. वर्तमान परिचालन स्थिति (Current Status)
              </h2>
              <p className="text-base leading-[1.8]">
                <strong>वर्तमान में BhaktiMania किसी विशिष्ट एफिलिएट नेटवर्क से सक्रिय रूप से संबद्ध नहीं है</strong> और न ही हमारी वेबसाइट पर कोई लाइव एफिलिएट उत्पाद सूची या स्वचालित ट्रैकिंग कोड सक्रिय है। यह नीति भविष्य की संभावित सहभागिताओं के लिए एक पारदर्शी कानूनी आधार के रूप में पूर्व-प्रकाशित की गई है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                4. संपादकीय स्वतंत्रता एवं सिद्धांत (Editorial Independence)
              </h2>
              <p className="text-base leading-[1.8]">
                हमारी संपादकीय प्राथमिकता सदैव निष्पक्ष एवं आध्यात्मिक रूप से प्रामाणिक जानकारी प्रदान करना है:
              </p>
              <ul className="space-y-2.5 pl-4 text-sm sm:text-base text-[#5A6065]">
                <li className="flex items-start gap-2">
                  <span className="text-[#D97706] select-none">✦</span>
                  <span>हम केवल उन्हीं पुस्तकों अथवा धार्मिक संदर्भों का उल्लेख करेंगे जो लेख के विषय से सीधे प्रासंगिक और पाठकों के हित में हों।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D97706] select-none">✦</span>
                  <span>किसी व्यावसायिक कमीशन के कारण हम कभी भी अपनी संपादकीय निष्पक्षता अथवा धार्मिक सत्यता से समझौता नहीं करेंगे।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D97706] select-none">✦</span>
                  <span>यदि किसी लेख में एफिलिएट लिंक सम्मिलित होगा, तो वहां स्पष्ट रूप से प्रकटीकरण सूचना (Affiliate Disclosure) प्रदर्शित की जाएगी।</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                5. पूछताछ एवं संपर्क
              </h2>
              <p className="text-base leading-[1.8]">
                हमारी एफिलिएट अथवा संपादकीय नीतियों के संबंध में किसी भी प्रश्न के लिए आप हमारे{" "}
                <Link href="/contact" className="text-[#6B1724] underline hover:text-[#52111C]">
                  संपर्क पृष्ठ
                </Link>{" "}
                पर जा सकते हैं।
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
