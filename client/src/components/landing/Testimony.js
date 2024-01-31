import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
export default function Testimonies() {
    const ref = useRef()
    const isInView = useInView(ref)
    return (
        <>
            <section className="flex h-full w-full flex-col items-center justify-center gap-4 border-b-[0.5px] border-pipeline-blue-200 bg-black/35 bg-opacity-95  py-20 backdrop-blur-lg backdrop-filter">
                <div className="mx-auto max-w-2xl px-12 lg:max-w-none">
                    <h1 className="xs:text-xl mx-8 text-center text-xl font-normal text-pipelines-gray-100/80 sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">
                        What are our users saying?
                    </h1>
                    <motion.h1
                        ref={ref}
                        initial={{ y: 60, opacity: 0 }}
                        animate={
                            isInView
                                ? { y: 0, opacity: 1 }
                                : { y: 60, opacity: 0 }
                        }
                        transition={{
                            duration: 1,
                            delay: 0.3,
                            ease: 'easeOut',
                        }}
                        style={{
                            willChange: 'transform',
                            translateY: 20,
                        }}
                        className="xs:text-xl mx-8 -mt-2 text-center text-xl font-normal text-pipelines-gray-100/80 sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl"
                    >
                        Spoiler Alert: They
                        <span className="font-semibold text-pipeline-blue-200">
                            {' '}
                            <span className="underline">love</span> Pipelines.
                        </span>{' '}
                    </motion.h1>

                    <div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-16 lg:space-y-0">
                        <blockquote className="sm:flex lg:block">
                            <svg
                                width="24"
                                height="18"
                                viewBox="0 0 24 18"
                                aria-hidden="true"
                                className="flex-shrink-0 text-gray-300"
                            >
                                <path
                                    d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
                                    fill="currentColor"
                                />
                            </svg>
                            <div className="mt-8 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-10">
                                <p className="text-lg text-pipelines-gray-100/80">
                                    The Pipelines app helped me realize that
                                    even though I didn&#39;t go to a target
                                    school, I could still land a job at the big
                                    names in tech.
                                </p>
                                <cite className="mt-4 block font-semibold not-italic text-pipeline-blue-200">
                                    Delilah Janis, Incoming Product Manager
                                    Intern at Square
                                </cite>
                            </div>
                        </blockquote>
                        <blockquote className="sm:flex lg:block">
                            <svg
                                width="24"
                                height="18"
                                viewBox="0 0 24 18"
                                aria-hidden="true"
                                className="flex-shrink-0 text-gray-300"
                            >
                                <path
                                    d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
                                    fill="currentColor"
                                />
                            </svg>
                            <div className="mt-8 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-10">
                                <p className="text-lg text-pipelines-gray-100/80">
                                    My favorite part about Pipelines is that I
                                    can see the different paths people have
                                    taken to get to their dream job. It&#39;s
                                    really inspiring.
                                </p>
                                <cite className="mt-4 block font-semibold not-italic text-pipeline-blue-200">
                                    Tavarius Fleming, Incoming Product
                                    Engineering Intern at Jane Street
                                </cite>
                            </div>
                        </blockquote>
                        <blockquote className="sm:flex lg:block">
                            <svg
                                width="24"
                                height="18"
                                viewBox="0 0 24 18"
                                aria-hidden="true"
                                className="flex-shrink-0 text-gray-300"
                            >
                                <path
                                    d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
                                    fill="currentColor"
                                />
                            </svg>
                            <div className="mt-8 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-10">
                                <p className="text-lg text-pipelines-gray-100/80">
                                    Where was this when I was in college? Even
                                    now as a full-time engineer, I find it
                                    useful to see what others have done without
                                    having to connect with them on LinkedIn.
                                </p>
                                <cite className="mt-4 block font-semibold not-italic text-pipeline-blue-200">
                                    Amanda Smith, Staff Software Engineer at
                                    Robinhood
                                </cite>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </section>
        </>
    )
}
