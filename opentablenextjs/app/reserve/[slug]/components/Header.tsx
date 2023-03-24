import { format } from 'date-fns';
import Image from 'next/image';
import { convertToDisplayTime, Time } from '../../../../utils/convertToDisplayTime';


export default function Header({ image, name, date, partySize }: { image: string, name: string, date: string, partySize: string }) {
    const [day, time] = date.split('T');
    return (
        <div>
            <h3 className="font-bold">You're almost done!</h3>
            <div className="mt-5 flex">
                <Image
                    src={image}
                    alt=""
                    width={128}
                    height={74}
                    className="w-32 h-18 rounded"
                />
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">
                        {name}
                    </h1>
                    <div className="flex mt-3">
                        <p className="mr-6">{format(new Date(date), "ccc, LLL, d")}</p>
                        <p className="mr-6">{convertToDisplayTime(time as Time)}</p>
                        <p className="mr-6">{partySize} {(parseInt(partySize) > 1) ? "Person" : "People"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
