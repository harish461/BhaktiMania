/**
 * BhaktiMania — Topic-Aware Devotional AI Image Generator
 * 
 * Creates editorial, cinematic Indian devotional prompts for articles
 * across categories like Radha-Krishna, Hanuman, Shiva, Bhagavad Gita,
 * Vrindavan, Ekadashi, Bhakti Vichar, and Festivals.
 */

export interface AiPromptOptions {
  title: string;
  category?: string;
  categorySlug?: string;
  description?: string;
  seed?: number;
}

export interface GeneratedAiImageCandidate {
  imageUrl: string;
  prompt: string;
  altText: string;
  seed: number;
}

/**
 * Builds a topic-aware devotional prompt tailored to BhaktiMania aesthetics.
 */
export function buildDevotionalPrompt(options: AiPromptOptions): string {
  const { title = "", category = "", categorySlug = "", description = "" } = options;
  const combinedText = `${title} ${category} ${categorySlug} ${description}`.toLowerCase();

  let topicGuidance = "";

  // 1. Radha-Krishna
  if (
    combinedText.includes("radha") ||
    combinedText.includes("krishna") ||
    combinedText.includes("राधा") ||
    combinedText.includes("कृष्ण") ||
    categorySlug.includes("radha-krishna")
  ) {
    topicGuidance =
      "Radha and Krishna divine devotional atmosphere, Vrindavan sacred flower gardens by the Yamuna river at golden twilight, divine selfless love, peacock feather motif, soft sacred halo, warm saffron and gold palette, serene devotional ambiance";
  }
  // 2. Hanuman
  else if (
    combinedText.includes("hanuman") ||
    combinedText.includes("हनुमान") ||
    combinedText.includes("bajrangbali") ||
    combinedText.includes("बजरंगबली") ||
    categorySlug.includes("hanuman")
  ) {
    topicGuidance =
      "Lord Hanuman devotional portrait, gesture of supreme humility, bhakti and selfless surrender, divine inner strength, peaceful mountain sanctuary at sunrise, soft golden saffron aura, sacred vermilion accents, heroic yet profoundly peaceful";
  }
  // 3. Shiva / Mahadev
  else if (
    combinedText.includes("shiv") ||
    combinedText.includes("shiva") ||
    combinedText.includes("शिव") ||
    combinedText.includes("mahadev") ||
    combinedText.includes("महादेव") ||
    combinedText.includes("bholenath") ||
    categorySlug.includes("shiv")
  ) {
    topicGuidance =
      "Bhagwan Shiva in deep meditative peace, majestic Mount Kailash snow peaks background, tranquil dusk sky, sacred crescent moon, sacred trishul and rudraksha, ethereal divine stillness, silver and warm amber glow";
  }
  // 4. Bhagavad Gita / Arjuna
  else if (
    combinedText.includes("gita") ||
    combinedText.includes("गीता") ||
    combinedText.includes("bhagavad") ||
    combinedText.includes("arjuna") ||
    combinedText.includes("अर्जुन") ||
    categorySlug.includes("gita")
  ) {
    topicGuidance =
      "Bhagavad Gita spiritual discourse setting, divine golden chariot at dawn, Lord Krishna imparting timeless wisdom, noble and contemplative Arjuna listening, serene golden atmospheric lighting, sacred cosmic dawn, spiritual enlightenment";
  }
  // 5. Vrindavan / Holy Ghats
  else if (
    combinedText.includes("vrindavan") ||
    combinedText.includes("वृंदावन") ||
    combinedText.includes("mathura") ||
    combinedText.includes("मथुरा") ||
    combinedText.includes("yamuna") ||
    categorySlug.includes("vrindavan")
  ) {
    topicGuidance =
      "Sacred Vrindavan ancient sandstone temples and ghats along the calm Yamuna river, gentle floating oil lamps, evening aarti bells atmosphere, soft mist, warm ivory and marigold hues, poetic and timeless devotional aura";
  }
  // 6. Ekadashi / Vrat / Fasting
  else if (
    combinedText.includes("ekadashi") ||
    combinedText.includes("एकादशी") ||
    combinedText.includes("vrat") ||
    combinedText.includes("व्रत") ||
    combinedText.includes("fasting")
  ) {
    topicGuidance =
      "Sacred Hindu devotional morning puja, traditional brass oil lamps (diya) glowing softly, fresh green tulsi leaves, fragrant yellow marigold blossoms, incense smoke in morning sunbeams, pure peaceful prayer atmosphere";
  }
  // 7. Festivals (Diwali, Holi, Navratri, Shivratri, Janmashtami)
  else if (
    combinedText.includes("festival") ||
    combinedText.includes("त्योहार") ||
    combinedText.includes("diwali") ||
    combinedText.includes("दिवाली") ||
    combinedText.includes("deepavali") ||
    combinedText.includes("holi") ||
    combinedText.includes("होली") ||
    combinedText.includes("navratri") ||
    combinedText.includes("नवरात्रि") ||
    categorySlug.includes("festivals")
  ) {
    topicGuidance =
      "Traditional Indian devotional festival celebration, sacred earthen lamps illuminating an ornate temple courtyard, traditional rangoli and marigold garlands, warm festive radiance, joyous spiritual reverence";
  }
  // 8. Bhakti Vichar / Spiritual Contemplation / Default
  else {
    topicGuidance =
      "Serene Indian spiritual devotion, traditional brass temple lamp glowing with a warm steady flame, peaceful meditation atmosphere, soft natural morning sunlight filtering through ancient carved temple stone pillars, sacred calm";
  }

  // BhaktiMania overarching art direction and negative constraints
  const aestheticStyle =
    "premium devotional editorial photography, realistic fine art composition, cinematic depth of field, warm saffron gold and ivory palette, peaceful devotional mood, 16:9 widescreen aspect ratio";
  const negativePrompts =
    "no text, no letters, no typography, no watermarks, no logos, no distorted hands, no modern elements, no frames, no borders, clean uncluttered composition";

  return `${topicGuidance}, ${aestheticStyle}, ${negativePrompts}`;
}

/**
 * Generates an appropriate Hindi alt text from the article title and category.
 */
export function generateDevotionalAltText(title: string, category?: string): string {
  if (!title) return "भक्तिमय आध्यात्मिक दृश्य — भक्तिमेनिया";
  const cleanTitle = title.trim().replace(/[|—–-].*$/, "").trim();
  if (category) {
    return `${cleanTitle} — ${category.trim()} भक्तिमय दृश्य`;
  }
  return `${cleanTitle} — भक्तिमय कला दृश्य`;
}

/**
 * Creates an AI image candidate object using Pollinations FLUX with topic-aware prompt.
 */
export function generateDevotionalImageCandidate(
  options: AiPromptOptions
): GeneratedAiImageCandidate {
  const seed = options.seed ?? Math.floor(Math.random() * 10000000);
  const prompt = buildDevotionalPrompt(options);
  const encodedPrompt = encodeURIComponent(prompt);

  // Resolution 1200 x 675 (16:9)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=675&nologo=true&seed=${seed}&model=flux`;
  const altText = generateDevotionalAltText(options.title, options.category);

  return {
    imageUrl,
    prompt,
    altText,
    seed,
  };
}
