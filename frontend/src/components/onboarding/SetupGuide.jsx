import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const SetupGuide = ({ steps, tourKey }) => {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Check if the user has completed this specific tour before
        const hasCompletedTour = localStorage.getItem(`tour_completed_${tourKey}`);
        if (!hasCompletedTour) {
            // Slight delay so the UI can render
            setTimeout(() => setRun(true), 500);
        }
    }, [tourKey]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem(`tour_completed_${tourKey}`, 'true');
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#4f46e5', // Indigo-600
                    backgroundColor: '#ffffff',
                    textColor: '#1e293b', // Slate-800
                    arrowColor: '#ffffff',
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
                buttonNext: {
                    backgroundColor: '#4f46e5',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 600
                },
                buttonBack: {
                    marginRight: 10,
                    color: '#64748b' // Slate-500
                },
                buttonSkip: {
                    color: '#64748b',
                    fontWeight: 500
                }
            }}
        />
    );
};

export default SetupGuide;
