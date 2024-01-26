import About from '../components/landing/About'
import CTA from '../components/landing/CTA'
import Hero from '../components/landing/Hero'
import SlidingImages from '../components/landing/Marquee'
import Offerings from '../components/landing/Offerings'
import People from '../components/landing/People'
import Testimonies from '../components/landing/Testimony'

function Home() {
    return (
        <>
            <div className="flex h-full w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat">
                <Hero />
                <Offerings />
                <About />
                <People />
                <SlidingImages />
                <Testimonies />
                <CTA />
            </div>
        </>
    )
}

export default Home
