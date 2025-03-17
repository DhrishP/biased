import { Hono } from "hono";
import { cors } from "hono/cors";
import { generateText, generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

type Bindings = {
  DB: D1Database;
  GOOGLE_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Add CORS middleware
app.use(
  "*",
  cors({
    origin: "*", // In production, you should restrict this to your frontend domain
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

const validBiasIds = [
  "confirmation",
  "anchoring",
  "availability",
  "survivorship",
  "bandwagon",
  "dunning_kruger",
  "negativity",
  "sunk_cost",
] as const;

const biasSchema = z.object({
  biases: z.array(
    z.object({
      id: z.enum(validBiasIds),
      percentage: z
        .number()
        .min(0)
        .max(100)
        .describe("Confidence percentage of bias presence (0-100)"),
    })
  ),
});

app.get("/", (c) => {
  return c.text("Bias Analysis API");
});

app.post("/preview", async (c) => {
  try {
    const { text } = await c.req.json();

    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    const google = createGoogleGenerativeAI({
      apiKey: c.env.GOOGLE_API_KEY,
    });

    const result = generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an AI assistant that helps users improve their scenario descriptions for bias analysis.
      Provide constructive feedback on how to make the scenario more detailed and clear for better bias analysis.
      Suggest specific elements that could be added to provide more context.`,
      messages: [{ role: "user", content: text }],
    });
    const res = (await result).text

    console.log("res",res)

    return c.json({ text: res });
  } catch (error) {
    console.error("Preview error:", error);
    return c.json({ error: "Failed to process preview request" }, 500);
  }
});

app.post("/analyse", async (c) => {
  try {
    const { text } = await c.req.json();

    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    const google = createGoogleGenerativeAI({
      apiKey: c.env.GOOGLE_API_KEY,
    });

    const { object: biasAnalysisResult } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: biasSchema,
      system: `You are an expert in cognitive biases and psychology. 
      Analyze the given scenario and identify cognitive biases present.
      For each bias, provide a percentage indicating how strongly the bias is present (0-100%).
      Only use the following bias IDs: ${validBiasIds.join(", ")}.
      Ensure the percentages sum to 100%.
      Common biases include: anchoring bias, confirmation bias, availability heuristic, 
      dunning-kruger effect, hindsight bias, etc. Only include biases that are actually present.`,
      prompt: text,
    });

    if (!biasSchema.parse(biasAnalysisResult)) {
      return c.json({ error: "Invalid bias analysis result" }, 400);
    }

    // Validate that percentages sum to 100%
    const totalPercentage = biasAnalysisResult.biases.reduce(
      (sum, bias) => sum + bias.percentage,
      0
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return c.json({ error: "Bias percentages must sum to 100%" }, 400);
    }

    const { text: summary } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an expert in cognitive biases and psychology.
      Create a concise summary analysis of the cognitive biases identified in the scenario.
      Explain how these biases interact and their potential impact on decision-making.`,
      prompt: `Scenario: ${text}\n\nIdentified biases: ${JSON.stringify(
        biasAnalysisResult.biases
      )}`,
    });

    // Create a record for the database
    const biasAnalysis = {
      id: crypto.randomUUID(),
      text,
      results: biasAnalysisResult.biases,
      summary,
      timestamp: Date.now(),
    };

    // Store in D1 database
    const db = c.env.DB;
    await db
      .prepare(
        `INSERT INTO bias_analyses (id, text, results, summary, timestamp) 
       VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        biasAnalysis.id,
        biasAnalysis.text,
        JSON.stringify(biasAnalysis.results),
        biasAnalysis.summary,
        biasAnalysis.timestamp
      )
      .run();

    return c.json(biasAnalysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return c.json({ error: "Failed to analyze scenario" }, 500);
  }
});

app.get("/history", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db
      .prepare(
        `SELECT id, text, results, summary, timestamp 
       FROM bias_analyses 
       ORDER BY timestamp DESC`
      )
      .all();

    const formattedResults = results.map((result: any) => ({
      ...result,
      results: JSON.parse(result.results),
    }));

    return c.json(formattedResults);
  } catch (error) {
    console.error("History error:", error);
    return c.json({ error: "Failed to retrieve history" }, 500);
  }
});

export default app;
