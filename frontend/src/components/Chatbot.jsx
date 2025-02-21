// src/components/Chatbot.js
import { useEffect } from 'react';

const Chatbot = ({ isVisible }) => {
    useEffect(() => {
        if (isVisible && window.botpress) {
            window.botpressWebChat.init({
                host: 'https://your-botpress-server.com',  // Your Botpress server URL
                botId: '40d803b5-2780-4178-909f-e7d65fa6af2a',                    // Your Botpress bot ID
                // Add other configurations if necessary
            });
        }
    }, [isVisible]);

    return isVisible ? <div id="bp-webchat" /> : null;
};

export default Chatbot;
