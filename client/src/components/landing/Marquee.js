import { companies } from '../../data/companyData'

const LogoMarquee = () => {
    const logos = Array.from(
        { length: 30 },
        () => companies[Math.floor(Math.random() * companies.length)]
    )
    return (
        <>
            <div className="inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <ul className="my-12 flex animate-infinite-scroll items-center justify-center gap-20 md:justify-start [&_img]:max-w-none [&_li]:mx-8">
                    {logos.map((logo, index) => (
                        <li key={index}>
                            <img
                                src={`https://pipelines.lol/logos/${logo.logo}`}
                                alt={logo.alt}
                                className="xs:w-20 xs:h-20 h-20 w-20 scale-90 rounded-md object-contain sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                            />
                        </li>
                    ))}
                </ul>
                <ul
                    className="flex animate-infinite-scroll items-center justify-center gap-20 md:justify-start [&_img]:max-w-none [&_li]:mx-8"
                    aria-hidden="true"
                >
                    {logos.map((logo, index) => (
                        <li key={index}>
                            <img
                                src={`https://pipelines.lol/logos/${logo.logo}`}
                                alt={logo.alt}
                                className="xs:w-20 xs:h-20 h-20 w-20 scale-90 rounded-md object-contain sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

const SlidingImages = () => {
    return (
        <>
            <section className="flex h-[70vh] w-full flex-col items-center justify-start border-b-[0.5px] border-t-[0.5px] border-pipeline-blue-200 bg-gray-900/50 bg-opacity-95 backdrop-blur-lg backdrop-filter">
                <h1 className="xs:text-2xl mx-8 mt-12 py-12 text-center text-4xl font-light text-pipelines-gray-100">
                    Pipelines is Trusted by Engineers at Top Tech Companies
                </h1>
                <LogoMarquee />
            </section>
        </>
    )
}

export default SlidingImages
