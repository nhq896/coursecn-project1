"use client";

import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";

type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = (props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Trang quản lý - coursecn"
          description="web description"
          keywords="coursecn"
        />
        <div className="flex min-h-screen">
          <div className="w-1/5 1500px:w-[16%]">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default AdminPage;
