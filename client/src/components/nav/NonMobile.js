import React from 'react'
import { NavLink } from 'react-router-dom'

export const ROUTES = {
    HOME: '/',
    SEARCH: '/search',
    DISCOVER: '/discover',
}

export const CustomNavLink = ({ to, children, ...props }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            isActive
                ? `${isActive && !props.hovering ? 'underline-force highlight' : ''} relative flex h-full cursor-default items-center justify-center px-12 text-center font-light uppercase text-white transition-colors duration-300 hover:text-pipeline-blue-200`
                : 'underline-hover relative flex h-full items-center justify-center px-12 text-center font-light uppercase text-white transition-colors duration-300 hover:text-pipeline-blue-200'
        }
        {...props}
    >
        {children}
        <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
    </NavLink>
)

export default function NonMobileNavbar({
    user,
    logout,
    pfp,
    linkedinRedirectUrl,
}) {
    const [hovering, setHovering] = React.useState(false)
    const [hovering2, setHovering2] = React.useState(false)
    return (
        <>
            <div className="mx-12 hidden h-full flex-row items-center justify-center text-center md:flex">
                <NavLink to="/">
                    <div className="flex flex-row items-center justify-center gap-4">
                        <img
                            src={'pipelines.png'}
                            className={`h-12 w-12 pr-2 transition-colors duration-300 ${hovering2 ? 'animate-pulse text-pipeline-blue-200' : 'text-white'}`}
                        />

                        <h1
                            className={`text-2xl font-bold text-white transition-colors duration-300 hover:text-pipeline-blue-200`}
                            onMouseEnter={() => setHovering2((prev) => !prev)}
                            onMouseLeave={() => setHovering2((prev) => !prev)}
                        >
                            pipelines.lol
                        </h1>
                    </div>
                </NavLink>

                <CustomNavLink
                    to={ROUTES.HOME}
                    onMouseEnter={() => setHovering((prev) => !prev)}
                    onMouseLeave={() => setHovering((prev) => !prev)}
                    hovering={hovering}
                >
                    About
                </CustomNavLink>
                <CustomNavLink
                    to={ROUTES.SEARCH}
                    onMouseEnter={() => setHovering((prev) => !prev)}
                    onMouseLeave={() => setHovering((prev) => !prev)}
                    hovering={hovering}
                >
                    Search
                </CustomNavLink>
                <CustomNavLink
                    to={ROUTES.DISCOVER}
                    onMouseEnter={() => setHovering((prev) => !prev)}
                    onMouseLeave={() => setHovering((prev) => !prev)}
                    hovering={hovering}
                >
                    Discover
                </CustomNavLink>
                {/* TODO: Make this responsive. */}
                <div className="ml-auto flex flex-row items-center justify-center justify-items-center gap-4 self-center">
                    {!user && (
                        <>
                            <NavLink
                                to={linkedinRedirectUrl}
                                className="relative flex h-full items-center justify-center rounded-lg px-8 py-2 font-normal uppercase text-white shadow-md transition-colors duration-300 hover:bg-white/10"
                            >
                                Login
                                <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
                            </NavLink>
                        </>
                    )}

                    {user && (
                        <>
                            {user.profileCreated ? (
                                <>
                                    <NavLink to={`/user/${user.profileId}`}>
                                        <img
                                            src={pfp || '/avatar.png'}
                                            className="h-12 w-12 rounded-full object-cover hover:animate-pulse"
                                            alt={'user_pfp'}
                                        />
                                    </NavLink>

                                    <NavLink
                                        to="/edit"
                                        className="relative flex h-full items-center justify-center rounded-lg px-8 py-2 font-normal uppercase text-white shadow-md transition-colors duration-300 hover:bg-white/10"
                                    >
                                        Edit Profile
                                        <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/create"
                                        className="relative flex h-full items-center justify-center rounded-lg px-8 py-2 font-normal uppercase text-white shadow-md transition-colors duration-300 hover:bg-white/10"
                                    >
                                        Create Profile
                                        <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
                                    </NavLink>
                                </>
                            )}

                            <button
                                onClick={logout}
                                className="relative flex h-full items-center justify-center rounded-lg px-8 py-2 font-normal uppercase text-white shadow-md transition-colors duration-300 hover:bg-white/10"
                            >
                                Logout
                                <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
