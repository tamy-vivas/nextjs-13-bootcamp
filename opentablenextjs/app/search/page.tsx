import { Cuisine, PRICE, PrismaClient, Location } from '@prisma/client';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import SearchSideBar from './components/SearchSideBar';


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

const fetchLocations = async () => {
    return prisma.location.findMany();
}

const fetchCuisines = async () => {
    return prisma.cuisine.findMany();

}
export default async function SearchPage({ searchParams }: { searchParams: { city: string, cuisine: string, price: PRICE } }) {
    const restaurants = await fetchRestaurantByCity(searchParams.city);
    const locations = await fetchLocations();
    const cuisines = await fetchCuisines();
    return (
        <>
            <Header />
            <div className="flex py-4 m-auto w-2/3 justify-between items-start">
                <SearchSideBar locations={locations} cuisines={cuisines} searchParams={searchParams} />
                <div className="w-5/6">
                    {restaurants.length ?
                        <>
                            {
                                restaurants.map(restaurant =>
                                    (<RestaurantCard key={restaurant.id} restaurant={restaurant} />)
                                )
                            }
                        </> : <p>Sorry, we found no restaurants in this area</p>}
                </div>
            </div>
        </>


    )
}
