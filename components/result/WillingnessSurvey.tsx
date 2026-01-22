"use client";

import { motion } from "framer-motion";

interface WillingnessSurveyProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function WillingnessSurvey({ value, onChange }: WillingnessSurveyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl border border-border p-6"
    >
      <p className="font-medium text-text-primary text-center">
        Quick question: Would you pay around £8–12 for this service?
      </p>
      <p className="mt-1 text-body-sm text-text-secondary text-center">
        This helps us understand what matters to you
      </p>

      <div className="mt-6 flex gap-3">
        <SurveyButton
          selected={value === true}
          onClick={() => onChange(true)}
          icon={<ThumbsUpIcon />}
          label="Yes, definitely"
        />
        <SurveyButton
          selected={value === false}
          onClick={() => onChange(false)}
          icon={<ThumbsDownIcon />}
          label="Maybe not"
        />
      </div>

      {value !== null && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-body-sm text-text-muted text-center"
        >
          {value
            ? "Great! We're building this for people like you."
            : "Thanks for the feedback—we'll work on making it more valuable."}
        </motion.p>
      )}
    </motion.div>
  );
}

function SurveyButton({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`
        flex-1 p-4 rounded-xl border-2 text-center
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? "border-primary bg-primary-light"
            : "border-border bg-surface-base hover:border-border-strong"
        }
      `}
    >
      <div
        className={`
          w-10 h-10 rounded-full mx-auto flex items-center justify-center
          ${selected ? "bg-primary text-white" : "bg-white text-text-secondary"}
        `}
      >
        {icon}
      </div>
      <p
        className={`mt-2 font-medium ${selected ? "text-primary" : "text-text-primary"}`}
      >
        {label}
      </p>
    </motion.button>
  );
}

function ThumbsUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5031 9H14V4C14 2.89543 13.1046 2 12 2C11.4477 2 11 2.44772 11 3V4.5L7 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H6.57385C5.09301 2 3.83384 3.08027 3.60863 4.54376L2.53174 11.5438C2.25207 13.3611 3.65823 15 5.49687 15H10V20C10 21.1046 10.8954 22 12 22C12.5523 22 13 21.5523 13 21V19.5L17 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
