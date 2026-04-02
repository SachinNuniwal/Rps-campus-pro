export default function Sidebar({ student }) {
    return (
        <div className="w-64 bg-gray-900 text-white hidden md:block">
            <div className="p-5 text-center border-b border-gray-700">
                <img
                    src="https://i.pravatar.cc/100"
                    className="w-16 h-16 rounded-full mx-auto"
                />
                <h3 className="mt-2 font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-400">{student.email}</p>
            </div>

            <ul className="p-4 space-y-2">
                {[
                    "Dashboard",
                    "Attendance",
                    "Marks",
                    "Achievements",
                    "My Groups",
                    "Notifications",
                    "Settings",
                ].map((item) => (
                    <li
                        key={item}
                        className="p-2 rounded hover:bg-gray-700 cursor-pointer"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}