import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";

register("vi", vi);

type Props = {
  isTeam?: boolean;
};

const AllCourses: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] = useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("Cập nhật quyền người dùng thành công!");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Xóa người dùng thành công!");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [updateError, isSuccess, deleteSuccess, deleteError]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Tên người dùng", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Quyền", flex: 0.5 },
    { field: "courses", headerName: "Khóa học đã tham gia", flex: 0.5 },
    { field: "created_at", headerName: "Ngày tham gia", flex: 0.5 },
    {
      field: " ",
      headerName: "Xóa",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setUserId(params.row.id);
              }}
            >
              <AiOutlineDelete className="text-black dark:text-white" size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "  ",
      headerName: "Gửi email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <a href={`mailto:${params.row.email}`}>
                <AiOutlineMail className="text-black dark:text-white" size={20} />
              </a>
            </Button>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const newData = data && data.users.filter((item: any) => item.role === "admin");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt, "vi"),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt, "vi"),
        });
      });
  }

  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          {isTeam && (
            <div className="flex w-full justify-end">
              <div
                className={`${styles.button} !w-fit dark:border dark:border-[#ffffff6c] dark:bg-[#57c7a3]`}
                onClick={() => setActive(!active)}
              >
                Cấp quyền người dùng
              </div>
            </div>
          )}
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              // "& .MuiDataGrid-sortIcon": {
              //   color: theme === "dark" ? "#fff" : "#000",
              // },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              // "& .MuiDataGrid-columnHeaders": {
              //   backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              //   borderBottom: "none",
              //   color: theme === "dark" ? "#fff" : "#000",
              // },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color: theme === "dark" ? `#b7ebde !important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
            }}
          >
            <DataGrid pageSizeOptions={[12]} checkboxSelection rows={rows} columns={columns} />
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute left-[50%] top-[50%] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow outline-none dark:bg-slate-900">
                <h1 className={`${styles.title}`}>Cấp quyền người dùng</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} !mt-6`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <br />
                  <div className={`${styles.button} my-6`} onClick={handleSubmit}>
                    Xác nhận
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute left-[50%] top-[50%] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow outline-none dark:bg-slate-900">
                <h1 className={`${styles.title}`}>Bạn có chắc chắn muốn xóa?</h1>
                <div className="mb-6 mt-4 flex w-full items-center justify-center gap-4">
                  <div
                    className={`${styles.button} border bg-white text-black`}
                    onClick={() => setOpen(!open)}
                  >
                    Hủy
                  </div>
                  <div className={`${styles.button} bg-[#d63f3f]`} onClick={handleDelete}>
                    Chắc chắn
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
