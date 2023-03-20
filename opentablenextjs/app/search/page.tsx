import { Cuisine, PRICE, PrismaClient } from '@prisma/client';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import SearchSideBar from './components/SearchSideBar';

interface RestaurantType {
    id: number;
    name: string;
    main_image: string;
    price: PRICE;
    cuisine: Cuisine;
    location: Location;
    slug: string;
}
const prisma = new PrismaClient();

const fetchRestaurantByCity = (city: string | undefined) => {
    const select = {
        id: true,
        name: true,
        main_image: true,
        price: true,
        cuisine: true,
        location: true,
        slug: true,
    }

    // If city is empty return all restaurants
    if (!city) return prisma.restaurant.findMany({ select });

    return prisma.restaurant.findMany({
        where: {
            location: {
                name: {
                    equals: city.toLowerCase()
                }
            }
        },
        select
    });

}

export default async function SearchPage({ searchParams }: { searchParams: { city: string } }) {
    const restaurants = await fetchRestaurantByCity(searchParams.city);

    return (
        <>
            <Header />
            <div className="flex py-4 m-auto w-2/3 justify-between items-start">
                <SearchSideBar />
                <div className="w-5/6">
                    {restaurants.length ? <RestaurantCard /> : <p>Sorry, we found no restaurants in this area</p>}
                </div>
            </div>
        </>


    )
}
