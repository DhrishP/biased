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
  "hindsight",
  "actor_observer",
  "optimism",
  "pessimism",
  "status_quo",
  "framing_effect",
  "halo_effect",
  "false_consensus_effect",
  "reactance",
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

const questionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe("A short, on-point question to ask the user to get more context about their thought."),
        options: z.array(z.string()).describe("A list of 3-5 short, tappable options for the question."),
      })
    )
    .min(6)
    .max(10)
    .describe("An array of 5 to 10 questions to ask the user."),
});

app.post("/generate-questions", async (c) => {
	try {
		const { text } = await c.req.json();
		if (!text) {
			return c.json({ error: "Text is required" }, 400);
		}

		const google = createGoogleGenerativeAI({
			apiKey: c.env.GOOGLE_API_KEY,
		});

		const { object: generatedQuestions } = await generateObject({
			model: google("gemini-2.0-flash"),
			schema: questionsSchema,
			system: `You are an expert in cognitive biases and psychology. A user has provided their initial thought or doubt. 
      Your task is to generate a series of clarifying questions to gather more context for a cognitive bias analysis.
      The questions should be simple, direct, and easy to answer on a mobile device.
      For each question, provide a short list of tappable, multiple-choice options.
      The goal is to understand the user's emotional state, the situation, and their underlying assumptions.`,
			prompt: `Generate questions for the following thought: "${text}"`,
		});

		return c.json(generatedQuestions);
	} catch (error) {
		console.error("Question generation error:", error);
		return c.json({ error: "Failed to generate questions" }, 500);
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
      system: `You are an expert in cognitive biases and psychology. Analyze the user's input, which includes an initial thought, answers to clarifying questions, and optional additional details.
      Your task is to identify which cognitive biases are present in the user's reasoning.

      For each bias you identify, provide a confidence score from 0-100 indicating how strongly the bias is present. The scores for different biases are independent and should NOT sum to 100.
      Only include biases that are clearly present in the text. If no biases are detected, return an empty array.

      Use only the following bias IDs and their definitions:
      - confirmation: The tendency to search for, interpret, favor, and recall information in a way that confirms or supports one's preexisting beliefs.
      - anchoring: Relying too heavily on the first piece of information offered when making decisions.
      - availability: Overestimating the likelihood of events that are more easily recalled in memory, often because of their recency or emotional impact.
      - survivorship: Focusing on the people or things that "survived" some process and inadvertently overlooking those that did not because of their lack of visibility.
      - bandwagon: The tendency to do or believe things because many other people do or believe the same.
      - dunning_kruger: The tendency for unskilled individuals to overestimate their own ability and for experts to underestimate their own ability.
      - negativity: The tendency to give more weight to negative experiences or information than positive ones.
      - sunk_cost: Continuing an action or endeavor as a result of previously invested resources (time, money, or effort), even if it's no longer the most rational choice.
      - hindsight: The tendency to see past events as being more predictable than they actually were.
      - actor_observer: The tendency to attribute one's own actions to external causes while attributing other people's behaviors to internal causes.
      - optimism: The tendency to be overly optimistic, overestimating favorable and pleasing outcomes.
      - pessimism: The tendency to overestimate the likelihood of negative outcomes.
      - status_quo: The tendency to prefer that things stay the same, seeing any change as a loss.
      - framing_effect: Drawing different conclusions from the same information, depending on how that information is presented.
      - halo_effect: The tendency for a positive impression of a person, company, brand, or product in one area to positively influence one's opinion or feelings in other areas.
      - false_consensus_effect: The tendency to overestimate the extent to which one's own opinions, beliefs, preferences, values, and habits are normal and typical of those of others.
      - reactance: The tendency to do the opposite of what you are being told to do, in order to assert your sense of freedom.
      `,
      prompt: text,
    });

    if (!biasSchema.parse(biasAnalysisResult)) {
      return c.json({ error: "Invalid bias analysis result" }, 400);
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
