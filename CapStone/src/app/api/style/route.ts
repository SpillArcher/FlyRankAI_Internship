import { NextResponse } from "next/server";
import { getWearableCatalog, type Product } from "@/lib/catalog";

interface StyleRequest {
  interests: string[];
  favoriteColor: string;
  favoriteSeason: string;
  currentSeason: string;
  moodOccasion: string;
}

interface ModelPick {
  id: number;
  reason: string;
}

interface ModelResponse {
  stylistNote: string;
  picks: ModelPick[];
}

function buildSystemPrompt(catalog: Product[]): string {
  const catalogSummary = catalog.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    category: p.category,
  }));

  return `You are a personal stylist for an online clothing shop. You do not filter by rigid categories — you read a person's stated interests, colors, seasons, and mood/occasion, and pick items that actually fit that context.

Here is the current catalog (id, title, price, category):
${JSON.stringify(catalogSummary)}

Pick 4 to 6 items. Every "id" you return MUST be one of the ids from the catalog above — never invent an id. Prefer variety across categories where it makes sense for the occasion. Give one warm, specific sentence describing the overall vibe, and one specific reason per pick.`;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    stylistNote: { type: "STRING" },
    picks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "INTEGER" },
          reason: { type: "STRING" },
        },
        required: ["id", "reason"],
      },
    },
  },
  required: ["stylistNote", "picks"],
};

export async function POST(request: Request) {
  let body: StyleRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { interests, favoriteColor, favoriteSeason, currentSeason, moodOccasion } = body;

  if (!interests?.length || !moodOccasion?.trim()) {
    return NextResponse.json(
      { error: "Tell us at least one interest and what you're feeling like today." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY." },
      { status: 500 }
    );
  }

  let catalog: Product[];
  try {
    catalog = await getWearableCatalog();
  } catch {
    return NextResponse.json(
      { error: "Could not load the product catalog. Try again in a moment." },
      { status: 502 }
    );
  }

  if (catalog.length === 0) {
    return NextResponse.json(
      { error: "The catalog is empty right now — nothing to recommend." },
      { status: 502 }
    );
  }

  const userMessage = `Interests: ${interests.join(", ")}
Favorite color: ${favoriteColor || "no strong preference"}
Favorite season: ${favoriteSeason || "not specified"}
Current season: ${currentSeason || "not specified"}
Mood / occasion right now: ${moodOccasion}`;

  const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
  const requestBody = JSON.stringify({
    system_instruction: { parts: [{ text: buildSystemPrompt(catalog) }] },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  async function callGemini(key: string): Promise<Response> {
    return fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": key,
      },
      body: requestBody,
    });
  }

  let geminiRes: Response;
  try {
    geminiRes = await callGemini(apiKey);

    // A 503 usually means the model was briefly overloaded and clears
    // within a second or two — one silent retry here means the person
    // using the page often never sees it at all, instead of making them
    // manually click submit again.
    if (geminiRes.status === 503) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      geminiRes = await callGemini(apiKey);
    }
  } catch {
    return NextResponse.json(
      { error: "Could not reach the AI service. Try again in a moment." },
      { status: 502 }
    );
  }

  if (!geminiRes.ok) {
    const errorBody = await geminiRes.text().catch(() => "(no body)");
    console.error(`Gemini API error ${geminiRes.status}:`, errorBody);

    const message =
      geminiRes.status === 503
        ? "The AI model is temporarily overloaded. Try again in a few seconds."
        : geminiRes.status === 429
          ? "Rate limit hit. Wait a moment before trying again."
          : `AI service returned an error (${geminiRes.status}).`;

    return NextResponse.json({ error: message }, { status: 502 });
  }

  const data = await geminiRes.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    return NextResponse.json(
      { error: "AI service returned an unexpected response shape." },
      { status: 502 }
    );
  }

  let modelResponse: ModelResponse;
  try {
    modelResponse = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Could not parse the AI's response as structured data." },
      { status: 502 }
    );
  }

  const catalogById = new Map(catalog.map((p) => [p.id, p]));
  const picks = (modelResponse.picks ?? [])
    .filter((pick) => catalogById.has(pick.id))
    .map((pick) => ({
      product: catalogById.get(pick.id)!,
      reason: pick.reason,
    }));

  if (picks.length === 0) {
    return NextResponse.json(
      { error: "The AI didn't return any valid picks. Try rephrasing your mood/occasion." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    stylistNote: modelResponse.stylistNote,
    picks,
  });
}
