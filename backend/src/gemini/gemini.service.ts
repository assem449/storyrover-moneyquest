import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface FinancialScenario {
  scenario: string;
  currentBalance: number;
  options: {
    spend: string;
    save: string;
    invest: string;
  };
}

export interface FinancialConsequence {
  result: string;
  balanceChange: number;
  newBalance: number;
  lesson: string;
  emotion: 'happy' | 'sad' | 'neutral' | 'excited';
}

@Injectable()
export class GeminiService {  // Keep the name for compatibility
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not found. Using mock responses.');
      return;
    }
    
    this.openai = new OpenAI({ apiKey });
    console.log('✅ OpenAI API initialized');
  }

  async generateScenario(age: number, currentBalance: number): Promise<FinancialScenario> {
    if (!this.openai) {
      return this.getMockScenario(currentBalance);
    }

    const prompt = `You are a financial literacy tutor for kids aged ${age}.

Current Balance: $${currentBalance}

Generate a simple, age-appropriate financial scenario where the child needs to make a decision with their money.

Return ONLY valid JSON in this exact format (no markdown, no backticks, no explanations):
{
  "scenario": "A brief, fun story about a financial situation (2-3 sentences)",
  "currentBalance": ${currentBalance},
  "options": {
    "spend": "A fun immediate purchase option",
    "save": "A savings goal option",
    "invest": "A way to potentially grow the money"
  }
}

Make it engaging, relatable, and appropriate for a ${age}-year-old child.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',  // Fast and cheap! Can use 'gpt-4o' for better quality
        messages: [
          {
            role: 'system',
            content: 'You are a financial education expert for children. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,  // Creative but consistent
        response_format: { type: "json_object" }  // Forces JSON output
      });

      const text = completion.choices[0].message.content;
      const parsed = JSON.parse(text);
      
      return {
        scenario: parsed.scenario,
        currentBalance: currentBalance,
        options: parsed.options
      };
    } catch (error) {
      console.error('Error generating scenario:', error.message);
      return this.getMockScenario(currentBalance);
    }
  }

  async generateConsequence(
    choice: 'spend' | 'save' | 'invest',
    choiceDescription: string,
    currentBalance: number,
    age: number
  ): Promise<FinancialConsequence> {
    if (!this.openai) {
      return this.getMockConsequence(choice, currentBalance);
    }

    const prompt = `You are teaching a ${age}-year-old about financial consequences.

The child chose to: ${choice.toUpperCase()}
Specifically: "${choiceDescription}"
Current Balance: $${currentBalance}

Generate a consequence for this choice. Make it realistic but kid-friendly.

For SPEND: Money decreases (immediate gratification)
For SAVE: Money stays same, progress toward goal (delayed gratification)  
For INVEST: Small chance of growth OR small loss (risk/reward)

Return ONLY valid JSON in this exact format (no markdown, no backticks):
{
  "result": "What happened as a result of the choice (2-3 sentences, fun story)",
  "balanceChange": -10,
  "newBalance": ${currentBalance - 10},
  "lesson": "One sentence financial lesson the child learned",
  "emotion": "happy"
}

The balanceChange should be a number (positive for gain, negative for loss).
The emotion should be one of: happy, sad, neutral, excited.
Make the story engaging and the lesson clear!`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a financial education expert for children. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      });

      const text = completion.choices[0].message.content;
      const parsed = JSON.parse(text);
      
      return {
        result: parsed.result,
        balanceChange: parsed.balanceChange,
        newBalance: parsed.newBalance,
        lesson: parsed.lesson,
        emotion: parsed.emotion
      };
    } catch (error) {
      console.error('Error generating consequence:', error.message);
      return this.getMockConsequence(choice, currentBalance);
    }
  }

  private getMockScenario(currentBalance: number): FinancialScenario {
    const scenarios = [
      {
        scenario: "You're at the school fair and you have 10 dollars! There's a cool yo-yo for sale, your friend wants to save up for a pizza party, and there's a mini lemonade stand kit you could buy to sell drinks.",
        options: {
          spend: "Buy the awesome light-up yo-yo for 10 dollars",
          save: "Save your money for the pizza party next week",
          invest: "Buy the lemonade stand kit to make more money"
        }
      },
      {
        scenario: "It's your birthday and grandma gave you 15 dollars! Your favorite video game just went on sale, you've been wanting to save for new sneakers, and your neighbor will pay you to help with their garden project.",
        options: {
          spend: "Buy the video game while it's on sale for 15 dollars",
          save: "Put it toward your sneaker savings goal",
          invest: "Use it to buy garden supplies and earn 20 dollars helping your neighbor"
        }
      },
      {
        scenario: "You found 12 dollars doing chores! The ice cream truck is outside, you're saving for a new bike, and there's a car wash fundraiser where you could earn double your money.",
        options: {
          spend: "Get ice cream and treats for 12 dollars",
          save: "Add it to your bike savings jar",
          invest: "Use it for supplies for the car wash to earn 24 dollars"
        }
      }
    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    return {
      ...randomScenario,
      currentBalance
    };
  }

  private getMockConsequence(choice: 'spend' | 'save' | 'invest', currentBalance: number): FinancialConsequence {
    const consequences = {
      spend: [
        {
          result: "You had an amazing time with your new purchase! The joy was instant and you had so much fun. But now your wallet is empty and you'll need to wait for more money.",
          balanceChange: -10,
          lesson: "Spending feels great now, but the money is gone forever.",
          emotion: 'happy' as const
        }
      ],
      save: [
        {
          result: "Great job being patient! You resisted the temptation and kept your money safe. You're getting closer to your big goal, even though it was hard to wait.",
          balanceChange: 0,
          lesson: "Saving takes patience, but it helps you reach bigger dreams.",
          emotion: 'neutral' as const
        }
      ],
      invest: [
        {
          result: "Wow! Your investment paid off! People loved your lemonade stand and you made extra money. Taking a smart risk really worked out this time!",
          balanceChange: 8,
          lesson: "Investing can grow your money, but it takes effort and smart choices.",
          emotion: 'excited' as const
        },
        {
          result: "Oh no! It rained and nobody came to your lemonade stand. You lost some money on supplies. Investing doesn't always work out, but you learned something valuable.",
          balanceChange: -3,
          lesson: "Investments can lose money sometimes, but that's part of learning.",
          emotion: 'sad' as const
        }
      ]
    };

    const options = consequences[choice];
    const selected = options[Math.floor(Math.random() * options.length)];
    
    return {
      ...selected,
      newBalance: currentBalance + selected.balanceChange
    };
  }
}