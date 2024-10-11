"use client";

import Navbar from "@/app/components/navbar/Navbar";
import Protected from "@/app/components/guards/Protected";
import Head from "@/app/components/Head";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabItems } from "@/app/constants/profileTabItems";
import { RootState } from "@/redux/store";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Protected>
      <Head
        title={`${user?.name} | coursecn`}
        description="web desciption"
        keywords="some key"
      />
      <Navbar />
      <div className="flex justify-center">
        <div className={clsx("fixed top-20 my-20 h-96 w-full max-w-[85%]")}>
          <Tabs
            defaultValue="my-account"
            className="flex h-full flex-col justify-between gap-4 lg:flex-row"
          >
            <div className="overflow-auto rounded-lg">
              <TabsList className="flex h-fit w-fit min-w-[320px] justify-start border-border bg-transparent bg-opacity-60 lg:flex-col">
                {profileTabItems.map(({ icon: Icon, label, value }) => {
                  return (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="w-fit gap-1 py-2.5 text-base data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-900 lg:w-full lg:justify-start"
                    >
                      <Icon size={20} className="hidden lg:block" />
                      {label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className="flex-1 rounded-lg border border-border">
              <TabsContent value="my-account">my-account</TabsContent>
              <TabsContent value="change-password">change-password</TabsContent>
              <TabsContent value="enrolled-courses">
                enrolled-courses
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="h-[10000px]"></div>
      </div>
    </Protected>
  );
};

export default Profile;
