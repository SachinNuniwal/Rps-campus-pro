import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Charts from "./components/Charts";
import Toppers from "./components/Toppers";
import Calendar from "./components/Calendar";

const student = {
  name: "Sachin",
  email: "sachin@gmail.com",
  attendance: 78,
  subjects: {
    Math: 80,
    OS: 75,
    DBMS: 85,
    Java: 70,
  },
};

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar student={student} />

      <div className="flex-1 p-4 overflow-y-auto">
        <Header />

        <h2 className="text-2xl font-semibold mt-4">
          Welcome, {student.name} 👋
        </h2>

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4">
            <Charts student={student} />
          </div>

          <div className="space-y-4">
            <Calendar />
            <Toppers />
          </div>
        </div>
      </div>
    </div>
  );
}