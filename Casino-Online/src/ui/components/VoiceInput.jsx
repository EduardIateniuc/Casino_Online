import React, { useState, useEffect } from 'react';

const VoiceInput = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  
  const predefinedResponses = {
    "привет": ["Привет! Чем могу помочь?", "Здравствуйте! Что я могу для вас сделать?", "Привет! Я вас слушаю."],
    "здравствуй": ["Здравствуйте! Чем могу быть полезен?", "Приветствую! Что вас интересует сегодня?", "Здравствуйте! Готов помочь."],
    "как дела": ["У меня всё отлично, спасибо! А у вас?", "Функционирую превосходно! Чем могу помочь?", "Замечательно! Что я могу для вас сделать?"],
    "как тебя зовут": ["Меня зовут Голосовой Помощник. Я здесь, чтобы помогать вам.", "Я ваш Голосовой Помощник. Чем могу быть полезен сегодня?", "Можете называть меня Голосовым Помощником. Чем могу помочь?"],
    "который час": ["К сожалению, я не могу напрямую проверить время, но вы можете посмотреть его на экране вашего устройства.", "Текущее время должно отображаться на вашем устройстве. Могу я помочь с чем-то еще?"],
    "спасибо": ["Пожалуйста!", "Рад помочь!", "Всегда к вашим услугам! Нужно ли что-то еще?"],
    "пока": ["До свидания! Хорошего дня!", "До встречи!", "До свидания! Обращайтесь, когда понадобится помощь."],
    "помощь": ["Я могу отвечать на вопросы, предоставлять информацию или просто общаться с вами. О чем бы вы хотели поговорить?", "Я здесь, чтобы помогать вам. Просто спросите меня о чем угодно!", "Чем я могу вам помочь сегодня? Я слушаю."],
    "расскажи анекдот": ["Сейчас расскажу вам смешной анекдот!", "С удовольствием расскажу что-нибудь забавное!", "Люблю хорошие шутки! Сейчас что-нибудь придумаю."],
    "расскажи историю": ["С удовольствием расскажу вам интересную историю!", "Люблю рассказывать истории! Сейчас что-нибудь придумаю.", "Сейчас придумаю для вас увлекательную историю!"],
    "расскажи сказку": ["Сейчас расскажу вам интересную сказку!", "Обожаю рассказывать сказки! Слушайте внимательно.", "С удовольствием поделюсь с вами волшебной историей!"]
  };
  
  // Коллекция анекдотов
  const jokes = [
    "Штирлиц долго смотрел в одну точку. Потом в другую. 'Двоеточие' - догадался Штирлиц.",
    "Приходит программист в магазин. - Дайте мне, пожалуйста, бутылку водки! - Паспорт есть? - Есть. - А 18 есть? - Конечно. 10 + 8 = 18.",
    "Идёт медведь по лесу, видит - машина горит. Сел в неё и сгорел.",
    "В продаже появились сковородки с антипригарным покрытием: когда еда начинает пригорать, они автоматически отключают интернет.",
    "- Алло, это женская консультация? - Да. - А педаль тормоза справа или слева?",
    "Учитель музыки говорит ученику: - Предупреждаю, если ты не будешь вести себя как следует, я скажу твоим родителям, что у тебя талант.",
    "Жена - мужу: - Дорогой, а что ты мне подаришь на день рождения? - Видишь вон ту Ferrari? - Да!!! - Вот такого же цвета кастрюлю.",
    "Знаете, почему программисты путают Хэллоуин и Рождество? Потому что 31 OCT = 25 DEC.",
    "В ресторане. - Официант, я заказывал мясо под лимоном, а где же лимон? - Так он под мясом.",
    "Купил самоклеящиеся обои. Сижу. Жду."
  ];
  
  // Коллекция смешных историй
  const funnyStories = [
    "Вчера ехал в автобусе. Напротив сидела девушка и постоянно смотрела в окно. Когда она повернулась, я увидел, что она плачет. Я решил её утешить и сказал: 'Не переживайте так, скоро ваша остановка.' На что она ответила: 'Я уже проехала её полчаса назад, но вы так мило спали у меня на плече, что я не хотела вас будить.'",
    "На работе случайно нажал не на ту кнопку в кофемашине и получил напиток, который не заказывал. Простоял пять минут, делая вид, что именно его и хотел, потому что коллеги смотрели, а признаться в ошибке было стыдно.",
    "Сегодня в супермаркете кассир спросил: 'Пакет нужен?' Я автоматически ответил: 'Спасибо, я уже нашёл себе пару'. Теперь думаю переехать в другой город.",
    "Зашёл в лифт, а там уже стоял мужчина. Вместо того, чтобы нажать кнопку 7-го этажа, я зачем-то протянул руку и сказал: 'Здравствуйте, Михаил!' Мужчину звали не Михаил, меня не Михаил, и вообще мы друг друга не знали. Ехали в тишине.",
    "У соседей родился ребёнок. Я решил подарить им бутылку шампанского. Когда я постучал, открыл хозяин и радостно воскликнул: 'О, шампанское! Заходи, у нас ребёнок родился!' На что я ответил: 'Я знаю, это от меня.' Немая сцена продолжалась минуту.",
    "Пошёл в магазин за хлебом. Продавщица говорит: 'Платите 30 рублей'. Я протягиваю 50. Она: 'Без сдачи есть?' Я, задумавшись: 'Да, 30 рублей'. И протягиваю те же 50. Так повторилось трижды, пока очередь за мной не начала смеяться.",
    "Моя бабушка всегда говорила: 'Возьми зонт, на улице дождь!' А я отвечал: 'Не переживай, я быстро бегаю!' Теперь я взрослый мужчина, который бежит под дождём с пакетами из супермаркета и кричит: 'Я же говорил, что быстро бегаю!'",
    "Вчера ночью услышал странный шум на кухне. Взял биту, крадусь... Включаю свет, а там мой кот пытается открыть холодильник. Увидев меня с битой, он сел и сделал вид, что просто проходил мимо. Мы оба сделали вид, что ничего не произошло.",
    "На собеседовании меня спросили: 'Какая ваша самая сильная черта?' Я ответил: 'Внимательность к деталям'. Они спросили: 'Можете привести пример?' Я ответил: 'У вас в кабинете 7 стульев, на стене висят 3 диплома, а ваша секретарша сегодня надела разные носки.' Наступила тишина. Потом рекрутер прошептал: 'Я секретарь...'",
    "Хотел красиво подъехать к девушке на встречу, взял у друга спортивную машину. По пути попал в пробку и опоздал на 40 минут. Когда приехал, она спросила: 'Что случилось? Твоя машина сломалась?' Я ответил: 'Нет, друга машина сломалась'. Теперь у меня нет ни девушки, ни друга."
  ];
  
  // Функция для поиска предопределенного ответа
  const findPredefinedResponse = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Проверяем точные совпадения
    if (predefinedResponses[normalizedInput]) {
      const responses = predefinedResponses[normalizedInput];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Проверяем частичные совпадения
    for (const key in predefinedResponses) {
      if (normalizedInput.includes(key)) {
        const responses = predefinedResponses[key];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Совпадений не найдено
    return null;
  };
  
  // Генератор умных ответов при сбое API
  const generateFallbackResponse = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Сначала проверяем предопределенные ответы
    const predefinedResponse = findPredefinedResponse(normalizedInput);
    if (predefinedResponse) return predefinedResponse;
    
    // Запросы на анекдоты и истории
    if (normalizedInput.includes("анекдот") || normalizedInput.includes("шутк") || normalizedInput.includes("смешно")) {
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    if (normalizedInput.includes("истори") || normalizedInput.includes("рассказ") || normalizedInput.includes("сказк")) {
      return funnyStories[Math.floor(Math.random() * funnyStories.length)];
    }
    
    // Общие шаблоны ответов
    if (normalizedInput.includes("что") || normalizedInput.includes("как") || normalizedInput.includes("почему")) {
      return "Интересный вопрос. Не могли бы вы уточнить, чтобы я мог дать более полезный ответ?";
    }
    
    if (normalizedInput.includes("можешь")) {
      return "Я с удовольствием попробую! Можете рассказать подробнее, что именно вас интересует?";
    }
    
    if (normalizedInput.length < 10) {
      return "Я вас слышу, но мне нужно больше информации, чтобы дать полезный ответ.";
    }
    
    // Общие варианты ответов
    const fallbacks = [
      "Я обрабатываю то, что вы сказали. Не могли бы вы перефразировать?",
      "Я готов помочь. Можете предоставить больше деталей?",
      "Я вас слушаю. Расскажите подробнее, что вас интересует.",
      "Хочу убедиться, что правильно вас понял. Не могли бы вы уточнить?",
      "Это интересно. Что конкретно вы хотели бы узнать об этом?"
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU'; // Изменено на русский язык
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        
        const newMessage = {
          text: transcript,
          isUser: true,
          id: Date.now()
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        handleAiResponse(transcript);
        
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Ошибка распознавания:', event.error);
        setIsListening(false);
      };
      
      window.recognitionInstance = recognition;
    }
  }, []);
  
  const startListening = () => {
    setIsListening(true);
    if (window.recognitionInstance) {
      window.recognitionInstance.start();
    }
  };
  
  const handleAiResponse = async (userText) => {
    setIsAiResponding(true);
    
    // Сначала проверяем предопределенные ответы
    const predefinedResponse = findPredefinedResponse(userText);
    
    // Проверка на запрос анекдота или истории
    const normalizedInput = userText.toLowerCase().trim();
    let aiResponse;
    
    if (normalizedInput.includes("анекдот") || normalizedInput.includes("шутк") || normalizedInput.includes("смешно")) {
      aiResponse = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (normalizedInput.includes("истори") || normalizedInput.includes("рассказ") || normalizedInput.includes("сказк")) {
      aiResponse = funnyStories[Math.floor(Math.random() * funnyStories.length)];
    } else if (predefinedResponse) {
      // Используем предопределенный ответ, если доступен
      aiResponse = predefinedResponse;
    } else {
      try {
        // Пытаемся использовать API DialoGPT с корректной обработкой ошибок
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд тайм-аут
        
        const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: userText,
            parameters: {
              max_length: 100,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false
            }
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Проверяем, успешен ли ответ
        if (!response.ok) {
          throw new Error(`API ответил со статусом: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Обрабатываем ответ
        if (Array.isArray(data) && data.length > 0) {
          aiResponse = data[0]?.generated_text || "";
        } else if (data?.generated_text) {
          aiResponse = data.generated_text;
        } else if (typeof data === 'string') {
          aiResponse = data;
        } else {
          throw new Error("Неожиданный формат ответа");
        }
        
        // Очищаем ответ
        aiResponse = aiResponse.replace(userText, "").trim();
        
        // Если мы получили пустой или очень короткий ответ, используем наш генератор
        if (!aiResponse || aiResponse.length < 5) {
          aiResponse = generateFallbackResponse(userText);
        }
      } catch (error) {
        console.error("Ошибка AI API:", error);
        
        // Используем наш запасной генератор ответов
        aiResponse = generateFallbackResponse(userText);
      }
    }
  
    const newAiMessage = {
      text: aiResponse,
      isUser: false,
      id: Date.now()
    };
  
    setTimeout(() => {
      setMessages((prev) => [...prev, newAiMessage]);
      speakText(aiResponse);
      setIsAiResponding(false);
    }, 500); // Небольшая задержка для естественности
  };
  
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Отменяем текущую речь
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU'; // Изменено на русский язык
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Пытаемся найти хороший русский голос
      const voices = window.speechSynthesis.getVoices();
      const russianVoice = voices.find(voice => 
        voice.lang.includes('ru-RU') || voice.lang.includes('ru')
      );
      
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Убеждаемся, что голоса загружены
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Голосовой Помощник Денис - Хуй тоби у нис</h1>
        <p className="text-gray-600 mt-2">Общайтесь с вашим ИИ-ассистентом</p>
      </div>
      
      {/* Контейнер сообщений */}
      <div className="flex-1 overflow-y-auto mb-4 px-2 py-4 bg-white bg-opacity-70 rounded-lg shadow">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Скажите что-нибудь, чтобы начать разговор
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 shadow ${
                    message.isUser 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Индикатор "ИИ отвечает" */}
        {isAiResponding && (
          <div className="flex justify-start mt-4 animate-fadeIn">
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500 flex items-center rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Элементы управления голосовым вводом */}
      <div className="flex items-center justify-center p-4 bg-white bg-opacity-70 rounded-lg shadow">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`relative overflow-hidden flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-lg ${
            isListening 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isListening ? (
            <div className="absolute inset-0 bg-indigo-600 animate-ping rounded-full opacity-75"></div>
          ) : null}
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </button>
        
        <div className="ml-4 text-indigo-700 font-medium">
          {isListening ? 'Слушаю...' : 'Нажмите, чтобы говорить'}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VoiceInput;