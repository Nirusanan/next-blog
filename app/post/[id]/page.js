import Post from '@/components/Post';

async function getData(id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}?_=${Date.now()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const json = await response.json();
    console.log('Fetched data:',json);
    return json;
}


export default async function page({ params }) {
    const post = await getData(params.id);
    console.log(post);
    return <Post post={post}/>
}
