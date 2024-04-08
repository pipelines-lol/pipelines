import { useState } from 'react'

import { HOST } from '../../../util/apiRoutes'
import { fetchWithAuth } from '../../../util/fetchUtils'

export const EmailPage = () => {
    const [subject, setSubject] = useState('')
    const [htmlInput, setHtmlInput] = useState('')
    const [testEmail, setTestEmail] = useState('')

    // State to manage the checkbox value
    const [sendToEarlyAccess, setSendToEarlyAccess] = useState(false)
    const [sendToTestEmail, setSentToTestEmail] = useState(false)

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // Function to handle input change
    const handleInputChange = (e) => {
        setHtmlInput(e.target.value)
    }

    // Function to handle checkbox change
    const handleCheckboxChange = (event) => {
        setSendToEarlyAccess(event.target.checked)
    }

    const handleTestCheckboxChange = (event) => {
        setSentToTestEmail(event.target.checked)
    }

    const handleTestEmailChange = (event) => {
        setTestEmail(event.target.value)
    }

    // Function for sending emails
    const handleSubmit = async () => {
        setLoading(true)

        // Prepare the data for the API call
        const data = {
            subject: subject,
            body: htmlInput,
            testEmail: testEmail,
        }

        // Construct the base URL
        let url = `${HOST}/api/email/send`

        // Check if test email is provided and add it to the URL
        if (testEmail) {
            url += `?test=true`
        }

        // Check if sendToEarlyAccess is true, add earlyAccess=true query parameter
        else if (sendToEarlyAccess) {
            // If test email is also enabled, append with '&', otherwise with '?'
            url += '?earlyAccess=true'
        }

        try {
            await fetchWithAuth({
                url,
                method: 'POST',
                data: data,
            })

            setSuccess(true)
        } catch (error) {
            setErrorMessage(
                error.message || 'Email failed to send. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-full w-full flex-col items-center gap-5 space-y-8 rounded-2xl border-2 border-transparent px-24 py-12 text-gray-800">
            <h2 className="text-2xl font-medium text-black">Email Dashboard</h2>

            {/* Subject input */}
            <input
                type="text"
                className="w-full rounded-lg border border-gray-400 bg-gray-200 p-4 focus:outline-none"
                placeholder="Enter Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />

            <div className="flex w-full flex-col gap-5 md:flex-row">
                {/* Left section: HTML input */}
                <textarea
                    className="focus:border-pipeline-blue-500 h-96 w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-800 focus:outline-none"
                    placeholder="Enter HTML code here..."
                    value={htmlInput}
                    onChange={handleInputChange}
                />

                {/* Right section: Live preview */}
                <div
                    className="h-96 w-full overflow-auto rounded-lg border border-gray-300 bg-gray-100 p-4"
                    dangerouslySetInnerHTML={{ __html: htmlInput }}
                />
            </div>

            {/* Checkbox to select whether to send to early access */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="earlyAccessCheckbox"
                    checked={sendToEarlyAccess}
                    onChange={handleCheckboxChange}
                    className="focus:border-pipeline-blue-500 focus:ring-pipeline-blue-500 rounded border-gray-300"
                />
                <label htmlFor="earlyAccessCheckbox" className="text-black">
                    Early Access
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="testCheckbox"
                    checked={sendToTestEmail}
                    onChange={handleTestCheckboxChange}
                    className="focus:border-pipeline-blue-500 focus:ring-pipeline-blue-500 rounded border-gray-300"
                />
                <label htmlFor="testCheckbox" className="text-black">
                    Send Test Email{sendToTestEmail ? ':' : ''}
                </label>
                {sendToTestEmail && (
                    <input
                        type="email"
                        value={testEmail}
                        onChange={handleTestEmailChange}
                        className="ml-2 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        placeholder="Test Email Address"
                    />
                )}
            </div>

            {/* Submit button */}
            <button
                className="rounded-md bg-pipeline-blue-200 px-6 py-3 text-white hover:bg-pipeline-blue-200/80 focus:bg-pipeline-blue-200/80 focus:outline-none"
                onClick={handleSubmit}
            >
                {loading ? 'Sending...' : 'Send Emails'}
            </button>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            {success && (
                <div className="text-green-500">Email sent successfully!</div>
            )}
        </div>
    )
}
