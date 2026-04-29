/* 
  CivicPath India - Logic and Interactivity
*/

const electionStages = [
    {
        id: 'registration',
        title: 'Voter Registration',
        description: 'Before you can vote, you must be on the electoral roll. In India, you need your EPIC (Voter ID) card.',
        details: 'You can register online via the NVSP portal or the Voter Helpline App. You must be 18 years old as of Jan 1st of the election year.',
        prompts: ['How do I get an EPIC card?', 'What documents are needed?'],
        actionText: 'Simulate Registration',
        simulationId: 'sim-register'
    },
    {
        id: 'research',
        title: 'Know Your Candidates',
        description: 'The ECI mandates candidates to declare their criminal records, assets, and liabilities via affidavits.',
        details: 'You can view these affidavits on the KYC (Know Your Candidate) app by the Election Commission of India.',
        prompts: ['Where do I find candidate info?', 'What is an affidavit?'],
        actionText: 'View Mock Affidavit',
        simulationId: 'sim-kyc'
    },
    {
        id: 'campaign',
        title: 'Campaigning & MCC',
        description: 'Political parties campaign, but they must adhere to the Model Code of Conduct (MCC).',
        details: 'The MCC ensures fair play. For instance, ruling parties cannot use government machinery for campaigning. Citizens can report violations via the cVIGIL app.',
        prompts: ['What is the Model Code of Conduct?', 'How to report a violation?'],
        actionText: 'Explore MCC Guidelines',
        simulationId: 'sim-mcc'
    },
    {
        id: 'polling',
        title: 'Polling Day',
        description: 'Time to vote! India uses Electronic Voting Machines (EVMs) along with VVPATs for transparency.',
        details: 'Find your polling booth, carry your EPIC or an approved ID. Press the blue button next to your chosen candidate on the EVM.',
        prompts: ['How does an EVM work?', 'What is VVPAT?'],
        actionText: 'Try EVM Simulator',
        simulationId: 'sim-evm'
    },
    {
        id: 'results',
        title: 'Counting & Results',
        description: 'Votes are counted in a secure environment. The candidate with the highest votes in a constituency wins (First Past the Post system).',
        details: 'The party or coalition with a majority in the Lok Sabha forms the central government.',
        prompts: ['How are votes counted securely?', 'What is First Past the Post?'],
        actionText: 'View Mock Dashboard',
        simulationId: 'sim-results'
    }
];

// Simulated AI Responses (Mock Data)
const aiKnowledgeBase = {
    'registration': {
        'epic': 'The EPIC (Electoral Photo Identity Card) is your Voter ID. You can apply for it online on voters.eci.gov.in using Form 6.',
        'documents': 'You generally need proof of age (birth certificate, 10th mark sheet) and proof of residence (Aadhar, passport, utility bill).',
        'default': 'Registration is step one! You must be 18+ and an Indian citizen. Let me know if you need help finding the forms.'
    },
    'research': {
        'info': 'The ECI has a KYC (Know Your Candidate) app available on Android/iOS where you can see all candidate affidavits.',
        'affidavit': 'An affidavit is a sworn legal document where the candidate declares their criminal background, assets, liabilities, and educational qualifications.',
        'default': 'It is crucial to know who you are voting for! Check their background before heading to the booth.'
    },
    'campaign': {
        'mcc': 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI to regulate political parties and candidates prior to elections.',
        'violation': 'If you see an MCC violation (like bribing voters or hate speech), you can report it instantly using the cVIGIL mobile app.',
        'default': 'During campaigns, the ECI monitors everything closely via the Model Code of Conduct.'
    },
    'polling': {
        'evm': 'An EVM consists of a Control Unit and a Balloting Unit. You press the button next to your candidate symbol. It is not connected to the internet.',
        'vvpat': 'VVPAT stands for Voter Verifiable Paper Audit Trail. After you press the EVM button, a printed slip appears for 7 seconds showing who you voted for, before falling into a sealed drop box.',
        'default': 'On polling day, just carry your Voter ID or Aadhar. Find your booth via the Voter Helpline app!'
    },
    'results': {
        'counted': 'EVMs are kept in strong rooms under heavy security. Counting happens in the presence of candidates or their agents.',
        'first past': 'India uses the First Past the Post (FPTP) system. This means the candidate who gets more votes than any other single candidate wins, even if they don\'t get an absolute majority (>50%).',
        'default': 'Results are usually declared on the same day counting begins, and the ECI website provides real-time updates.'
    },
    'general': {
        'default': 'I am the CivicPath AI Guide. I can help you understand the Indian election process. Where are you currently on the timeline?'
    }
};


class CivicPathApp {
    constructor() {
        this.currentStageIndex = 0;
        this.chatHistory = [];
        this.init();
    }

    init() {
        this.renderStages();
        this.setupScrollListener();
        this.updateUI();
        this.addAiMessage("Namaste! I am your CivicPath Guide. Let's walk through the Indian election process together. We start at Voter Registration.");
    }

    renderStages() {
        const container = document.getElementById('stages-container');
        container.innerHTML = '';

        electionStages.forEach((stage, index) => {
            const el = document.createElement('div');
            el.className = `stage ${index === 0 ? 'active' : ''}`;
            el.id = `stage-${index}`;
            
            el.innerHTML = `
                <div class="stage-node">${index + 1}</div>
                <div class="stage-content">
                    <h2>${stage.title}</h2>
                    <p>${stage.description}</p>
                    <button class="action-btn" onclick="app.openSimulation('${stage.simulationId}')">
                        ${stage.actionText} <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
            container.appendChild(el);
        });
    }

    setupScrollListener() {
        const scrollArea = document.getElementById('timeline-scroll-area');
        scrollArea.addEventListener('scroll', () => {
            const scrollTop = scrollArea.scrollTop;
            const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            
            // Update line fill
            document.documentElement.style.setProperty('--scroll-progress', `${scrollPercentage}%`);

            // Determine active stage based on scroll position
            const stageElements = document.querySelectorAll('.stage');
            let newActiveIndex = this.currentStageIndex;

            stageElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                // If element is in the middle of the viewport
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    newActiveIndex = index;
                }
            });

            if (newActiveIndex !== this.currentStageIndex) {
                this.setStage(newActiveIndex);
            }
        });
    }

    setStage(index) {
        this.currentStageIndex = index;
        this.updateUI();
        
        const stage = electionStages[index];
        this.addAiMessage(`You are now looking at **${stage.title}**. ${stage.details}`);
    }

    updateUI() {
        // Update Nodes
        const stages = document.querySelectorAll('.stage');
        stages.forEach((el, index) => {
            el.classList.remove('active', 'completed');
            if (index < this.currentStageIndex) {
                el.classList.add('completed');
            } else if (index === this.currentStageIndex) {
                el.classList.add('active');
            }
        });

        // Update Top Progress Bar
        const progress = ((this.currentStageIndex + 1) / electionStages.length) * 100;
        document.getElementById('main-progress').style.width = `${progress}%`;

        // Update Quick Prompts
        this.renderPrompts();
    }

    renderPrompts() {
        const container = document.getElementById('quick-prompts');
        const stage = electionStages[this.currentStageIndex];
        
        container.innerHTML = stage.prompts.map(prompt => 
            `<div class="prompt-chip" onclick="app.handlePromptClick('${prompt}')">${prompt}</div>`
        ).join('');
    }

    resetJourney() {
        document.getElementById('timeline-scroll-area').scrollTop = 0;
        this.currentStageIndex = 0;
        this.chatHistory = [];
        document.getElementById('chat-history').innerHTML = '';
        this.init();
    }

    // --- Chat Logic ---

    handlePromptClick(text) {
        document.getElementById('chat-input').value = text;
        this.sendChatMessage();
    }

    handleChatInput(event) {
        if (event.key === 'Enter') {
            this.sendChatMessage();
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        this.addUserMessage(text);
        input.value = '';

        // Simulate AI thinking
        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            this.generateAiResponse(text);
        }, 1000 + Math.random() * 1000); // 1-2s delay
    }

    addUserMessage(text) {
        const container = document.getElementById('chat-history');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.textContent = text;
        container.appendChild(msgDiv);
        this.scrollToBottom();
    }

    addAiMessage(text) {
        const container = document.getElementById('chat-history');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai';
        // Simple markdown parsing for bold
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        container.appendChild(msgDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const container = document.getElementById('chat-history');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        container.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    scrollToBottom() {
        const container = document.getElementById('chat-history');
        container.scrollTop = container.scrollHeight;
    }

    generateAiResponse(userText) {
        const lowerText = userText.toLowerCase();
        const currentStageId = electionStages[this.currentStageIndex].id;
        const stageKnowledge = aiKnowledgeBase[currentStageId];

        let response = stageKnowledge['default'];

        // Simple keyword matching simulation
        if (currentStageId === 'registration') {
            if (lowerText.includes('epic') || lowerText.includes('card')) response = stageKnowledge['epic'];
            if (lowerText.includes('doc') || lowerText.includes('proof')) response = stageKnowledge['documents'];
        } else if (currentStageId === 'research') {
            if (lowerText.includes('app') || lowerText.includes('find')) response = stageKnowledge['info'];
            if (lowerText.includes('affidavit') || lowerText.includes('declare')) response = stageKnowledge['affidavit'];
        } else if (currentStageId === 'campaign') {
            if (lowerText.includes('mcc') || lowerText.includes('code')) response = stageKnowledge['mcc'];
            if (lowerText.includes('report') || lowerText.includes('cvigil')) response = stageKnowledge['violation'];
        } else if (currentStageId === 'polling') {
            if (lowerText.includes('evm') || lowerText.includes('machine')) response = stageKnowledge['evm'];
            if (lowerText.includes('vvpat') || lowerText.includes('slip')) response = stageKnowledge['vvpat'];
        } else if (currentStageId === 'results') {
            if (lowerText.includes('count') || lowerText.includes('secure')) response = stageKnowledge['counted'];
            if (lowerText.includes('first past') || lowerText.includes('win')) response = stageKnowledge['first past'];
        }

        this.addAiMessage(response);
    }

    // --- Modal & Simulations ---

    openSimulation(simId) {
        const modal = document.getElementById('simulation-modal');
        const modalBody = document.getElementById('modal-body');
        
        let content = '';

        switch(simId) {
            case 'sim-learning':
                content = `
                    <h2 style="color:var(--primary-saffron); margin-bottom: 1rem;"><i class="fa-solid fa-graduation-cap"></i> First Time Voter Basics</h2>
                    <p style="margin-bottom: 1.5rem; color:var(--text-secondary);">Welcome to democracy! Here is a quick crash course on how the Indian Government is formed.</p>
                    
                    <div style="display:flex; flex-direction:column; gap:15px;">
                        <div style="background: rgba(255,153,51,0.1); border: 1px solid rgba(255,153,51,0.3); padding: 1rem; border-radius: 8px;">
                            <h3 style="color: var(--primary-saffron); margin-bottom: 5px;">1. The Parliament</h3>
                            <p style="color: white; font-size: 0.95rem;">India has a bicameral parliament consisting of the <strong>Lok Sabha</strong> (Lower House) and the <strong>Rajya Sabha</strong> (Upper House). During General Elections, you vote to elect Members of Parliament (MPs) for the Lok Sabha.</p>
                        </div>
                        
                        <div style="background: rgba(19,136,8,0.1); border: 1px solid rgba(19,136,8,0.3); padding: 1rem; border-radius: 8px;">
                            <h3 style="color: var(--primary-green); margin-bottom: 5px;">2. Forming the Government</h3>
                            <p style="color: white; font-size: 0.95rem;">The Lok Sabha has 543 elected seats. A political party or coalition needs a majority, which is <strong>272 seats</strong>, to form the Central Government. The leader of this majority party becomes the Prime Minister.</p>
                        </div>
                        
                        <div style="background: rgba(0,0,128,0.2); border: 1px solid rgba(0,0,128,0.4); padding: 1rem; border-radius: 8px;">
                            <h3 style="color: var(--primary-blue); margin-bottom: 5px;">3. Your Role</h3>
                            <p style="color: white; font-size: 0.95rem;">Your single vote in your constituency decides who represents you in the Lok Sabha. It is your constitutional right and duty to participate. Press "Restart Journey" to explore the steps!</p>
                        </div>
                    </div>
                `;
                break;
            case 'sim-register':
                content = `
                    <h2 style="color:var(--primary-saffron); margin-bottom: 1rem;">Voter Registration Form 6</h2>
                    <p style="margin-bottom: 1.5rem; color:var(--text-secondary);">Fill out this mock form to simulate registering for your EPIC card.</p>
                    <div style="background:var(--bg-base); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                        <input type="text" placeholder="Full Name" style="width: 100%; margin-bottom: 10px; padding: 8px; background: var(--bg-surface); color: white; border: 1px solid var(--glass-border); border-radius: 4px;">
                        <input type="date" placeholder="Date of Birth" style="width: 100%; margin-bottom: 10px; padding: 8px; background: var(--bg-surface); color: white; border: 1px solid var(--glass-border); border-radius: 4px;">
                        <input type="text" placeholder="Address" style="width: 100%; margin-bottom: 10px; padding: 8px; background: var(--bg-surface); color: white; border: 1px solid var(--glass-border); border-radius: 4px;">
                        <button onclick="document.getElementById('reg-status').innerText = 'Application Submitted Successfully! EPIC processing...'" style="background: var(--primary-green); color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%;">Submit Mock Form</button>
                        <p id="reg-status" style="margin-top: 10px; color: var(--primary-saffron); text-align: center;"></p>
                    </div>
                `;
                break;
            case 'sim-kyc':
                content = `
                    <h2 style="color:var(--primary-saffron); margin-bottom: 1rem;">KYC App Simulation</h2>
                    <p style="margin-bottom: 1.5rem; color:var(--text-secondary);">View mock candidate affidavits.</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px; background:var(--bg-base); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <h3 style="color: white; margin-bottom: 5px;">Candidate A</h3>
                            <p style="color: #ef4444; font-size: 0.9rem;">Criminal Cases: 2</p>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">Assets: ₹5 Cr</p>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">Education: Graduate</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background:var(--bg-base); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <h3 style="color: white; margin-bottom: 5px;">Candidate B</h3>
                            <p style="color: #10b981; font-size: 0.9rem;">Criminal Cases: 0</p>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">Assets: ₹1.2 Cr</p>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">Education: Post-Graduate</p>
                        </div>
                    </div>
                `;
                break;
            case 'sim-mcc':
                content = `
                    <h2 style="color:var(--primary-saffron); margin-bottom: 1rem;">cVIGIL Violation Reporter</h2>
                    <p style="margin-bottom: 1.5rem; color:var(--text-secondary);">Simulate reporting an MCC violation.</p>
                    <div style="background:var(--bg-base); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border); text-align: center;">
                        <div style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"><i class="fa-solid fa-camera"></i></div>
                        <select style="width: 100%; margin-bottom: 10px; padding: 8px; background: var(--bg-surface); color: white; border: 1px solid var(--glass-border); border-radius: 4px;">
                            <option>Select Violation Type</option>
                            <option>Distribution of Money/Liquor</option>
                            <option>Hate Speech</option>
                            <option>Defacement of Property</option>
                        </select>
                        <button onclick="document.getElementById('mcc-status').innerText = 'Violation Reported! Location captured via GPS. Action initiated within 100 minutes.'" style="background: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%;">Submit Report Anonymously</button>
                        <p id="mcc-status" style="margin-top: 10px; color: #10b981;"></p>
                    </div>
                `;
                break;
            case 'sim-results':
                content = `
                    <h2 style="color:var(--primary-saffron); margin-bottom: 1rem;">Live Results Dashboard</h2>
                    <p style="margin-bottom: 1.5rem; color:var(--text-secondary);">Mock counting results demonstrating First Past the Post.</p>
                    <div style="background:var(--bg-base); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; color: white; margin-bottom: 5px;"><span>Lotus Party</span><span>45% (WINNER)</span></div>
                            <div style="width: 100%; background: var(--bg-surface); height: 10px; border-radius: 5px;"><div style="width: 45%; background: var(--primary-saffron); height: 100%; border-radius: 5px;"></div></div>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; color: white; margin-bottom: 5px;"><span>Hand Party</span><span>35%</span></div>
                            <div style="width: 100%; background: var(--bg-surface); height: 10px; border-radius: 5px;"><div style="width: 35%; background: var(--primary-blue); height: 100%; border-radius: 5px;"></div></div>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; color: white; margin-bottom: 5px;"><span>Broom Party</span><span>20%</span></div>
                            <div style="width: 100%; background: var(--bg-surface); height: 10px; border-radius: 5px;"><div style="width: 20%; background: var(--primary-green); height: 100%; border-radius: 5px;"></div></div>
                        </div>
                        <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary);">*Note: Lotus Party wins the seat because they have the most votes, even though they don't have >50% (First Past the Post).</p>
                    </div>
                `;
                break;
            case 'sim-evm':
                content = `
                    <h2 style="color:var(--primary-saffron); margin-bottom: 1rem;">EVM Simulator</h2>
                    <p style="margin-bottom: 1.5rem; color:var(--text-secondary);">This is a simplified mock of an Electronic Voting Machine Balloting Unit.</p>
                    <div class="evm-mockup">
                        <div class="evm-btn-row">
                            <span>1. Lotus Party</span>
                            <div style="display:flex; gap:15px; align-items:center;">
                                <div class="evm-light" id="light-1"></div>
                                <button class="evm-button" onclick="app.simulateVote(1)"></button>
                            </div>
                        </div>
                        <div class="evm-btn-row">
                            <span>2. Hand Party</span>
                            <div style="display:flex; gap:15px; align-items:center;">
                                <div class="evm-light" id="light-2"></div>
                                <button class="evm-button" onclick="app.simulateVote(2)"></button>
                            </div>
                        </div>
                        <div class="evm-btn-row">
                            <span>3. Broom Party</span>
                            <div style="display:flex; gap:15px; align-items:center;">
                                <div class="evm-light" id="light-3"></div>
                                <button class="evm-button" onclick="app.simulateVote(3)"></button>
                            </div>
                        </div>
                        <div class="evm-btn-row">
                            <span>4. NOTA</span>
                            <div style="display:flex; gap:15px; align-items:center;">
                                <div class="evm-light" id="light-4"></div>
                                <button class="evm-button" onclick="app.simulateVote(4)"></button>
                            </div>
                        </div>
                    </div>
                    <div id="vvpat-display" style="margin-top: 20px; text-align:center; height: 50px; color: #10b981; font-weight:bold;"></div>
                `;
                break;
        }

        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('simulation-modal').classList.add('hidden');
    }

    simulateVote(id) {
        // Reset lights
        document.querySelectorAll('.evm-light').forEach(l => l.classList.remove('red'));
        
        // Turn on specific light
        document.getElementById(`light-${id}`).classList.add('red');
        
        // Simulate beep
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // fake short beep base64 for demo purposes, won't actually play
        audio.play().catch(e => {}); // Ignore error

        // Show VVPAT
        const vvpat = document.getElementById('vvpat-display');
        vvpat.innerHTML = `<span style="background:#1e293b; padding: 10px; border:1px dashed #94a3b8; display:inline-block;">Printing VVPAT Slip for Option ${id}...</span>`;
        
        setTimeout(() => {
            vvpat.innerHTML = '';
            document.getElementById(`light-${id}`).classList.remove('red');
        }, 3000);
    }
}

// Initialize App
const app = new CivicPathApp();
