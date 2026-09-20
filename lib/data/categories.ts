import type { Metadata } from "next";
import { siteConfig, getCanonicalUrl } from "@/lib/config/site";

export type DevotionalCategory = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  symbol: string;
  intro?: string;
  relatedSlugs: string[];
};

export const categoriesData: DevotionalCategory[] = [
  {
    slug: "hanuman",
    title: "हनुमान जी",
    metaTitle: "हनुमान जी | भक्ति, प्रेरणा और ज्ञान",
    description:
      "हनुमान जी की भक्ति, प्रेरणादायक प्रसंग, मंत्र और आध्यात्मिक विचार।",
    symbol: "श्री राम",
    intro:
      "पवनपुत्र श्री हनुमान जी भक्ति, शक्ति, समर्पण और निस्वार्थ सेवा के सर्वोच्च आदर्श हैं। यहां हनुमान जी की साधना, चालीसा और प्रेरणादायक विचारों का संग्रह प्रस्तुत है।",
    relatedSlugs: ["bhakti-vichar", "bhagavad-gita", "radha-krishna", "festivals"],
  },
  {
    slug: "radha-krishna",
    title: "राधा कृष्ण",
    metaTitle: "राधा कृष्ण | प्रेम, लीला और भक्ति",
    description:
      "राधा-कृष्ण की भक्ति, प्रेम, लीलाओं और आध्यात्मिक संदेशों से जुड़े लेख।",
    symbol: "राधे",
    intro:
      "श्री राधा-कृष्ण का दिव्य संबंध प्रेम, समर्पण और निष्काम भक्ति का परम स्वरूप है। यहां राधा-कृष्ण भक्ति और उनकी लीलाओं से जुड़े लेख संकलित हैं।",
    relatedSlugs: ["vrindavan", "bhagavad-gita", "premanand-ji", "bhakti-vichar"],
  },
  {
    slug: "shiv",
    title: "भगवान शिव",
    metaTitle: "भगवान शिव | महादेव, मंत्र और साधना",
    description:
      "महादेव, शिव भक्ति, मंत्र, कथाओं और आध्यात्मिक ज्ञान से जुड़ी सामग्री।",
    symbol: "ॐ नमः शिवाय",
    intro:
      "देवाधिदेव महादेव सरलता, वैराग्य और परम कल्याण के प्रतीक हैं। यहां भगवान शिव की भक्ति, पंचाक्षर मंत्र और कथाओं से जुड़ी सामग्री उपलब्ध है।",
    relatedSlugs: ["bhakti-vichar", "festivals", "hanuman", "bhagavad-gita"],
  },
  {
    slug: "bhagavad-gita",
    title: "श्रीमद्भगवद्गीता",
    metaTitle: "श्रीमद्भगवद्गीता | श्लोक, संदेश और जीवन दर्शन",
    description:
      "गीता के श्लोक, जीवन से जुड़े संदेश और सरल भाषा में आध्यात्मिक ज्ञान।",
    symbol: "गीता",
    intro:
      "श्रीमद्भगवद्गीता सनातन धर्म का शाश्वत ज्ञानग्रंथ है, जो कर्मयोग, मन के नियंत्रण और आंतरिक शांति के व्यावहारिक सूत्र सिखाता है।",
    relatedSlugs: ["radha-krishna", "bhakti-vichar", "hanuman", "shiv"],
  },
  {
    slug: "festivals",
    title: "त्योहार एवं व्रत",
    metaTitle: "त्योहार एवं व्रत | सनातन पर्व, नियम और महत्व",
    description:
      "एकादशी, जन्माष्टमी, नवरात्रि, शिवरात्रि और अन्य धार्मिक पर्वों की जानकारी।",
    symbol: "दीप",
    intro:
      "सनातन परंपरा के व्रत और पर्व आत्मसंयम, भक्ति और आध्यात्मिक उत्सव के पावन अवसर हैं। यहां प्रमुख धार्मिक पर्वों की जानकारी संकलित है।",
    relatedSlugs: ["bhakti-vichar", "vrindavan", "shiv", "radha-krishna"],
  },
  {
    slug: "vrindavan",
    title: "वृंदावन एवं धाम",
    metaTitle: "वृंदावन एवं धाम | दर्शन, मंदिर और यात्रा गाइड",
    description:
      "वृंदावन, मथुरा और प्रमुख धार्मिक स्थलों से जुड़ी यात्रा एवं आध्यात्मिक जानकारी।",
    symbol: "राधे राधे",
    intro:
      "वृंदावन धाम भक्ति और प्रेम की पावन स्थली है। यहां धाम दर्शन, प्रमुख मंदिरों और आध्यात्मिक यात्रा से जुड़े उपयोगी मार्गदर्शक लेख पढ़ें।",
    relatedSlugs: ["radha-krishna", "premanand-ji", "festivals", "bhakti-vichar"],
  },
  {
    slug: "premanand-ji",
    title: "प्रेमानंद जी",
    metaTitle: "प्रेमानंद जी | विचार, सत्संग और भक्ति मार्ग",
    description:
      "प्रेमानंद जी महाराज से जुड़े सार्वजनिक रूप से उपलब्ध विचारों, प्रसंगों और भक्ति संबंधी विषयों पर सामग्री।",
    symbol: "ॐ",
    intro:
      "वृंदावन के श्रद्धेय संत पूज्य प्रेमानंद जी महाराज से जुड़े सार्वजनिक रूप से उपलब्ध सत्संग विचार, नाम-जप का महत्व और भक्ति मार्ग पर मार्गदर्शन।",
    relatedSlugs: ["vrindavan", "radha-krishna", "bhakti-vichar", "bhagavad-gita"],
  },
  {
    slug: "bhakti-vichar",
    title: "भक्ति विचार",
    metaTitle: "भक्ति विचार | मन की शांति और सकारात्मक चिंतन",
    description:
      "मन की शांति, सकारात्मक जीवन और भक्ति से जुड़े छोटे लेकिन सार्थक विचार।",
    symbol: "शांति",
    intro:
      "व्यस्त जीवन में मन को शांत करने, ईश्वर का स्मरण बनाए रखने और सकारात्मक चिंतन के लिए सरल एवं प्रेरक भक्ति विचार।",
    relatedSlugs: ["bhagavad-gita", "hanuman", "radha-krishna", "festivals"],
  },
];

export function getCategoryBySlug(slug: string): DevotionalCategory | undefined {
  return categoriesData.find((cat) => cat.slug === slug);
}

export function getRelatedCategories(currentSlug: string): DevotionalCategory[] {
  const current = getCategoryBySlug(currentSlug);
  if (!current) {
    return categoriesData.filter((cat) => cat.slug !== currentSlug).slice(0, 4);
  }
  return current.relatedSlugs
    .map((slug) => getCategoryBySlug(slug))
    .filter((cat): cat is DevotionalCategory => cat !== undefined && cat.slug !== currentSlug)
    .slice(0, 4);
}

export function getCategoryMetadata(slug: string): Metadata {
  const category = getCategoryBySlug(slug);
  if (!category) {
    return {
      title: "श्रेणी उपलब्ध नहीं है",
    };
  }

  return {
    title: category.metaTitle,
    description: category.description,
    alternates: {
      canonical: getCanonicalUrl(`/${category.slug}`),
    },
    openGraph: {
      title: `${category.metaTitle} | ${siteConfig.name}`,
      description: category.description,
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.metaTitle} | ${siteConfig.name}`,
      description: category.description,
    },
  };
}
