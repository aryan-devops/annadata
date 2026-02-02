'use server';
/**
 * @fileOverview A flow for translating text using Google's generative models.
 *
 * - translate - A function that handles text translation.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z
    .string()
    .describe(
      'The target language code (e.g., "hi" for Hindi, "en" for English).'
    ),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

// This is the exported function client components will call.
export async function translate(
  input: TranslateInput
): Promise<TranslateOutput> {
  return translateFlow(input);
}

// This defines the Genkit flow.
const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async ({text, targetLanguage}) => {
    const translationPrompt = ai.definePrompt({
      name: 'translationPrompt',
      input: {schema: z.object({text: z.string(), language: z.string()})},
      output: {schema: z.object({translated: z.string()})},
      prompt: `You are an expert translator for an agricultural application. Translate the following English text to the language with the code '{{{language}}}'. Provide ONLY the translated text, without any additional formatting, explanations, or quotation marks.

Text to translate: {{{text}}}`,
    });

    const {output} = await translationPrompt({text, language: targetLanguage});

    if (!output) {
      throw new Error('Translation failed to produce output.');
    }

    return {translatedText: output.translated};
  }
);
