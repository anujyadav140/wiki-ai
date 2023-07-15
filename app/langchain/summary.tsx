import { useState } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

export default async function LangchainSummary(props: any) {
    const [summary, setSummary] = useState("");
    require("dotenv").config();
    const apiKey = process.env.OPENAI_API_KEY;
    const chat = new ChatOpenAI({ openAIApiKey: apiKey, temperature: 0 });
    const response = await chat.call([
        new SystemMessage(
          "You are a very helpful summarizer, you will summarize 1000s of words of text in under 300 words, do not exceed that limit."
        ),
        new HumanMessage(props.text),
      ]);
      setSummary(response.lc_kwargs.content);
      console.log(response.lc_kwargs.content);
    return (
        <>
        <p>{summary}</p>
        </>
    );
}