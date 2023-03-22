"use client";
import DatePicker from 'react-datepicker';
import { useState } from 'react';

import { partySize as partySizes, times } from '../../../../data/index';
import useAvailabilities from '../../../../hooks/useAvailabilities';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { convertToDisplayTime } from '../../../../utils/convertToDisplayTime';

export default function ReservationCard({ openTime, closeTime, slug }: { openTime: string, closeTime: string, slug: string; }) {

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const { loading, data, error, fetchAvailabilities } = useAvailabilities();
    const [time, setTime] = useState(openTime);
    const [partySize, setPartySize] = useState('2');
    const [day, setDay] = useState(new Date().toISOString().split('T')[0])

    const handleChangeDate = (date: Date | null) => {
        if (date) {
            const d = date.toISOString().split('T')[0];
            setDay(d);
            return setSelectedDate(date);
        }
        return setSelectedDate(null);
    }

    const filterTimesByRestaurantWindow = () => {
        const timesInWindow: typeof times = [];
        let isWithinWindow = false;

        times.forEach(time => {
            if (time.time === openTime) {
                isWithinWindow = true;
            }

            if (isWithinWindow) {
                timesInWindow.push(time);
            }

            if (time.time === closeTime) {
                isWithinWindow = false;
            }
        });

        return timesInWindow;
    }


    const handleClick = () => {
        fetchAvailabilities({ slug, day, time, partySize })
    }

    return (
        <div className="fixed w-[15%] bg-white rounded p-3 shadow">
            <div className="text-center border-b pb-2 font-bold">
                <h4 className="mr-7 text-lg">Make a Reservation</h4>
            </div>
            <div className="my-3 flex flex-col">
                <label htmlFor="">Party size</label>
                <select name="" className="py-3 border-b font-light" id="" value={partySize} onChange={(e) => setPartySize(e.target.value)}>
                    {partySizes.map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>

                    ))}
                </select>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col w-[48%]">
                    <label htmlFor="">Date</label>
                    <DatePicker
                        className="py-3 border-b font-light text-reg w-24"
                        dateFormat="MMMM d"
                        wrapperClassName="w-[48%]"
                        selected={selectedDate}
                        onChange={handleChangeDate}
                    />
                </div>
                <div className="flex flex-col w-[48%]">
                    <label htmlFor="">Time</label>
                    <select name="" id="" className="py-3 border-b font-light" value={time} onChange={(e) => setTime(e.target.value)}>
                        {filterTimesByRestaurantWindow().map(time => (
                            <option key={time.displayTime} value={time.time}>{time.displayTime}</option>
                        ))}

                        <option value="">9:30 AM</option>
                    </select>
                </div>
            </div>
            <div className="mt-5">
                <button
                    className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
                </button>
            </div>
            {(data && data.length) ? (
                <div className="mt-4">
                    <p className="text-reg">Select a Time</p>
                    <div className="flex flex-wrap mt-2">
                        {data.map((time, index) => {
                            return time.available ?
                                <Link key={index} href={`/reserve/${slug}?data=${day}T${time}&partySize=${partySize}`}
                                    className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3">
                                    <p className="text-sm font-bold">
                                        {convertToDisplayTime(time.time)}
                                    </p>
                                </Link> :
                                <p key={index} className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
