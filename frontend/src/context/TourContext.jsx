import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TourContext = createContext(null);

export const TOUR_STEPS = [
    {
        id: 'welcome',
        path: '/',
        selector: 'hero-title',
        title: "Hey! Welcome to Petal 🌸",
        content: "I'm Petal Pal! I'll show you how to vibe with your cycle. Ready for a 1-minute tour?",
        nextLabel: "Let's go! ✨",
    },
    {
        id: 'navbar',
        path: '/',
        selector: 'navbar-main',
        title: "The Big Basics",
        content: "Here's where you find the community, education, and your trackers. Everything Petal has to offer!",
        nextLabel: "Cool! Next →",
    },
    {
        id: 'goto-tracker',
        path: '/',
        selector: 'hero-get-started',
        title: "Your Private Space",
        content: "Let's dive into your actual tracker. Click next and I'll fly us there!",
        nextLabel: "Take me there! 🚀",
        action: (navigate) => navigate('/cycle-tracker'),
    },
    {
        id: 'dashboard-status',
        path: '/cycle-tracker',
        selector: 'dashboard-status-card',
        title: "Your Cycle at a Glance",
        content: "This bar shows exactly where you are in your cycle. No more guessing games!",
        nextLabel: "Got it! ✅",
    },
    {
        id: 'dashboard-mood',
        path: '/cycle-tracker',
        selector: 'dashboard-mood-logger',
        title: "How's your vibe today?",
        content: "Log how you feel here. The more you log, the smarter Petal gets about your body!",
        nextLabel: "Love it! ✨",
    },
    {
        id: 'sidebar-insights',
        path: '/cycle-tracker',
        selector: 'nav-item-insights',
        title: "The AI Magic 🪄",
        content: "Check this section for personalized patterns we find in your data. It's like a crystal ball for your health!",
        nextLabel: "Mind blown! 🤯",
    },
    {
        id: 'final',
        path: '/cycle-tracker',
        selector: 'petal-logo-sidebar',
        title: "You're all set! 🎉",
        content: "You're officially a Petal pro. Go explore and stay sparkling!",
        nextLabel: "Finish Tour",
    }
];

export const TourProvider = ({ children }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 means tour is closed
    const [isTourActive, setIsTourActive] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for first-time user
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('petal_tour_completed');
        if (!hasSeenTour) {
            // Delay a bit for the landing page to load
            const timer = setTimeout(() => {
                // Actually we won't auto-start, we will show a prompt in the UI
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = () => {
        setCurrentStepIndex(0);
        setIsTourActive(true);
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const nextStep = () => {
        const nextIdx = currentStepIndex + 1;
        if (nextIdx >= TOUR_STEPS.length) {
            endTour();
            return;
        }

        const nextStepData = TOUR_STEPS[nextIdx];
        
        // Execute special action if exists (like navigating)
        if (nextStepData.action) {
            nextStepData.action(navigate);
        } else if (location.pathname !== nextStepData.path) {
            navigate(nextStepData.path);
        }

        setCurrentStepIndex(nextIdx);
    };

    const endTour = () => {
        setIsTourActive(false);
        setCurrentStepIndex(-1);
        localStorage.setItem('petal_tour_completed', 'true');
    };

    const currentStep = TOUR_STEPS[currentStepIndex] || null;

    return (
        <TourContext.Provider value={{ 
            isTourActive, 
            currentStep, 
            startTour, 
            nextStep, 
            endTour,
            currentStepIndex 
        }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => useContext(TourContext);
