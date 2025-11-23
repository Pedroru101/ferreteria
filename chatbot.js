class ChatBot {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        this.userId = this.generateUserId();
        this.init();
    }

    generateUserId() {
        let userId = localStorage.getItem('chatbot_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_user_id', userId);
        }
        return userId;
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.loadMessagesFromStorage();
    }

    createChatbotHTML() {
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <button class="chatbot-button" id="chatbot-toggle" title="Abrir chat">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </button>
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div>
                        <h3>Rombos del Mar</h3>
                        <div class="chatbot-header-subtitle">Respuestas en tiempo real</div>
                    </div>
                    <button class="chatbot-close" id="chatbot-close">✕</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Escribe tu pregunta..." autocomplete="off">
                    <button class="chatbot-send" id="chatbot-send">➤</button>
                </div>
            </div>
        `;
        if (document.body) {
            document.body.appendChild(container);
        } else {
            document.documentElement.appendChild(container);
        }
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen ? this.closeChat() : this.openChat();
    }

    openChat() {
        this.isOpen = true;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-toggle');
        window.classList.add('active');
        button.classList.add('active');
        document.getElementById('chatbot-input').focus();

        if (this.messages.length === 0) {
            this.addBotMessage('¡Hola! Soy Jose de Rombos del Mar. ¿En qué puedo ayudarte hoy?');
        }
    }

    closeChat() {
        this.isOpen = false;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-toggle');
        window.classList.remove('active');
        button.classList.remove('active');
    }

    addMessage(text, isUser = false, hasWhatsAppButton = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        
        if (hasWhatsAppButton && !isUser) {
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'whatsapp-button-container';
            buttonDiv.innerHTML = `<a href="https://wa.me/5491171416157" target="_blank" class="whatsapp-button"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> Contactar por WhatsApp</a>`;
            messageDiv.appendChild(buttonDiv);
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.messages.push({ text, isUser, timestamp: Date.now() });
        this.saveMessagesToStorage();
    }

    addBotMessage(text, hasWhatsAppButton = false) {
        this.addMessage(text, false, hasWhatsAppButton);
    }

    addUserMessage(text) {
        this.addMessage(text, true, false);
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();

        if (!text || this.isLoading) return;

        this.addUserMessage(text);
        input.value = '';
        this.isLoading = true;
        this.showTyping();

        try {
            const response = await this.callGeminiAPI(text);
            this.removeTyping();
            const hasButton = response.includes('+54 9 11 7141-6157');
            const cleanResponse = response.replace(/\+54 9 11 7141-6157/g, '').trim();
            this.addBotMessage(cleanResponse, hasButton);
        } catch (error) {
            this.removeTyping();
            this.addBotMessage('Lo siento, hubo un error. Por favor intenta de nuevo.', true);
            console.error('Error:', error);
        } finally {
            this.isLoading = false;
        }
    }

    async callGeminiAPI(userMessage) {
        const systemPrompt = `Te llamas Jose y eres especialista en alambrados y cercos perimetrales para Rombos del Mar en Mar del Plata. NUNCA menciones que eres una IA o un asistente automático. Siempre responde como si fueras una persona real.

Información sobre la empresa:
- Servicios: Fabricación, venta y colocación de alambrados
- Productos: Tejido romboidal, alambre galvanizado, postes de hormigón, postes de madera (quebracho y eucalipto), postes Olimpo
- Medidas disponibles: 1.00m, 1.20m, 1.50m, 1.80m, 2.00m
- Contacto WhatsApp: +54 9 11 7141-6157
- Ubicación: Mar del Plata

INSTRUCCIONES CRÍTICAS:
1. NUNCA repitas "Hola soy Jose" o tu presentación completa en cada mensaje. Ya fue dicho al inicio.
2. Responde directamente a la pregunta del cliente sin presentarte de nuevo.
3. NUNCA digas que eres una IA, bot o asistente automático
4. Si no tienes información sobre algo específico, sugiere contactar por WhatsApp incluyendo el número: "+54 9 11 7141-6157"
5. Si el cliente quiere hablar con un especialista o necesita presupuesto, ofrece el WhatsApp: "+54 9 11 7141-6157"
6. Responde de manera amable, profesional y natural, como lo haría una persona
7. Sé conciso pero informativo
8. Cuando menciones el número de WhatsApp, inclúyelo en el texto para que aparezca el botón`;

        const contents = [];
        
        for (let msg of this.messages) {
            contents.push({
                role: msg.isUser ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        }
        
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const requestBody = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error('Respuesta inválida de la API');
    }

    saveMessagesToStorage() {
        try {
            const storageKey = `chatbot_messages_${this.userId}`;
            localStorage.setItem(storageKey, JSON.stringify(this.messages));
        } catch (e) {
            console.warn('No se pudo guardar mensajes:', e);
        }
    }

    loadMessagesFromStorage() {
        try {
            const storageKey = `chatbot_messages_${this.userId}`;
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                this.messages = JSON.parse(stored);
                const messagesContainer = document.getElementById('chatbot-messages');
                this.messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.isUser ? 'user' : 'bot'}`;
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'message-content';
                    contentDiv.textContent = msg.text;
                    messageDiv.appendChild(contentDiv);
                    messagesContainer.appendChild(messageDiv);
                });
            }
        } catch (e) {
            console.warn('No se pudo cargar mensajes:', e);
        }
    }
}

function initChatBot() {
    const apiKey = 'AIzaSyAtCPv_TpJ2j1RNxksRjp49ZNmZr-KZfAY';
    new ChatBot(apiKey);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatBot);
} else {
    initChatBot();
}
