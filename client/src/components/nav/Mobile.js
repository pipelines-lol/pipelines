import { NavLink, useNavigate } from 'react-router-dom'
import CTAButton from '../landing/CTAButton'

const OVERLAY_CLASS = `absolute left-0 top-16 z-50 flex h-96 w-full flex-col items-center justify-center bg-black/90 bg-opacity-5 shadow-md backdrop-blur-3xl backdrop-filter md:hidden`
const MobileNavLink = ({ to, children, className, ...props }) => (
    <NavLink
        to={to}
        className={`${className || ' pb-7 text-xl font-medium uppercase text-white'}`}
        {...props}
    >
        {children}
    </NavLink>
)

export default function MobileNavigationBar({
    user,
    dispatch,
    linkedinRedirectUrl,
    toggleMobileNavbar,
    mobileNavbar,
}) {
    const navigate = useNavigate()
    const MOBILE_ROUTES = {
        HOME: '/',
        SEARCH: '/search',
        DISCOVER: '/discover',
        CREATE: '/create',
        EDIT: '/edit',
        USER: `/user/${user?.profileId}`,
    }
    return (
        <>
            <div className="absolute left-0 top-0 mx-12 flex h-16 w-full flex-row items-center justify-start text-center hover:cursor-pointer md:hidden">
                <div onClick={() => toggleMobileNavbar(!mobileNavbar)}>
                    <svg
                        viewBox="0 0 20 20"
                        fill="#ffff"
                        className="absolute right-5 top-5 mx-12 h-8 w-8 md:hidden"
                    >
                        {!mobileNavbar && (
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        )}
                    </svg>
                </div>
                <div>
                    <NavLink to="/">
                        <div className="flex flex-row items-center justify-center gap-4 md:hidden">
                            <img
                                src={'pipelines.png'}
                                className="h-12 w-12 pr-2"
                            />

                            <h1 className="text-2xl font-bold text-white">
                                pipelines.lol
                            </h1>
                        </div>
                    </NavLink>
                </div>
            </div>

            {mobileNavbar && (
                <>
                    <div
                        onClick={() => toggleMobileNavbar(!mobileNavbar)}
                        className="hover:cursor-pointer"
                    >
                        <svg
                            viewBox="0 0 1024 1024"
                            fill="#ffff"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-5 top-5 h-8 w-8"
                        >
                            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                        </svg>
                    </div>

                    <ul onClick={() => toggleMobileNavbar(!mobileNavbar)}>
                        <div className={OVERLAY_CLASS}>
                            <MobileNavLink to={MOBILE_ROUTES.HOME}>
                                About
                            </MobileNavLink>

                            <MobileNavLink to={MOBILE_ROUTES.SEARCH}>
                                Search
                            </MobileNavLink>

                            <MobileNavLink to={MOBILE_ROUTES.DISCOVER}>
                                Discover
                            </MobileNavLink>

                            {!user && (
                                <>
                                    <CTAButton
                                        href={linkedinRedirectUrl}
                                        text="Login"
                                    />
                                </>
                            )}

                            {user && (
                                <>
                                    {user.profileCreated ? (
                                        <>
                                            <MobileNavLink
                                                to={MOBILE_ROUTES.USER}
                                            >
                                                Profile
                                            </MobileNavLink>

                                            <MobileNavLink
                                                to={MOBILE_ROUTES.EDIT}
                                            >
                                                Edit Profile
                                            </MobileNavLink>
                                        </>
                                    ) : (
                                        <>
                                            <MobileNavLink
                                                to={MOBILE_ROUTES.CREATE}
                                            >
                                                Create Profile
                                            </MobileNavLink>
                                        </>
                                    )}

                                    <button
                                        onClick={() => {
                                            dispatch({ type: 'LOGOUT' })
                                            localStorage.setItem('user', null)
                                            navigate('/')
                                        }}
                                    >
                                        <h1 className="text-xl font-light uppercase text-white">
                                            Logout
                                        </h1>
                                    </button>
                                </>
                            )}
                        </div>
                    </ul>
                </>
            )}
        </>
    )
}
