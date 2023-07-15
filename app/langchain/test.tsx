import { OpenAI } from "langchain/llms/openai";
// import { PromptTemplate } from "langchain/prompts";
// import { LLMChain } from "langchain/chains";
// import { BufferMemory } from "langchain/memory";
// import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

export default async function LangchainFunc(props: any) {
  require("dotenv").config();
  const apiKey = process.env.OPENAI_API_KEY;
  //   const model = new OpenAI({openAIApiKey: apiKey, temperature: 0.9});
  const chat = new ChatOpenAI({ openAIApiKey: apiKey, temperature: 0 });

  //   const template = "What is a good name for a company that makes {product}?";
  //   const prompt = new PromptTemplate({
  //     template: template,
  //     inputVariables: ["product"],
  //   });
  //   const chain = new LLMChain({ llm: model, prompt: prompt });
  //   const res = await chain.call({ product: "colorful socks" });
  //   console.log(res);
  // const memory = new BufferMemory();
  // const chain = new ConversationChain({ llm: model, memory: memory });
  // const res1 = await chain.call({ input: "Hi! I'm Anuj." });
  // console.log(res1);
  // const res2 = await chain.call({ input: "What's my name?" });
  // console.log(res2);

  // const chat = new OpenAI({
  //     streaming: true,
  //     callbacks: [
  //       {
  //         handleLLMNewToken(token: string) {
  //           process.stdout.write(token);
  //         },
  //       },
  //     ],
  //   });
  //   await chat.call("Write me a song about sea.");

  // const string = "to be or not to be";
  const instructions = `You are a helpful poetry tutor, help me find the rhyme for the end of the third line`;
  const poem = `When I consider how my light is spent,
  Ere half my days, in this dark world and wide,
  And that one Talent which is death to`;
  
  const response = await chat.call([
    new SystemMessage(instructions),
    new HumanMessage(poem),
  ]);

  console.log(response.lc_kwargs.content);

// const text = 'Hello, world!'
// const tokenLimit = 10

// // Encode text into tokens
// const tokens = encode(text)
// console.log(tokens);
// // Decode tokens back into text
// const decodedText = decode(tokens)
// console.log(decodedText)
// const withinTokenLimit = isWithinTokenLimit(text, tokenLimit)
// console.log(withinTokenLimit);
  return (
    <>
      <h1>LANGCHAIN</h1>
    </>
  );
}
