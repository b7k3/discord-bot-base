
export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/api/v1',
            permanent: true,  
        },
    };
}

export default function HomePage() {
    return null;  
}
