// assets
import BigSmiley from '../static/ratings/BigSmiley.png'
import smiley from '../static/ratings/smiley.png'
import neutral from '../static/ratings/neutral.png'
import frown from '../static/ratings/frown.png'
import demon from '../static/ratings/demon.png'

export const CompanyCard = ({ company }) => {
    const options = [demon, frown, neutral, smiley, BigSmiley]

    return (
        <div className="min-h-4/5 min-w-1/4 mt-24 flex flex-col rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 p-8 py-5 text-pipelines-gray-100 md:flex-row md:gap-5 md:px-16 md:py-10 lg:mt-0 ">
            <div className="card flex-col items-center justify-center">
                <img
                    src={company.logo}
                    className="shadow-2x h-32 w-32 max-w-sm rounded-lg bg-slate-100 object-contain p-2 md:h-64 md:w-64"
                />
                <div className="flex-row object-center">
                    <h1 className="p-6 text-center text-5xl font-bold text-slate-200">
                        {company.name}
                    </h1>
                </div>
            </div>
            <div className="ml-4 w-min flex-col object-center p-2">
                <p className="mb-2 w-72 p-2 text-lg">{company.info}</p>
                {company.rating !== null ? (
                    <div className="card w-min flex-row	bg-gray-900 bg-opacity-60 p-3 shadow-xl">
                        <p className="mr-2 p-2 text-lg font-bold text-slate-200">
                            Rating:
                        </p>
                        <div
                            className="tooltip"
                            data-tip={company.rating + '/5'}
                        >
                            <div className="avatar mr-2 h-12 w-12 rounded-full">
                                <img
                                    src={options[Math.ceil(company.rating) - 1]}
                                    alt="rating"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
}
