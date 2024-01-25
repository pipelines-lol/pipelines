import { Link } from 'react-router-dom'

export const ConditionalLink = ({ children, condition, ...props }) => {
    return !!condition && props.to ? (
        <Link {...props}>{children}</Link>
    ) : (
        <>{children}</>
    )
}
