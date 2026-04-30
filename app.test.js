const { CivicPathApp, electionStages, aiKnowledgeBase } = require('./app.js');

describe('CivicPathApp Core Functionality', () => {
    let app;

    beforeEach(() => {
        // Set up DOM
        document.body.innerHTML = `
            <div id="stages-container"></div>
            <div id="timeline-scroll-area"></div>
            <div id="main-progress"></div>
            <div id="chat-history"></div>
            <div id="quick-prompts"></div>
            <input type="text" id="chat-input" />
            <div id="simulation-modal" class="hidden"></div>
            <div id="modal-body"></div>
            <div id="vvpat-display"></div>
        `;
        app = new CivicPathApp();
    });

    test('Initializes with the correct first stage', () => {
        expect(app.currentStageIndex).toBe(0);
        expect(document.querySelectorAll('.stage').length).toBe(electionStages.length);
        expect(document.querySelector('.stage.active').id).toBe('stage-0');
    });

    test('Progresses to a new stage', () => {
        app.setStage(2);
        expect(app.currentStageIndex).toBe(2);
        expect(document.querySelector('.stage.active').id).toBe('stage-2');
        expect(document.getElementById('main-progress').style.width).toBe('60%');
    });

    test('Chat input adds a user message', () => {
        const chatInput = document.getElementById('chat-input');
        chatInput.value = 'Hello';
        app.sendChatMessage();
        const messages = document.querySelectorAll('.message.user');
        expect(messages.length).toBe(1);
        expect(messages[0].textContent).toBe('Hello');
    });

    test('AI responds with appropriate context', () => {
        jest.useFakeTimers();
        const chatInput = document.getElementById('chat-input');
        
        // Test registration context
        app.setStage(0);
        chatInput.value = 'How to get epic';
        app.sendChatMessage();
        
        jest.advanceTimersByTime(2500); // Fast forward timeout
        
        const aiMessages = document.querySelectorAll('.message.ai');
        // Initial greeting + setStage msg + our triggered response
        const latestResponse = aiMessages[aiMessages.length - 1].innerHTML;
        expect(latestResponse).toContain('EPIC (Electoral Photo Identity Card)');
        jest.useRealTimers();
    });

    test('Simulation modal opens correctly', () => {
        app.openSimulation('sim-register');
        const modal = document.getElementById('simulation-modal');
        expect(modal.classList.contains('hidden')).toBe(false);
        const modalBody = document.getElementById('modal-body');
        expect(modalBody.innerHTML).toContain('Voter Registration Form 6');
    });

    test('Journey reset functions properly', () => {
        app.setStage(3);
        app.resetJourney();
        expect(app.currentStageIndex).toBe(0);
        expect(app.chatHistory.length).toBe(0);
    });
});
