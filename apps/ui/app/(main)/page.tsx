
import { ContinueLearning, DailyProgress, HeroSection, Overview } from "../features/home";

export default function HomePage() {


    return (
        <div className="flex w-full flex-col gap-4 p-4">
            <HeroSection />
            <Overview />
            <DailyProgress />
            <ContinueLearning />
            {/* <CTA /> */}
        </div>
    )
}