import { useState } from 'react'

const Suggestions = () => {
    const [suggestionType, setSuggestionType] = useState('')

    const handleDropdown = (event) => {
        setSuggestionType(event.target.value)
    }

    return (
        <div className="flex h-[90vh] w-full items-center justify-center">
            <div
                className="flex h-full w-full flex-col items-center justify-center gap-5 bg-pipeline-blue-200/20 text-center"
                style={{
                    backgroundImage: 'url("hero.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '100%',
                    borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                    borderTop: '1px solid rgba(2, 101, 172, 0.3)',
                }}
            >
                <div className="md:w=[28rem] h-7/10 mt-8 flex w-1/2 flex-col items-center justify-center gap-10 rounded-lg border border-pipeline-blue-200/20 bg-white/10  bg-opacity-10 py-12 shadow-lg  backdrop-blur-xl backdrop-filter lg:w-[32rem] xl:w-[36rem]">
                    <h1 className="text-2xl font-semibold uppercase tracking-wide text-pipelines-gray-100">
                        Suggestions
                    </h1>
                    <p className="text-xl font-light text-pipelines-gray-100/80">
                        Find a bug? Want to suggest a company? <br /> Let us
                        know!
                    </p>

                    <div className="flex w-full flex-col gap-3 px-4">
                        <select
                            value={suggestionType}
                            onChange={handleDropdown}
                            className={
                                'z-20 mx-auto w-4/6 rounded-2xl bg-gray-100/60 px-4 py-2 text-black outline-none placeholder:text-gray-950/30'
                            }
                        >
                            <option value="" disabled hidden>
                                {' '}
                                Suggestion Type
                            </option>
                            <option value="company">Company</option>
                            <option value="website-issues">Bugs/Issues</option>
                            <option value="other">Other</option>
                        </select>

                        <form
                            action="https://getform.io/f/0f9b59be-ed87-4f61-b536-63e11c134c9e"
                            method="POST"
                        >
                            {suggestionType === 'company' && (
                                <textarea
                                    type="text"
                                    name="company"
                                    className="mb-4 mt-7 w-full resize-none rounded-md border border-pipeline-blue-200/20 bg-pipelines-gray-100/80 px-4 py-4 text-gray-950 outline-none focus:border-transparent focus:ring-2 focus:ring-pipeline-blue-200"
                                    placeholder="Can you add Ouckah LLC?"
                                    rows="4"
                                    required
                                />
                            )}

                            {suggestionType === 'website-issues' && (
                                <textarea
                                    type="text"
                                    name="website-issues"
                                    className="mb-4 mt-7 w-full resize-none rounded-md border border-pipeline-blue-200/20 bg-pipelines-gray-100/80 px-4 py-4 text-gray-950 outline-none focus:border-transparent focus:ring-2 focus:ring-pipeline-blue-200"
                                    placeholder="Error when I try to add a company"
                                    rows="4"
                                    required
                                />
                            )}
                            {suggestionType === 'other' && (
                                <textarea
                                    type="text"
                                    name="other"
                                    className="mb-4 mt-7 w-full resize-none rounded-md border border-pipeline-blue-200/20 bg-pipelines-gray-100/80 px-4 py-4 text-gray-950 outline-none focus:border-transparent focus:ring-2 focus:ring-pipeline-blue-200"
                                    placeholder="You guys smell"
                                    rows="4"
                                    required
                                />
                            )}

                            <div className="mx-auto flex w-1/3 flex-col whitespace-nowrap pt-2 hover:cursor-pointer">
                                <a
                                    onClick={() =>
                                        console.log('submitting suggestion')
                                    }
                                    className="group relative z-0 mt-6 inline-flex items-center justify-center overflow-hidden rounded-lg bg-pipelines-gray-100 px-10 py-2 font-light tracking-wide text-black/80"
                                >
                                    <span className="absolute h-0 w-0 rounded-full bg-pipeline-blue-200 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
                                    <span className="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-30"></span>
                                    <span className="relative">
                                        Submit Suggestion
                                    </span>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Suggestions
