import { companies } from "../data/companyData";
import { ConditionalLink } from "./ConditionalLink"

export const PipelineCard = ({ name, linkedin, anonymous, pipeline }) => {
    return (
        <div className='flex flex-row justify-center items-center bg-gray-200 w-full p-12 rounded-2xl gap-10' key={pipeline._id}>
            <div className="flex flex-col justify-center items-center gap-3">
                <ConditionalLink
                    condition={!anonymous}
                    to={linkedin}
                    target="_blank"
                >
                    <img 
                        className='w-36 h-36 rounded-full' 
                        src="avatar.png" 
                        alt="avatar" 
                    />
                </ConditionalLink>
                <h1 className="text-black font-medium text-xl">{anonymous ? "Anonymous" : name}</h1>
            </div>
            <div className="flex flex-row gap-3">
            {
                pipeline.map((experience, i) => (
                    <div className='flex flex-row justify-center items-center gap-3' key={experience._id}>
                        <ExperienceCard experience={experience} />
                        {
                            (i !== pipeline.length - 1) ? (<h1>--</h1>) : (<></>)
                        }
                    </div>
                ))
            }
            </div>
        </div>
    )
}

const ExperienceCard = ({ experience }) => {
    function getLogoByName(companyName) {
        const foundCompany = companies.find(company => company.name === companyName);
        return foundCompany ? foundCompany.logo : null;
    }

    const logo = `logos/${getLogoByName(experience.company)}`;

    return (
        <div className="flex flex-col justify-center items-center gap-3" key={experience._id}>
            <img 
                className="w-24 h-24 rounded-md"
                src={logo}
                alt={`${experience.company}_logo`}
            />
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-black font-semibold text-2xl">{experience.company}</h1>
                <h1 className="text-black font-thin italic text-xl">{experience.title}</h1>
                <h1 className="text-black opacity-60 font-light text-xl">{experience.date}</h1>
            </div>
        </div>
    )
}