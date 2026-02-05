import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    id: number;
    title: string;
    description: string;
}

interface ApplicationStepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (step: number) => void;
}

export function ApplicationStepper({ steps, currentStep, onStepClick }: ApplicationStepperProps) {
    return (
        <div className="w-full">
            {/* Desktop Stepper */}
            <div className="hidden md:flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                    <motion.div
                        className="h-full bg-gold"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isClickable = step.id <= currentStep;

                    return (
                        <div
                            key={step.id}
                            className={cn(
                                'relative flex flex-col items-center z-10',
                                isClickable && 'cursor-pointer'
                            )}
                            onClick={() => isClickable && onStepClick(step.id)}
                        >
                            <motion.div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                                    isCompleted && 'bg-success text-white',
                                    isCurrent && 'bg-gold text-accent-foreground',
                                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                                )}
                                whileHover={isClickable ? { scale: 1.05 } : {}}
                                whileTap={isClickable ? { scale: 0.95 } : {}}
                            >
                                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                            </motion.div>
                            <div className="mt-3 text-center">
                                <p
                                    className={cn(
                                        'text-sm font-medium',
                                        isCurrent ? 'text-foreground' : 'text-muted-foreground'
                                    )}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 hidden lg:block">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Stepper */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-foreground">
                        Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {steps[currentStep - 1]?.title}
                    </span>
                </div>
                <div className="flex gap-1">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                'h-1 flex-1 rounded-full transition-colors',
                                step.id <= currentStep ? 'bg-gold' : 'bg-muted'
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
