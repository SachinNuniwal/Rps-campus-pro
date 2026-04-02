export default function Header() {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">Student Dashboard</h1>

            <div className="space-x-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">
                    Refresh
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
}