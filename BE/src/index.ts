import { Hono } from "hono";
import { generateText, generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

type Bindings = {
  DB: D1Database;
  GOOGLE_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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

    return c.json(result);
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

    const biasSchema = z.object({
      biases: z.array(
        z.object({
          name: z.string().describe("The name of the cognitive bias"),
          percentage: z
            .number()
            .min(0)
            .max(100)
            .describe("Confidence percentage of bias presence (0-100)"),
        })
      ),
    });

    const { object: biasAnalysisResult } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: biasSchema,
      system: `You are an expert in cognitive biases and psychology. 
      Analyze the given scenario and identify cognitive biases present.
      For each bias, provide a name, a percentage indicating how strongly the bias is present (0-100%),
      and a brief description of how it manifests in the scenario.
      Common biases include: anchoring bias, confirmation bias, availability heuristic, 
      dunning-kruger effect, hindsight bias, etc. Only include biases that are actually present.`,
      prompt: text,
    });
    if (!biasSchema.parse(biasAnalysisResult)) {
      return c.json({ error: "No biases found" }, 400);
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
    const biasAnalysis: BiasAnalysis = {
      id: crypto.randomUUID(),
      scenario: text,
      biases: biasAnalysisResult.biases,
      summary: summary,
      createdAt: new Date().toISOString(),
    };

    // Store in D1 database
    const db = c.env.DB;
    await db
      .prepare(
        `INSERT INTO bias_analyses (id, scenario, biases, summary, created_at) 
       VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        biasAnalysis.id,
        biasAnalysis.scenario,
        JSON.stringify(biasAnalysis.biases),
        biasAnalysis.summary,
        biasAnalysis.createdAt
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
        `SELECT id, scenario, biases, summary, created_at as createdAt 
       FROM bias_analyses 
       ORDER BY created_at DESC`
      )
      .all();

    const formattedResults = results.map((result: any) => ({
      ...result,
      biases: JSON.parse(result.biases),
    }));

    return c.json(formattedResults);
  } catch (error) {
    console.error("History error:", error);
    return c.json({ error: "Failed to retrieve history" }, 500);
  }
});

type BiasAnalysis = {
  id: string;
  scenario: string;
  biases: {
    name: string;
    percentage: number;
  }[];
  summary: string;
  createdAt: string;
};

export default app;
