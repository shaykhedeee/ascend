// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Image Service (Section 24)
// Multi-provider image generation — NO Cloudflare or paid service required.
//
// CASCADE ORDER:
//   1. Pollinations.ai   — Completely FREE. No API key. No sign-up. Public API.
//   2. Hugging Face      — FREE inference API. Requires HF_ACCESS_TOKEN env var.
//                          Model: black-forest-labs/FLUX.1-schnell (fast + quality)
//   3. Gemini            — Google free tier via GOOGLE_AI_STUDIO_KEY.
//
// SETUP:
//   - Pollinations:  nothing needed, works out of the box.
//   - HuggingFace:   get free token at huggingface.co/settings/tokens → add to .env
//                    HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//   - Gemini:        already in your .env as GOOGLE_AI_STUDIO_KEY
// ═══════════════════════════════════════════════════════════════════════════════

export interface ImageResult {
  success: boolean;
  imageData?: string; // base64 data URL  (data:image/jpeg;base64,...)
  provider: 'pollinations' | 'huggingface' | 'gemini' | 'none';
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanitise prompt for safe URL encoding (Pollinations) or API body
// ─────────────────────────────────────────────────────────────────────────────
function sanitise(prompt: string): string {
  return prompt
    .replace(/[^\w\s,.()\-–']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 1: Pollinations.ai — 100% free, no key, returns PNG from URL
// https://image.pollinations.ai/prompt/{encodedPrompt}
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithPollinations(prompt: string): Promise<ImageResult> {
  try {
    const encoded = encodeURIComponent(sanitise(prompt));
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&model=flux`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Pollinations HTTP ${response.status}`);

    // Response is binary PNG — read as arrayBuffer → base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = response.headers.get('content-type') ?? 'image/jpeg';

    return {
      success: true,
      imageData: `data:${mimeType};base64,${base64}`,
      provider: 'pollinations',
    };
  } catch (err) {
    return { success: false, provider: 'pollinations', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 2: HuggingFace Inference API — free tier
// Model: black-forest-labs/FLUX.1-schnell (fast, high quality)
// Sign up at huggingface.co → Settings → Access Tokens (free account)
// Env var: HF_ACCESS_TOKEN
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithHuggingFace(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.HF_ACCESS_TOKEN;
  if (!apiKey) return { success: false, provider: 'huggingface', error: 'HF_ACCESS_TOKEN not set' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40_000);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: sanitise(prompt) }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`HuggingFace ${response.status}: ${body.slice(0, 200)}`);
    }

    // Response is binary image blob
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = response.headers.get('content-type') ?? 'image/jpeg';

    return {
      success: true,
      imageData: `data:${mimeType};base64,${base64}`,
      provider: 'huggingface',
    };
  } catch (err) {
    return { success: false, provider: 'huggingface', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 3: Google Gemini — free tier via AI Studio
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithGemini(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.GOOGLE_AI_KEY || process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) return { success: false, provider: 'gemini', error: 'GOOGLE_AI_STUDIO_KEY not configured' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a motivational, visually striking image for a vision board: ${prompt}` }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Gemini ${response.status}: ${await response.text()}`);

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> } }>;
    };

    const imagePart = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!imagePart?.inlineData) throw new Error('No image in Gemini response');

    return {
      success: true,
      imageData: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      provider: 'gemini',
    };
  } catch (err) {
    return { success: false, provider: 'gemini', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entrypoint: cascade through providers
// ─────────────────────────────────────────────────────────────────────────────
export async function generateImage(prompt: string): Promise<ImageResult> {
  // 1. Pollinations — free, no setup
  const p = await generateWithPollinations(prompt);
  if (p.success) return p;
  console.warn('[ImageGen] Pollinations failed:', p.error, '— trying HuggingFace');

  // 2. HuggingFace — free tier (requires HF_ACCESS_TOKEN)
  const hf = await generateWithHuggingFace(prompt);
  if (hf.success) return hf;
  console.warn('[ImageGen] HuggingFace failed:', hf.error, '— trying Gemini');

  // 3. Gemini — free tier
  const gemini = await generateWithGemini(prompt);
  if (gemini.success) return gemini;
  console.warn('[ImageGen] Gemini failed:', gemini.error, '— no image available');

  return { success: false, provider: 'none', error: 'All image providers failed' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate all panel images with adaptive rate limiting.
// Pollinations handles ~1 req/s safely; add 1.5s between requests.
// Returns Map<panelId, base64DataUrl> for successful generations only.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateBoardImages(
  panels: Array<{ id: string; imagePrompt: string }>
): Promise<Map<string, string>> {
  const images = new Map<string, string>();

  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    const result = await generateImage(panel.imagePrompt);

    if (result.success && result.imageData) {
      images.set(panel.id, result.imageData);
      console.log(`[ImageGen] Panel ${i + 1}/${panels.length} generated via ${result.provider}`);
    } else {
      console.warn(`[ImageGen] Panel ${i + 1}/${panels.length} failed — panel will show icon placeholder`);
    }

    // Adaptive delay: Pollinations is free but rate-limited; 1.5s is safe
    if (i < panels.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return images;
}

