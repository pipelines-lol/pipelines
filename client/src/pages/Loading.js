import { Triangle } from 'react-loader-spinner'
function Loading() {
    return (
        <>
            <div className="flex h-[90vh] w-full items-center justify-center pt-20">
                <Triangle
                    visible={true}
                    height="200"
                    width="200"
                    color="#0265AC"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        </>
    )
}

export default Loading
