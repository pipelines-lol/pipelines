const mockPipelineData = [
    {
        _id: '1',
        profileId: 'profile1',
        firstName: 'John',
        lastName: 'Doe',
        pfp: 'https://placekitten.com/200/300',
        anonymous: false,
        pipeline: [
            {
                _id: 'exp1',
                company: 'Amazon',
                title: 'Software Engineer',
                date: 'Jan 2022 - Present',
            },
        ],
    },
    {
        _id: '2',
        profileId: 'profile2',
        firstName: 'Jane',
        lastName: 'Smith',
        pfp: 'https://placekitten.com/200/300',
        anonymous: true,
        pipeline: [
            {
                _id: 'exp2',
                company: 'Apple',
                title: 'Product Manager',
                date: 'Mar 2020 - Dec 2021',
            },
        ],
    },
    {
        _id: '3',
        profileId: 'profile3',
        firstName: 'Alice',
        lastName: 'Johnson',
        pfp: 'https://placekitten.com/200/300',
        anonymous: false,
        pipeline: [
            {
                _id: 'exp3',
                company: 'Google',
                title: 'UX Designer',
                date: 'Jul 2019 - Feb 2021',
            },
        ],
    },
    {
        id: '4',
        profileId: 'profile4',
        firstName: 'Bob',
        lastName: 'Williams',
        pfp: 'https://placekitten.com/200/300',
        anonymous: true,
        pipeline: [
            {
                _id: 'exp4',
                company: 'Jane Street',
                title: 'Software Engineer',
                date: 'Jan 2018 - Jun 2019',
            },
        ],
    },
]

export default mockPipelineData
