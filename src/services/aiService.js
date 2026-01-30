// DeepSeek AI 服务模块
const API_KEY = 'sk-da49c0eb885640b3b49ffcc43eb38c01';
const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

/**
 * 调用DeepSeek API
 */
async function callDeepSeek(messages) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    return null;
  }
}

/**
 * 分析用户喜好风格
 * @param {Array} likedQuestions - 用户喜欢的题目列表
 * @returns {Object} 用户喜好分析结果
 */
export async function analyzePreference(likedQuestions) {
  if (!likedQuestions || likedQuestions.length === 0) {
    return null;
  }

  const truthQuestions = likedQuestions.filter(q => q.type === 'truth');
  const dareQuestions = likedQuestions.filter(q => q.type === 'dare');

  const prompt = `你是一个心理分析专家。请分析以下用户在"真心话大冒险"游戏中喜欢的题目，总结出用户的喜好风格。

用户喜欢的真心话题目：
${truthQuestions.map(q => `- ${q.content}`).join('\n') || '无'}

用户喜欢的大冒险题目：
${dareQuestions.map(q => `- ${q.content}`).join('\n') || '无'}

请用JSON格式返回分析结果，包含以下字段：
{
  "truthStyle": "真心话风格偏好描述（如：偏好情感类、搞笑类、深度类等）",
  "dareStyle": "大冒险风格偏好描述（如：偏好表演类、互动类、挑战类等）",
  "intensity": "刺激程度偏好（1-5，1最温和，5最刺激）",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "summary": "一句话总结用户喜好"
}

只返回JSON，不要其他内容。`;

  const result = await callDeepSeek([
    { role: 'system', content: '你是一个专业的心理分析助手，擅长分析用户偏好。请只返回JSON格式的结果。' },
    { role: 'user', content: prompt }
  ]);

  if (!result) return null;

  try {
    // 提取JSON部分
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('解析喜好分析结果失败:', error);
    return null;
  }
}

/**
 * 根据用户喜好生成新题目
 * @param {Object} preference - 用户喜好分析结果
 * @param {string} type - 题目类型 'truth' 或 'dare'
 * @returns {Object} 生成的题目
 */
export async function generateQuestion(preference, type) {
  const typeLabel = type === 'truth' ? '真心话' : '大冒险';
  const styleDesc = type === 'truth' ? preference?.truthStyle : preference?.dareStyle;
  const intensity = preference?.intensity || 3;
  const keywords = preference?.keywords?.join('、') || '有趣、互动';

  const prompt = `你是一个"真心话大冒险"游戏的题目设计师。请根据以下用户喜好，生成一个${typeLabel}题目。

用户喜好风格：${styleDesc || '综合类'}
刺激程度偏好：${intensity}/5
关键词偏好：${keywords}

要求：
1. 题目要符合用户的风格偏好
2. 刺激程度要匹配用户偏好（${intensity <= 2 ? '温和有趣' : intensity <= 3 ? '适中' : '刺激大胆'}）
3. ${type === 'truth' ? '真心话要能引发思考或有趣的回答' : '大冒险要有趣且可执行，不要危险动作'}
4. 题目长度适中，一句话即可

请用JSON格式返回：
{
  "content": "题目内容",
  "difficulty": ${intensity}
}

只返回JSON，不要其他内容。`;

  const result = await callDeepSeek([
    { role: 'system', content: '你是一个创意游戏设计师，擅长设计有趣的真心话大冒险题目。请只返回JSON格式的结果。' },
    { role: 'user', content: prompt }
  ]);

  if (!result) return null;

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const question = JSON.parse(jsonMatch[0]);
      return {
        id: `ai_${Date.now()}`,
        content: question.content,
        category: 'ai',
        difficulty: question.difficulty || intensity,
        isAI: true, // 标记为AI生成
      };
    }
    return null;
  } catch (error) {
    console.error('解析生成题目失败:', error);
    return null;
  }
}

/**
 * 检查AI服务是否可用
 */
export async function checkAIService() {
  try {
    const result = await callDeepSeek([
      { role: 'user', content: '请回复"OK"' }
    ]);
    return result !== null;
  } catch {
    return false;
  }
}
