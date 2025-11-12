'use client'

import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  steps: Array<{ id: string; title: string }>
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    index < currentStep
                      ? 'bg-[#5b40d7] text-white'
                      : index === currentStep
                        ? 'bg-[#5b40d7] text-white ring-4 ring-[#5b40d7]/20'
                        : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center whitespace-nowrap
                  ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}
                `}
              >
                {step.title}
              </span>
            </div>

            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2">
                <div
                  className={`
                    h-full transition-all duration-300
                    ${index < currentStep ? 'bg-[#5b40d7]' : 'bg-gray-200'}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
