import Header from "./components/Header";

export default function loading() {
    return (
        <main>
            <Header />
            <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2].map(num => (
                    <div key={num} className="animate-pulse bg-slate-200 m-3 w-64 h-72 rounded overflow-hidden border cursor-pointer">

                    </div>
                ))
                }
            </div>
        </main>
    )
}
