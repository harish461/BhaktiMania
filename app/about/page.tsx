import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "हमारे बारे में (About Us) — BhaktiMania",
  description:
    "BhaktiMania सनातन धर्म, भक्ति परंपराओं, भगवद्गीता, और आध्यात्मिक चिंतन को समर्पित एक प्रामाणिक डिजिटल मंच है। जानिए हमारे उद्देश्य और संपादकीय दृष्टिकोण के बारे में।",
  alternates: {
    canonical: getCanonicalUrl("/about"),
  },
  openGraph: {
    title: "हमारे बारे में (About Us) | BhaktiMania",
    description:
      "BhaktiMania सनातन धर्म, भक्ति परंपराओं, भगवद्गीता, और आध्यात्मिक चिंतन को समर्पित एक प्रामाणिक डिजिटल मंच है।",
    type: "website",
  },
};

const coreTopics = [
  {
    title: "राधा कृष्ण एवं वृंदावन",
    desc: "श्री राधा-माधव की दिव्य लीलाएं, वृंदावन धाम का आध्यात्मिक महत्व और प्रेमाभक्ति।",
    href: "/radha-krishna",
  },
  {
    title: "हनुमान साधना",
    desc: "श्री हनुमान जी की भक्ति, संकटमोचन साधना, सुंदरकांड एवं चालीसा के आध्यात्मिक भाव।",
    href: "/hanuman",
  },
  {
    title: "भगवान शिव एवं साधना",
    desc: "महादेव की महिमा, पंचाक्षर मंत्र साधना, महाशिवरात्रि और शिव तत्त्व का रहस्य।",
    href: "/shiv",
  },
  {
    title: "श्रीमद्भगवद्गीता ज्ञान",
    desc: "कर्मयोग, ज्ञानयोग और भक्तियोग के व्यावहारिक सूत्र जो दैनिक जीवन में शांति प्रदान करें।",
    href: "/bhagavad-gita",
  },
  {
    title: "व्रत एवं सनातन त्योहार",
    desc: "एकादशी, नवरात्र, दीपावली और प्रमुख हिंदू पर्वों की विधि, तिथि और आध्यात्मिक महत्व।",
    href: "/festivals",
  },
  {
    title: "भक्ति विचार एवं सत्संग",
    desc: "संतों के उपदेश, नाम-जप का महत्व और मन को स्थिर करने वाले सरल भक्ति विचार।",
    href: "/bhakti-vichar",
  },
];

export default function AboutPage() {
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
              हमारे बारे में
            </span>
          </nav>

          {/* Header Banner */}
          <header className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                भक्ति • ज्ञान • शांति
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-4">
              हमारे बारे में (About BhaktiMania)
            </h1>

            <p className="text-base sm:text-lg text-[#5A6065] leading-relaxed font-body">
              BhaktiMania एक स्वतंत्र एवं प्रामाणिक आध्यात्मिक मंच है, जिसका उद्देश्य सनातन धर्म की समृद्ध परंपराओं, भक्ति रस और जीवनोपयोगी ज्ञान को सरल व सहज हिंदी में जन-जन तक पहुंचाना है।
            </p>
          </header>

          {/* Main Article/Content Card */}
          <article className="bg-white rounded-2xl border border-[#6B1724]/10 p-6 sm:p-10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] space-y-8 font-body text-[#1F2326] leading-relaxed">
            <section className="space-y-4">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                हमारा उद्देश्य (Our Mission)
              </h2>
              <p className="text-base sm:text-lg leading-[1.8]">
                आज की भागदौड़ भरी जिंदगी में प्रत्येक व्यक्ति मानसिक शांति, आत्मिक संबल और सकारात्मक दिशा की खोज में है। BhaktiMania का लक्ष्य धार्मिक और आध्यात्मिक विषयों को केवल किताबी जानकारी के रूप में नहीं, बल्कि दैनिक जीवन में अपनाने योग्य मार्गदर्शन के रूप में प्रस्तुत करना है।
              </p>
              <p className="text-base sm:text-lg leading-[1.8]">
                चाहे वह भगवद्गीता के अमर उपदेश हों, नाम-जप का महत्व हो, या भगवान शिव और श्री हनुमान जी की कृपा प्राप्ति के उपाय हों—हमारा प्रयास रहता है कि हर विषय को शास्त्रीय संदर्भों और सरल भाषा में प्रस्तुत किया जाए।
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                प्रमुख विषय जिन पर हम लिखते हैं
              </h2>
              <p className="text-sm sm:text-base text-[#5A6065]">
                हमारे लेख निम्नलिखित मुख्य आध्यात्मिक क्षेत्रों पर केंद्रित हैं:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {coreTopics.map((topic) => (
                  <Link
                    key={topic.href}
                    href={topic.href}
                    className="p-4 rounded-xl bg-[#F8F4EC]/60 border border-[#6B1724]/10 hover:border-[#6B1724]/30 hover:bg-[#F8F4EC] transition-all group block"
                  >
                    <h3 className="font-heading text-base text-[#6B1724] group-hover:text-[#52111C] mb-1.5">
                      {topic.title} →
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A6065] leading-relaxed">
                      {topic.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="space-y-4 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                संपादकीय दृष्टिकोण एवं टीम (Editorial Team)
              </h2>
              <p className="text-base sm:text-lg leading-[1.8]">
                BhaktiMania की समस्त सामग्री <strong>BhaktiMania Editorial Team</strong> द्वारा गहन शोध, संदर्भ-पुष्टि और संपादन के उपरांत ही प्रकाशित की जाती है। हम किसी भी प्रकार के अंधविश्वास, अप्रमाणित चमत्कारों या भ्रामक दावों को बढ़ावा नहीं देते।
              </p>
              <p className="text-base sm:text-lg leading-[1.8]">
                हमारा विश्वास है कि सच्ची भक्ति वही है जो मनुष्य के अंतःकरण को शुद्ध करे, समाज में दया और सद्भाव का विस्तार करे, और ईश्वर के प्रति निष्काम प्रेम जगाए।
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[#6B1724]/8">
              <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight">
                स्पष्टीकरण एवं मर्यादा
              </h2>
              <p className="text-sm sm:text-base text-[#5A6065] leading-[1.8]">
                BhaktiMania किसी विशिष्ट संप्रदाय, मठ, मंदिर, या धार्मिक संस्था का आधिकारिक मुखपत्र नहीं है। यह एक स्वतंत्र विचार-मंच है जो सभी सनातन परंपराओं का आदर करता है। धार्मिक, दार्शनिक और पौराणिक कथाओं के संदर्भ विभिन्न ग्रंथों व परंपराओं के अनुसार भिन्न हो सकते हैं।
              </p>
            </section>

            <div className="pt-6 border-t border-[#6B1724]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-[#5A6065]">
                क्या आपके पास कोई सुझाव या प्रश्न है?
              </span>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-xl bg-[#6B1724] text-white font-medium hover:bg-[#52111C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
              >
                संपर्क करें →
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
