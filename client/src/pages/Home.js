import { useEffect, useState } from 'react'

import About from '../components/landing/About'
import CTA from '../components/landing/CTA'
import Hero from '../components/landing/Hero'
import SlidingImages from '../components/landing/Marquee'
import Offerings from '../components/landing/Offerings'
import People from '../components/landing/People'
import Testimonies from '../components/landing/Testimony'
import { HOST } from '../util/apiRoutes'
import Loading from './Loading'

function Home() {
    // TODO: Decide if we really want to use this
    const [, setProfiles] = useState([])

    const [loading, setLoading] = useState(false)

    const generateProfiles = async () => {
        const size = 4
        setLoading(true)

        fetch(`${HOST}/api/pipeline/random/${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
        })
            .then((res) => {
                if (!res.ok) {
                    // Check if the response has JSON content
                    if (
                        res.headers
                            .get('content-type')
                            ?.includes('application/json')
                    ) {
                        return res.json().then((errorData) => {
                            throw new Error(`${errorData.error}`)
                        })
                    } else {
                        throw new Error(`HTTP error! Status: ${res.status}`)
                    }
                }
                return res.json()
            })
            .then((data) => {
                setProfiles([...data])
                setLoading(false)
            })
            .catch((error) => {
                console.error(error.message)
            })
    }

    useEffect(() => {
        generateProfiles()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div className="flex h-full w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat">
                <Hero />
                <Offerings />
                <About />
                <People />
                <SlidingImages />
                <Testimonies />
                <CTA />
            </div>
        </>
    )
}

export default Home
