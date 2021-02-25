import { createContext, ReactNode, useState } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    activeChallenge: Challenge;
    resetChallenge: () => void;
    experiencieToNextLevel: number;
    completeChallenge: () => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengeProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const experiencieToNextLevel = Math.pow((level + 1) * 4, 2);

    function levelUp() {
        setLevel(level + 1)
    }

    function startNewChallenge() {
        const randoChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randoChallengeIndex];

        setActiveChallenge(challenge);
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge)
            return;

        const { amount } = activeChallenge;
        
        let finalExperience = currentExperience + amount;

        if(finalExperience >= experiencieToNextLevel) {
            finalExperience = finalExperience - experiencieToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider value={{
            level, 
            levelUp, 
            challengesCompleted, 
            currentExperience,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            experiencieToNextLevel,
            completeChallenge
        }}>
            {children}
        </ChallengesContext.Provider>
    );
}