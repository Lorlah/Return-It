import { HeroSection, FrictionThemes, HowItWorks, QuickStartForm, TrustBadges } from "@/components/landing";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FrictionThemes />
      <HowItWorks />
      <TrustBadges />
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto section-padding">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PackageIcon />
            <span className="font-display text-lg text-text-primary">Return-It</span>
          </div>
          <p className="text-body-sm text-text-muted">
            © {new Date().getFullYear()} Return-It. Made with care in the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PackageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M16.5 9.4L7.5 4.21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44136 20 6.263L13 2.263C12.696 2.08449 12.3511 1.99082 12 1.99082C11.6489 1.99082 11.304 2.08449 11 2.263L4 6.263C3.69626 6.44136 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5586 4 17.737L11 21.737C11.304 21.9155 11.6489 22.0092 12 22.0092C12.3511 22.0092 12.696 21.9155 13 21.737L20 17.737C20.3037 17.5586 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.27 6.96L12 12.01L20.73 6.96"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22.08V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
