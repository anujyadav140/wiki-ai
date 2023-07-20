import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";


const langchanSummary = async (buttonText: string, toDoSummaryText: string) => {
    const chat = new ChatOpenAI({
        openAIApiKey: "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",
        temperature: 0,
      });
      const template =
      "You are a very helpful summarizer, you will summarize 1000s of words of text in {instruction}";
    const summaryPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(template),
      HumanMessagePromptTemplate.fromTemplate("{toDoSummaryText}"),
    ]);
    console.log(summaryPrompt);

    const summaryResponse = await chat.generatePrompt([
        await summaryPrompt.formatPromptValue({
          instruction: buttonText,
          toDoSummaryText: toDoSummaryText,
        }),
      ]);
      return summaryResponse;
}

export default langchanSummary;