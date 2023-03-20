import { Cuisine, PRICE, PrismaClient, Location } from '@prisma/client';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import SearchSideBar from './components/SearchSideBar';

interface SearchParams { city: string, cuisine: string, price: PRICE }

const prisma = new PrismaClient();

const fetchRestaurantByCity = (searchParams: SearchParams) => {
    const { city, cuisine, price } = searchParams;
    const select = {
        id: true,
        name: true,
        main_image: true,
        price: true,
        cuisine: true,
        location: true,
        slug: true,
    }
    const where: any = {};

    if (city) {
        const location = {
            name: {
                equals: city.toLowerCase()
            }
        }
        where.location = location;
    }

    if (cuisine) {
        const data = {
            name: {
                equals: cuisine.toLowerCase()
            }
        }
        where.cuisine = data;
    }

    if (price) {
        const data = {
            equals: price
        }
        where.price = data;
    }

    // If city is empty return all restaurants
    if (!city) return prisma.restaurant.findMany({ select });

    return prisma.restaurant.findMany({
        where,
        select
    });

}

const fetchLocations = async () => {
    return prisma.location.findMany();
}

const fetchCuisines = async () => {
    return prisma.cuisine.findMany();

}
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
    const restaurants = await fetchRestaurantByCity(searchParams);
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
