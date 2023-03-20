import { PrismaClient, Review } from "@prisma/client";
import Description from "./components/Description";
import Header from "./components/Header";
import Images from "./components/Images";
import Rating from "./components/Rating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavBar from "./components/RestaurantNavBar";
import Reviews from "./components/Reviews";
import Title from "./components/Title";

/*
*/

interface RestaurantType {
    id: number;
    name: string;
    images: string[];
    description: string;
    slug: string;
    reviews: Review[];
}
const prisma = new PrismaClient();

const fetchRestaurant = async (slug: string): Promise<RestaurantType> => {
    const restaurant = await prisma.restaurant.findUnique({
        where: {
            slug
        },
        select: {
            id: true,
            name: true,
            images: true,
            description: true,
            slug: true,
            reviews: true
        }
    });

    if (!restaurant) {
        throw new Error();
    }

    return restaurant;
}


export default async function RestaurantDetailsPage({
    params,
}: {
    params: { slug: string };
}) {
    const restaurant = await fetchRestaurant(params.slug);
    return (
        <>

            <div className="bg-white w-[70%] rounded p-3 shadow">
                <RestaurantNavBar slug={restaurant.slug} />
                <Title name={restaurant.name} />
                <Rating reviews={restaurant.reviews} />
                <Description description={restaurant.description} />
                <Images images={restaurant.images} />
                <Reviews reviews={restaurant.reviews} />
            </div>
            <div className="w-[27%] relative text-reg">
                <ReservationCard />
            </div>
        </>
    )
}
