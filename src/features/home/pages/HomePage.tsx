import FeaturesSection from '../components/FeatureSection';
import HeroSection from '../components/HeroSection';
import HomeCtaSection from '../components/HomeCtaSection';
import HowItWorksSection from '../components/HowItWorkSection';

function HomePage() {
    return (
        <main>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <HomeCtaSection />
        </main>
    );
}

export default HomePage;