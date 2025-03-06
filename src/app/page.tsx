"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { map } from "zod";

export default function StructuredOutputDemo() {
  const [prompt, setPrompt] = useState("Generate a recipe for a vegetarian lasagna.");
  const [structuredOutput, setStructuredOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Raw result:", result);
      setStructuredOutput(result);
      console.log("Client received structured object:", result);
    } catch (err) {
      console.error("Error processing result:", err);
      setStructuredOutput(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Recipe Maker</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter a prompt to generate structured data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="min-h-[200px]"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Generating..." : "Generate Structured Output"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md min-h-[200px] overflow-auto">
              {error ? (
                <div className="text-red-500">Error: {error}</div>
              ) : structuredOutput ? (
                // <pre className="whitespace-pre-wrap">{JSON.stringify(structuredOutput, null, 2)}</pre>
                <pre className="whitespace-pre-wrap">
                  <h1>Name: {structuredOutput.name}</h1>
                  <br></br>
                  <p>Description: {structuredOutput.description}</p>
                  <br></br>
                  <h2>Ingredients:</h2>
                  <br></br>
                  {structuredOutput.ingredients.map((ingredient: any) => (
                    <div key={ingredient.name}>
                      <p>ingredient:{ingredient.name}</p> 
                      <p>The quantity of the ingredient:{ingredient.quantity}</p> 
                      <p>The unit of the ingredient:{ingredient.unit}</p>
                      <br></br> 
                    </div>
                  ))}
                  <h2>Steps:</h2>
                  <br></br>
                  {structuredOutput.steps.map((step: any) => (
                    <div key={step.step}>
                      <p>№ of the step: {step.step}</p>
                      <p>Description of the step: {step.description}</p>
                      <br></br>
                    </div>
                  ))}
                  <h2>Tags:</h2>
                  {structuredOutput.tags.map((tag: string) => (
                    <p key={tag}>{tag}</p>
                  ))}
                </pre>
              ) : (
                <div className="text-muted-foreground">Generated structured data will appear here</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}