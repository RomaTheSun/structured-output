import { z } from "zod"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateObject } from "ai";

const recipeSchema = z.object({
    name: z.string().describe("The name of the recipe"),
    description: z.string().describe("A description of the recipe").optional(),
    ingredients: z
        .array(z.object({
            name: z.string().describe("The name of the ingredient"),
            quantity: z.string().describe("The quantity of the ingredient"),
            unit: z.string().describe("The unit of the ingredient"),
        }))
        .describe("A list of ingredients").optional(),
    steps: z
        .array(z.object({
            step: z.string().describe("The step of the recipe"),
            description: z.string().describe("A description of the step"),
        }))
        .describe("A list of steps").optional(),
    tags: z
        .array(z.string().describe("Tags for the recipe"))
        .describe("A list of tags").optional(),
})

export async function POST(req: Request) {
    const { prompt } = await req.json()

    try {
        const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
        if (!apiKey) {
            return Response.json(
                {
                    error: "OpenRouter API key is missing. Please add OPENROUTER_API_KEY to your environment variables.",
                },
                { status: 401 },
            )
        }
        const openrouter = createOpenRouter({
            apiKey: apiKey,
        });

        const result = await generateObject({
            model: openrouter("openai/gpt-4o-mini"),
            prompt: prompt,
            schema: recipeSchema,
        });

        console.log("Generated structured output result:", JSON.stringify(result, null, 2))
        console.log("Generated object:", JSON.stringify(result.object, null, 2))


        return new Response(JSON.stringify(result.object), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
}