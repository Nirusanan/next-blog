import Post from '@/components/Post';

export async function generateMetadata({ params }) {
    const id = params.id;

    const post = await fetch(process.env.NEXT_PUBLIC_API_URL + `/post/${params.id}`)
    .then((res) => res.json())

    return {
        title: post.title
    }
}


export default async function page({ params }) {
    return <Post params={params}/>
}
