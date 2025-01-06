import axios from 'axios';

interface SummarizerParams {
    message: string;
    prompt?: string;
}

export const summarizeText = async ({ message, prompt }: SummarizerParams): Promise<string> => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',  // 올바른 모델명으로 수정
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: `${prompt}\n\n${message}` },
                ],
                max_tokens: 100,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.data?.choices?.[0]?.message?.content) {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
        }

        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error: any) {
        console.error('Error details:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            throw new Error('API 키가 올바르지 않습니다.');
        }
        if (error.response?.status === 404) {
            throw new Error('잘못된 API 엔드포인트이거나 모델명입니다.');
        }

        throw new Error('텍스트 요약 중 오류가 발생했습니다: ' + (error.response?.data?.error?.message || error.message));
    }
};