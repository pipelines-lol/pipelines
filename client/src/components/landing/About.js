import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Timeline from './Timeline'

export default function About() {
    const ref = useRef(null)
    const ref2 = useRef(null)
    const inView = useInView(ref)
    const inView2 = useInView(ref2)
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
    return (
        <>
            <section className="flex h-full w-full flex-row items-center justify-center">
                <div className="flex h-full w-full flex-col">
                    <h1 className="self-center text-4xl font-light text-pipelines-gray-100 lg:text-6xl">
                        What is a pipeline?
                    </h1>

                    <motion.p
                        variants={parent}
                        initial="hidden"
                        animate={inView2 ? 'visible' : 'hidden'}
                        ref={ref2}
                        className="mx-12 mt-12 max-w-xl self-center text-center text-2xl font-light text-pipelines-gray-100 lg:text-3xl"
                    >
                        A pipeline is a collection of experiences that
                        individuals embark on throughout their career.
                    </motion.p>
                    <div className="flex w-full flex-row items-center justify-center">
                        <Timeline>
                            <div className="left-timeline mb-8 flex w-full flex-row-reverse items-center justify-between">
                                <div className="order-1"></div>
                                <div className="order-1 hidden py-4  text-center text-4xl md:flex">
                                    <p>
                                        Think of a pipeline as a roadmap of
                                        internships, jobs, and other
                                        opportunities that you can take to reach
                                        your career goals.
                                    </p>
                                </div>
                            </div>
                        </Timeline>
                    </div>
                </div>
            </section>

            <section className="flex h-full w-full flex-row flex-wrap items-center justify-center -space-x-32 py-24 lg:flex-nowrap">
                <motion.div
                    variants={parent}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    ref={ref}
                    className="flex h-full w-full flex-col items-start justify-center"
                >
                    <p className="mx-20 max-w-xl text-left text-xl font-light leading-7 text-pipelines-gray-100 md:text-xl lg:text-2xl xl:text-3xl">
                        With{' '}
                        <span className="font-semibold text-pipeline-blue-200">
                            pipelines.lol
                        </span>
                        , gain insights, draw inspiration, and chart your course
                        by discovering the diverse destinations that await along
                        your very own career pipeline.
                    </p>
                </motion.div>

                <div className="flex h-full w-full items-center justify-center">
                    <img
                        className="h-[50vh] w-full object-contain"
                        src={'Hero.svg'}
                        alt={'Hero'}
                    />
                </div>
            </section>
        </>
    )
}
