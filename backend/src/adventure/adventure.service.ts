import { Injectable } from '@nestjs/common';
import { GeminiService, FinancialScenario, FinancialConsequence } from '../gemini/gemini.service';
import { HardwareService } from '../hardware/hardware.service';

interface AdventureState {
  balance: number;
  age: number;
  currentScenario: FinancialScenario | null;
  lastConsequence: FinancialConsequence | null;
  history: Array<{
    choice: string;
    balanceChange: number;
    timestamp: Date;
  }>;
  round: number;
}

@Injectable()
export class AdventureService {
  private state: AdventureState = {
    balance: 10,
    age: 10,
    currentScenario: null,
    lastConsequence: null,
    history: [],
    round: 0
  };

  constructor(
    private readonly geminiService: GeminiService,
    private readonly hardwareService: HardwareService,
  ) {}

  async startNewAdventure(age: number) {
    console.log(`🎮 Starting new adventure for age ${age}`);
    
    this.state = {
      balance: 10,
      age,
      currentScenario: null,
      lastConsequence: null,
      history: [],
      round: 1
    };

    // Generate first scenario
    const scenario = await this.geminiService.generateScenario(age, this.state.balance);
    this.state.currentScenario = scenario;

    // Send robot to center position
    await this.hardwareService.sendCommand({
      text: "Let's start your money adventure!",
      zone: 'center',
      emotion: 'excited'
    });

    return {
      success: true,
      scenario,
      balance: this.state.balance,
      round: this.state.round
    };
  }

  async processChoice(choice: 'spend' | 'save' | 'invest') {
  if (!this.state.currentScenario) {
    throw new Error('No active scenario. Start a new adventure first.');
  }

  console.log(`💰 Processing choice: ${choice}`);
  const choiceDescription = this.state.currentScenario.options[choice];
  
  // 1. DELETE the first "Moving to zone..." command here. 
  // It causes the first unnecessary movement.
  const zone = this.hardwareService.getZoneFromChoice(choice);

  // 2. Generate consequence using AI
  const consequence = await this.geminiService.generateConsequence(
    choice,
    choiceDescription,
    this.state.balance,
    this.state.age
  );

  // Update state
  this.state.balance = consequence.newBalance;
  this.state.lastConsequence = consequence;
  this.state.history.push({
    choice: choiceDescription,
    balanceChange: consequence.balanceChange,
    timestamp: new Date()
  });

  // 3. THIS is your primary command. It moves the robot and tells the story.
  await this.hardwareService.sendCommand({
    text: consequence.result, // Gemini's story
    zone,                    // The physical color zone
    emotion: consequence.emotion
  });

  // 4. Generate next scenario
  const nextScenario = await this.geminiService.generateScenario(
    this.state.age,
    this.state.balance
  );
  this.state.currentScenario = nextScenario;
  this.state.round += 1;

  // 5. OPTIONAL: Remove or delay the "Return to center" command.
  // If you keep this, the robot will move to the zone, talk, and then 
  // immediately move back before the user can even read the screen.
  /* await this.hardwareService.sendCommand({
    text: "Ready for your next decision!",
    zone: 'center',
    emotion: 'neutral'
  });
  */

  return {
    success: true,
    consequence,
    nextScenario,
    balance: this.state.balance,
    round: this.state.round,
    history: this.state.history
  };
}

  getCurrentStatus() {
    return {
      balance: this.state.balance,
      age: this.state.age,
      round: this.state.round,
      currentScenario: this.state.currentScenario,
      lastConsequence: this.state.lastConsequence,
      history: this.state.history,
      totalDecisions: this.state.history.length
    };
  }

  reset() {
    console.log('🔄 Resetting adventure');
    this.state = {
      balance: 10,
      age: 10,
      currentScenario: null,
      lastConsequence: null,
      history: [],
      round: 0
    };
    return { success: true, message: 'Adventure reset successfully' };
  }
}
