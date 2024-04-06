import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const searchSVG = (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        className="h-8 w-8"
    >
        <path d="M10 18a7.952 7.952 0 004.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0018 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
        <path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 00-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z" />
    </svg>
)

const linkedInSVG = (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        strokeWidth="0.2"
        className="h-8 w-8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M7.5 9h-4a.5.5 0 00-.5.5v12a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-12a.5.5 0 00-.5-.5zM7 21H4V10h3v11zM18 9c-1.085 0-2.14.358-3 1.019V9.5a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5v12a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V16a1.5 1.5 0 113 0v5.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V14a5.006 5.006 0 00-5-5zm4 12h-3v-5a2.5 2.5 0 10-5 0v5h-3V10h3v1.203a.5.5 0 00.89.313A3.983 3.983 0 0122 14v7zM5.868 2.002A2.73 2.73 0 005.515 2a2.74 2.74 0 00-2.926 2.729 2.71 2.71 0 002.869 2.728h.028a2.734 2.734 0 10.382-5.455zM5.833 6.46c-.115.01-.231.01-.347-.003h-.028A1.736 1.736 0 115.515 3a1.737 1.737 0 01.318 3.46z" />
    </svg>
)

const secureSVG = (
    <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1"
        className="h-8 w-8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
    </svg>
)

const globeSVG = (
    <svg
        fill="currentColor"
        viewBox="0 0 16 16"
        stroke="currentColor"
        strokeWidth="0.1"
        className="h-8 w-6"
    >
        <path d="M0 8a8 8 0 1116 0A8 8 0 010 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 005.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 01.64-1.539 6.7 6.7 0 01.597-.933A7.025 7.025 0 002.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 00-.656 2.5h2.49zM4.847 5a12.5 12.5 0 00-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 00-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 00.337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 01-.597-.933A9.268 9.268 0 014.09 12H2.255a7.024 7.024 0 003.072 2.472zM3.82 11a13.652 13.652 0 01-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0013.745 12H11.91a9.27 9.27 0 01-.64 1.539 6.688 6.688 0 01-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 01-.312 2.5zm2.802-3.5a6.959 6.959 0 00-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 00-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 00-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
    </svg>
)

const offeringsData = [
    {
        title: 'Search The Pipelines Database',
        icon: searchSVG,
        description:
            'Search our community-led pipelines for any company in our database. Pipelines is powered by the community and built for the community.',
    },
    {
        title: 'Seamless LinkedIn Integration',
        icon: linkedInSVG,
        description:
            "You can sign up with your LinkedIn account, and we'll automatically import your profile picture and metadata. It's really that simple.",
    },
    {
        title: 'Secure and Anonymous',
        icon: secureSVG,
        description:
            'You can choose to be anonymous when sharing your pipeline. Unlike LinkedIn, you control what you share with us.',
    },
    {
        title: 'Discover Pipelines Globally',
        icon: globeSVG,
        description:
            "We're not just limited to the United States. You can find pipelines from all over the world, and you can share your pipeline with the world.",
    },
]

const Offering = (props) => {
    return (
        <div className="flex">
            <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md text-white hover:bg-gradient-to-tl">
                    {props.icon}
                </div>
            </div>
            <div className="ml-4">
                <dt className="text-xl font-semibold leading-6 text-sky-600">
                    {props.title}
                </dt>
                <div className="mr-8 mt-2 text-sm text-pipelines-gray-100/50 md:text-lg">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

const Offerings = () => {
    const ref = useRef()
    const ref2 = useRef()
    //  Add a field { once: true } to only animate once eg. --> useInView(ref, { once: true })
    const inView = useInView(ref)
    const inView2 = useInView(ref2)

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.5,
            },
        },
    }

    const parent = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeInOut',
                delay: 0.3,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12 } },
    }

    return (
        <div className="mb-12 flex h-full w-full flex-col items-center  justify-center border-b-[0.5px] border-t-[0.5px] border-pipeline-blue-200">
            <div className="w-full rounded-lg">
                <div className="rounded-xl bg-gray-950 py-12">
                    <div className="mx-auto max-w-7xl px-4 md:px-8">
                        <motion.div
                            variants={parent}
                            initial="hidden"
                            animate={inView2 ? 'visible' : 'hidden'}
                            ref={ref2}
                        >
                            <div className="text-center">
                                <h2 className="text-uppercase mx-auto mt-10 font-semibold tracking-wide text-pipeline-blue-200 md:max-w-3xl md:text-center">
                                    What We Offer
                                </h2>
                                <p className="xs:max-w-3xl mx-auto my-8 text-2xl font-normal tracking-tight text-pipelines-gray-100 sm:px-12 sm:text-4xl md:text-center lg:text-6xl">
                                    Take a deeper dive into{' '}
                                    <span className="bg-gradient-to-tl from-pipeline-blue-200 to-pipeline-blue-200 bg-clip-text text-transparent">
                                        LinkedIn.
                                    </span>
                                </p>
                                <p className="text-md mx-auto px-8 font-normal tracking-normal text-pipelines-gray-100/80 sm:max-w-lg md:max-w-2xl md:text-center md:text-xl">
                                    No more of the &#34;outside your
                                    network&#34; blocker. No more algorithms. No
                                    more ads. No more feeling like a stalker.
                                </p>
                            </div>

                            <div className="mt-10">
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate={inView ? 'show' : 'hidden'}
                                    ref={ref}
                                >
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {offeringsData.map((offering, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={item}
                                                className="rounded-md border-[0.5px] border-white/20 p-5"
                                            >
                                                <Offering
                                                    title={offering.title}
                                                    icon={offering.icon}
                                                >
                                                    {offering.description}
                                                </Offering>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            <p className="mx-auto mb-12 mt-12 p-4 text-center text-xl font-normal tracking-normal text-pipelines-gray-100/80 md:max-w-3xl">
                                Pipelines focuses on the core of what LinkedIn
                                was meant to be: a place to share your career
                                journey with others.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Offerings
