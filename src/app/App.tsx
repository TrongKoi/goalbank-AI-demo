import React, { useState } from 'react';
import { GoalSetup } from './components/GoalSetup';
import { Analysis } from './components/Analysis';
import { SmartSurplus } from './components/SmartSurplus';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [step, setStep] = useState(0); 
  const [returnToReview, setReturnToReview] = useState(false);

  // Lắng nghe sự kiện click logo để quay về màn 0
  React.useEffect(() => {
    const goHome = () => {
      setStep(0);
      setReturnToReview(false);
    };
    window.addEventListener('goHome', goHome);
    return () => window.removeEventListener('goHome', goHome);
  }, []);

  return (
    <div className="bg-[#0b1221] min-h-screen text-white">
      {step === 0 && <Dashboard onAddGoal={() => { setStep(1); setReturnToReview(false); }} />}
      {step === 1 && <GoalSetup onNext={() => setStep(2)} initialStep={returnToReview ? 2 : 0} />}
      {step === 2 && <Analysis onNext={() => setStep(3)} onBack={() => { setStep(1); setReturnToReview(true); }} />}
      {step === 3 && <SmartSurplus onBack={() => setStep(2)} />}
    </div>
  );
}