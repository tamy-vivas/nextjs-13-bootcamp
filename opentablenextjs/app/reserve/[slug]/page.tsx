import Form from "./components/Form";
import Header from "./components/Header";
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient;
const fetchRestaurantBySlub = async (slug: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: {
            slug
        }
    })

    if (!restaurant) {
        return notFound()
    }
    return restaurant;
}
interface Props { params: { slug: string }, searchParams: { date: string, partySize: string } }

export default async function ReservePage({ params, searchParams }: Props) {
    const { date, partySize } = searchParams;
    const restaurant = await fetchRestaurantBySlub(params.slug);

    return (

        <div className="border-t h-screen">
            <div className="py-9 w-3/5 m-auto">
                <Header image={restaurant.main_image} name={restaurant.name} date={date} partySize={partySize} />
                <Form partySize={searchParams.partySize}
                    slug={params.slug}
                    date={searchParams.date} />
            </div>
        </div>

    )
}
