import { Cuisine, Location, PRICE, Review } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'
import Price from '../../components/Price';
import { calculateReview } from '../../../utils/calculateReview';

interface RestaurantType {
    id: number;
    name: string;
    main_image: string;
    price: PRICE;
    cuisine: Cuisine;
    location: Location;
    slug: string;
    reviews: Review[];
}
export default function RestaurantCard({ restaurant }: { restaurant: RestaurantType }) {
    //176X144

    const renderRatingText = () => {
        const rating = calculateReview(restaurant.reviews);
        if (rating > 4) return "Awesome";
        else if (rating <= 4 && rating > 3) return "Good";
        else if (rating <= 3 && rating > 0) return "Average";
        else return "";
    }

    return (
        <div className="border-b flex pb-5 ml-4">
            <Image
                src={restaurant.main_image}
                alt=""
                width="176"
                height="144"
                className="w-44 h-36 rounded"
            />
            <div className="pl-5">
                <h2 className="text-3xl">{restaurant.name}</h2>
                <div className="flex items-start">
                    <div className="flex mb-2">*****</div>
                    <p className="ml-2 text-sm">{renderRatingText()}</p>
                </div>
                <div className="mb-9">
                    <div className="font-light flex text-reg">
                        <Price price={restaurant.price} />
                        <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
                        <p className="mr-4 capitalize">{restaurant.location.name}</p>
                    </div>
                </div>
                <div className="text-red-600">
                    <Link href={`/restaurant/${restaurant.slug}`}>View more information</Link>
                </div>
            </div>
        </div>
    )
}
