import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { env } from "../../config/env";

@Injectable()
export class LlmService {
  private readonly client = new OpenAI({
    apiKey: env.siliconFlow.apiKey,
    baseURL: env.siliconFlow.baseUrl
  });

  async chat(userPrompt: string, systemPrompt?: string, model?: string) {
    return this.client.chat.completions.create({
      model: model || env.siliconFlow.model,
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: userPrompt }
      ]
    });
  }
}
