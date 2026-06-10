/**
 * Kimi AI API Service
 *
 * This module handles all communication with the Kimi (Moonshot) AI API.
 * API Documentation: https://platform.moonshot.cn/docs/api/chat
 */

export interface KimiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface KimiStreamChunk {
  id: string;
  choices: {
    delta: {
      content: string;
    };
    finish_reason: string | null;
  }[];
}

export interface KimiConfig {
  apiKey: string;
  model?: 'moonshot-v1-8k' | 'moonshot-v1-32k' | 'moonshot-v1-128k';
  temperature?: number;
}

const DEFAULT_MODEL = 'moonshot-v1-8k';
const API_BASE_URL = 'https://api.moonshot.cn/v1';
const MAX_TOKENS = 8192;

export class KimiService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private monthlyUsage: number = 0;
  private monthlyBudget: number = 100;

  constructor(config: KimiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || DEFAULT_MODEL;
    this.temperature = config.temperature ?? 0.7;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setModel(model: string): void {
    this.model = model;
  }

  setMonthlyBudget(budget: number): void {
    this.monthlyBudget = budget;
  }

  updateUsage(cost: number): void {
    this.monthlyUsage += cost;
  }

  getUsage(): { used: number; budget: number; percent: number } {
    return {
      used: this.monthlyUsage,
      budget: this.monthlyBudget,
      percent: Math.min(100, (this.monthlyUsage / this.monthlyBudget) * 100),
    };
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('sk-');
  }

  /**
   * Send a chat completion request to Kimi API
   */
  async chat(messages: KimiMessage[]): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Kimi API Key 未配置或无效');
    }

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: this.temperature,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API 请求失败: ${response.status}`);
    }

    const data = await response.json();

    // Estimate cost based on tokens (rough approximation)
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const estimatedCost = (inputTokens * 0.003 + outputTokens * 0.006) / 1000; // CNY
    this.monthlyUsage += estimatedCost;

    return data.choices[0]?.message?.content || '';
  }

  /**
   * Send a chat completion request with streaming
   */
  async* chatStream(messages: KimiMessage[]): AsyncGenerator<string, void, unknown> {
    if (!this.isConfigured()) {
      throw new Error('Kimi API Key 未配置或无效');
    }

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: this.temperature,
        max_tokens: MAX_TOKENS,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API 请求失败: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const chunk: KimiStreamChunk = JSON.parse(data);
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// System prompt for the campus recruitment assistant
const SYSTEM_PROMPT = `你是校招助手，一个温暖、专业、有同理心的 AI 求职伙伴。

你的职责是帮助用户（应届毕业生 Nerida）更好地准备求职：

1. **简历优化**：帮助优化简历内容，突出项目成果，用数据说话
2. **面试准备**：分析常见面试问题，提供回答框架和技巧
3. **JD 分析**：帮助解读岗位要求，匹配用户背景
4. **投递策略**：根据用户情况提供投递建议
5. **情绪陪伴**：在用户遇到挫折时给予温暖鼓励，提供具体行动建议
6. **Offer 对比**：帮助分析不同 Offer 的优劣

你的风格：
- 温暖但不虚假，称呼用户为"你"
- 专业但不冰冷，给出具体可行的建议
- 被拒时：先共情 → 再鼓励 → 最后给行动建议
- 取得进展时：真诚庆祝，不夸张
- 永远给具体的下一步行动建议，不说"别焦虑"这种无效安慰

回答时使用 Markdown 格式，适当使用 emoji 增加亲和力。`;

// Singleton instance
let kimiService: KimiService | null = null;

export function getKimiService(): KimiService {
  if (!kimiService) {
    const apiKey = typeof window !== 'undefined'
      ? localStorage.getItem('kimi-api-key') || ''
      : '';
    kimiService = new KimiService({ apiKey });
  }
  return kimiService;
}

export function initKimiService(apiKey: string, monthlyBudget: number = 100): void {
  kimiService = new KimiService({
    apiKey,
    model: 'moonshot-v1-8k',
    temperature: 0.7,
  });
  kimiService.setMonthlyBudget(monthlyBudget);
}

export function saveApiKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kimi-api-key', apiKey);
  }
  if (kimiService) {
    kimiService.setApiKey(apiKey);
  }
}

export function getApiKey(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kimi-api-key') || '';
  }
  return '';
}

export { SYSTEM_PROMPT };
