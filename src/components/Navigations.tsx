import {
  Box,
  Container,
  Flex,
  Avatar,
  Text,
  Button,
  DropdownMenu,
  Popover,
  Slider,
} from "@radix-ui/themes";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  getLastSelectedOrganization,
  getOrganization,
  getUser,
  saveUserOrganization,
} from "../db";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";
import {
  IoIosAdd,
  IoIosArrowRoundBack,
  IoIosMenu,
  IoIosSave,
} from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { PiPencilSimpleLight } from "react-icons/pi";
import {
  setEditMode,
  setSelectFromHistory,
  setTimetravelIndex,
  setToggleToSave,
} from "../context/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../context/store";
import { BsSave } from "react-icons/bs";
import { Spinner } from "../assets/Spinner";

const Navigations = () => {
  const { handleLogOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useContext(AuthContext);
  const params = useParams();
  const { editMode, unsaved, history, timetravelIndex, selectFromHistory } =
    useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const add = () => {
    if (location.pathname == "/create-organization") {
      saveUserOrganization();
      return;
    }
    if (location.pathname == "/dashboard") {
      navigate("/create-organization");
    }
    if (params.id) {
      navigate(location.pathname + "/page/new-page");
    }
  };
  const edit = () => {
    dispatch(setEditMode(!editMode));
  };
  const save = () => {
    dispatch(setEditMode(false));
    dispatch(setToggleToSave());
  };
  const back = () => {
    if (params.pageid) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };
  const findClosestIndex = (val: number, arr: string[]) =>
    arr.reduce(
      (ci, v, i) =>
        Math.abs(i - (val / 100) * (arr.length - 1)) <
        Math.abs(ci - (val / 100) * (arr.length - 1))
          ? i
          : ci,
      0
    );
  return (
    <>
      {userId && (
        <Box className="bottom-navigation">
          {params.pageid && (
            <Box
              className={`timetravel-slider ${history.length < 1 && "hidden"}`}
            >
              <Slider
                color="gray"
                value={[timetravelIndex]}
                defaultValue={[100]}
                size={"3"}
                onValueChange={(e) => {
                  dispatch(setTimetravelIndex(findClosestIndex(e[0], history)));
                  dispatch(setSelectFromHistory(true));
                }}
                style={{ width: "100%", height: "10px" }}
              />
            </Box>
          )}

          <Box className="buttons-wrapper">
            <Box
              onClick={back}
              className={`back-button 
              ${Object.keys(params).length != 0 && "show-back-button"}
              ${
                location.pathname == "/create-organization" &&
                "show-back-button"
              }
              
              `}
              style={{ color: "#fff", marginRight: 0 }}
            >
              <IoIosArrowRoundBack />
            </Box>
            {params.pageid ? (
              <Box
                onClick={() => (editMode ? save() : edit())}
                style={{
                  background: unsaved ? "#fff" : "#000",
                  color: unsaved ? "#000" : "#fff",
                  paddingInline: "22px",
                  marginRight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* {JSON.stringify(editMode)}
                {JSON.stringify(unsaved)} */}
                {editMode === false && unsaved === true && <Spinner />}
                {editMode === true && <BsSave size={23} />}
                {editMode === false && unsaved === false && (
                  <GoPencil size={23} />
                )}
              </Box>
            ) : (
              <Box onClick={add} style={{ background: "#fff", marginRight: 0 }}>
                <IoIosAdd />
              </Box>
            )}

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Box style={{ color: "#fff" }}>
                  <IoIosMenu />
                </Box>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                <DropdownMenu.Item>About Deckhouse</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Export</DropdownMenu.Item>
                <DropdownMenu.Item>Archive</DropdownMenu.Item>
                <DropdownMenu.Item>Trash</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    Your Account
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <DropdownMenu.Item>Account Settings</DropdownMenu.Item>
                    <DropdownMenu.Item>Logout</DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <DropdownMenu.Item asChild>
                  <Link
                    to={`dashboard/org/${params.id}/settings#people-settings`}
                    relative="path"
                  >
                    Share this organization
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>Indeces</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Box>
        </Box>
      )}
    </>
  );
};
export default Navigations;
