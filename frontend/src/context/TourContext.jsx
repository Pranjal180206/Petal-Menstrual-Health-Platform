import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const TourContext = createContext(null);

const getTourSteps = (user) => {
    const commonStart = [
        { id: 'welcome', path: '/', selector: 'hero-title', titleKey: 'tour.steps.welcome.title', contentKey: 'tour.steps.welcome.content', nextLabelKey: 'tour.steps.welcome.next' },
        { id: 'navbar', path: '/', selector: 'navbar-main', titleKey: 'tour.steps.navbar.title', contentKey: 'tour.steps.navbar.content', nextLabelKey: 'tour.steps.navbar.next' },
    ];

    if (!user) {
        return [
            ...commonStart,
            { id: 'education', path: '/education', selector: 'education-hero', titleKey: 'tour.steps.education.title', contentKey: 'tour.steps.education.content', nextLabelKey: 'tour.steps.education.next' },
            { id: 'community', path: '/community', selector: 'community-hero', titleKey: 'tour.steps.community.title', contentKey: 'tour.steps.community.content', nextLabelKey: 'tour.steps.community.next' },
            { id: 'login', path: '/login', selector: 'login-form-card', titleKey: 'tour.steps.login.title', contentKey: 'tour.steps.login.content', nextLabelKey: 'tour.steps.login.next' },
        ];
    }

    const normalizedGender = (user?.gender || '').toLowerCase();
    const isFemale = normalizedGender === 'female';
    const isMaleLike = Boolean(user) && !isFemale;

    if (isMaleLike) {
        return [
            ...commonStart,
            { id: 'community', path: '/community', selector: 'community-hero', titleKey: 'tour.steps.community.title', contentKey: 'tour.steps.community.content', nextLabelKey: 'tour.steps.community.next' },
            { id: 'profile', path: '/profile', selector: 'profile-settings-card', titleKey: 'tour.steps.profile.title', contentKey: 'tour.steps.profile.content', nextLabelKey: 'tour.steps.profile.next' },
            { id: 'education', path: '/education', selector: 'education-hero', titleKey: 'tour.steps.education.title', contentKey: 'tour.steps.education.content', nextLabelKey: 'tour.steps.education.next' },
        ];
    }

    if (isFemale) {
        return [
            ...commonStart,
            { id: 'education', path: '/education', selector: 'education-hero', titleKey: 'tour.steps.education.title', contentKey: 'tour.steps.education.content', nextLabelKey: 'tour.steps.education.next' },
            { id: 'community', path: '/community', selector: 'community-hero', titleKey: 'tour.steps.community.title', contentKey: 'tour.steps.community.content', nextLabelKey: 'tour.steps.community.next' },
            { id: 'dashboard', path: '/cycle-tracker', selector: 'dashboard-header', titleKey: 'tour.steps.dashboard.title', contentKey: 'tour.steps.dashboard.content', nextLabelKey: 'tour.steps.dashboard.next' },
            { id: 'tracker', path: '/cycle-tracker/tracker', selector: 'tracker-daily-log', titleKey: 'tour.steps.tracker.title', contentKey: 'tour.steps.tracker.content', nextLabelKey: 'tour.steps.tracker.next' },
            { id: 'risk', path: '/cycle-tracker/risk', selector: 'risk-header', titleKey: 'tour.steps.risk.title', contentKey: 'tour.steps.risk.content', nextLabelKey: 'tour.steps.risk.next' },
            { id: 'insights', path: '/cycle-tracker/insights', selector: 'insights-header', titleKey: 'tour.steps.insights.title', contentKey: 'tour.steps.insights.content', nextLabelKey: 'tour.steps.insights.next' },
            { id: 'profile', path: '/profile', selector: 'profile-settings-card', titleKey: 'tour.steps.profile.title', contentKey: 'tour.steps.profile.content', nextLabelKey: 'tour.steps.profile.next' },
            { id: 'education', path: '/education', selector: 'education-hero', titleKey: 'tour.steps.education.title', contentKey: 'tour.steps.education.content', nextLabelKey: 'tour.steps.education.next' },
        ];
    }

    return commonStart;
};

export const TourProvider = ({ children }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 means tour is closed
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourSteps, setTourSteps] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Check for first-time user
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('petal_tour_completed');
        if (!hasSeenTour) {
            const timer = setTimeout(() => {
                // Actually we won't auto-start, we will show a prompt in the UI
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = () => {
        const steps = getTourSteps(user);
        if (!steps.length) return;
        setTourSteps(steps);
        setCurrentStepIndex(0);
        setIsTourActive(true);
        if (location.pathname !== steps[0].path) {
            navigate(steps[0].path);
        }
    };

    const nextStep = () => {
        if (!tourSteps.length) {
            endTour();
            return;
        }
        const nextIdx = currentStepIndex + 1;
        if (nextIdx >= tourSteps.length) {
            endTour();
            return;
        }

        const nextStepData = tourSteps[nextIdx];
        
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
        setTourSteps([]);
        localStorage.setItem('petal_tour_completed', 'true');
    };

    const currentStep = tourSteps[currentStepIndex] || null;

    return (
        <TourContext.Provider value={{ 
            isTourActive, 
            currentStep, 
            startTour, 
            nextStep, 
            endTour,
            currentStepIndex,
            totalSteps: tourSteps.length,
        }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => useContext(TourContext);
