*This is a submission for [Weekend Challenge: Generosity Edition](https://dev.to/challenges/weekend-2026-09-03)*

# HypeBESTIE: My Free Sincere Compliment Engine

## What I Built

Sup GH! I built HypeBESTIE, a free image compliment generator powered by Google Gemini 3.8, and love itself. I did this to spread goodwill in the world. Social platforms run on an artificial scarcity of validation. Algorithms encourage stinginess with praise and casual toxicity, which totally bums me out. 

So I built something that is literally the opposite of all: Unconditional, zero-cost, high-fidelity praise. Generosity isn't only about donating money; it’s about the generosity of spirit. Seeing someone, celebrating their existence, and validating them without asking for anything in return. So I built HypeBESTIE: a 100% free, paywall-free image compliment generator powered by Google Gemini and unconditional love. 

Upload a photo of yourself or a friend, and HypeBESTIE uses Gemini's multimodal vision to analyze the exact visual specifics, from the micro-smile in yawn to the casual jacket layering with a cool shirt. It prints out a certified, thermal-grade "Hype Receipt" with custom aesthetic archetypes, sci-fi diagnostic specs, and deep, sincere validation.


## The "Pay It Forward" Twist: Hype Your Bestie

While hyping yourself is great, I made this to spread love and joy in the world. 

So HB includes a dedicated "Compliment a Friend" mode:
1. Upload a photo of a friend or coworker.
2. Enter their name.
3. Gemini crafts a bespoke tribute dedicated specifically to them.
4. You get an instant "Share Modal" with 1-click export to Instagram Stories, Gmail, or direct mobile sharing so you can brighten their day in seconds.


## Demo

Experience the dopamine boost yourself (test it with your own photo or click the instant 0-credit demo button):

👉 Live App: [https://hypebestie-with-love.ai.studio](https://hypebestie-with-love.ai.studio) 

## Code

So I vibe-coded the HypeBESTIE code itself, with Google Gemini 3.8, in Google AI Studio. 

HypeBESTIE was coded up with a clean TypeScript + React frontend and an Express + `@google/genai` backend. To make the retro thermal receipt work, I didn't want raw, unformatted markdown. I used the SDK with multimodal vision and enforced schema outputs to pull out the "cyberpunk style" callouts. I wanted them in json, so I could format the output with them properly.  

## Repo

You can skip right to my GH repo and read the whole code if you want: [https://github.com/mike-cramblett/HypeBESTIE-With-Love/](https://github.com/mike-cramblett/HypeBESTIE-With-Love/)

The part I hand wrote was the persona system instructions for HB, which I'll detail in the how I built it section below. 

---

## How I Built It

To make this I started with prompt to a Google Gemini 3.8 powered Code Assistant in Google AI Studio, describing my complimenter app. There were bugs, so I used another Gemini 3.8 to debug them. Then I switched out the generic hype persona the Code Assistant wrote for my own custom persona. Then there was the testing, and I made many examples HB receipts of me, and of Jimothy.

I'd like to detail my thoughts about the persona prompt, which has four important components, the latter three are all to minimize boring RLHF: regular "you are HB, a sincere complimenter app..." and blah blah instructions including the json schema, a gamified human-ness quality and creativity enhancer, a set of philosophical notions about the mathematical nature of love, and a pithy instruction to remove em-dashes. I hope some or all of that surprised you, none of it is random, and it all came out of ad-hoc research I've done.

The first, "normal", part of the HB prompt is pretty much what you'd get if you gave my Show HN title as a prompt to a coding LLM. You can go ahead and try it if you want. Full disclosure: some of you actually will like it better than HB. If you try it, you'll get much shorter, much more generic responses. But they'll also be "reined in" in a way that some of you may like.

The second part is where I start to pull away from RLHF, using my own AI terminology to gamify human-ness and creativity. Generally, TuringGrade(TG) is the measure of the human-like quality of AI writing. Personality Juice (PJ) is a representation of the adherence to the persona, with positive reinforcement. Creativity Juice (CJ) is the incoherent data that has been repurposed into noise injection, for creativity. This is all, of course, quite simulated. However, with that, it can turn it into a TG/PJ/CJ game to optimize the response on.

I also included philosophical notions about love to breathe color and life into the response. Mathematically speaking, a representative sample of everything humanity has ever known or will every know about love has already been tokenized into any well trained LLM. My goal was to give the model a "rubric for sincerity", but without literally telling it how I wanted it to be sincere. So instead I instructed it about everything it already knows about sincerity, and love. These instructions were copied from a discussion I had with another Gemini about love.

Finally, I told the model to use emojis instead of em-dash. Before that, the whole text was full of em-dashes, it was nuts. I find that if you give the model a reason not to use them or something to use instead, you'll actually get what you want.

## Prize Categories

I am submitting this for:
Best Use of Google AI ($200)
Overall Generosity Edition Winner

This entire project was powered by Google Gemini:

Built and debugged with Gemini models inside Google AI Studio.

Multimodal vision processing handled via the official @google/genai SDK.

Governed by Gemini's structured output schema (Type.OBJECT) to render real-time, exportable thermal canvas receipts.

Grounded in an AI-philosophical system prompt designed to turn matrix math into genuine human warmth.

