import React, { useState } from "react";
import rArrow from "../Images/TabRArrow.svg";
import lArrow from "../Images/TabLArrow.svg";
import trxUserBg from "../Images/TrxUser.svg";
import airtime from "../Images/Airtime.svg";
import bundle from "../Images/Bundle.svg";
import cable from "../Images/BiyaToBiya.svg";
import trxUser from "../Images/trxxUser.png";
// import sporty from "../Images/Sporty.svg";
// import sportyIcon from "../Images/sportyIcon.png";
// import spotify from "../Images/Spotify.svg";
import spotifyIcon from "../Images/spotifyIcon.png";
import { useAppSelector } from "../Store/store";

export const SmallTable = () => {
  const { transactions } = useAppSelector((state) => state.user);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [data, setdata] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Always display 5 rows per page
  const rowsPerPage = 5;
  const totalPages = Math.ceil(transactions?.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate the indexes for the current page
  const indexOfFirstItem = (currentPage - 1) * rowsPerPage;
  const indexOfLastItem = Math.min(
    currentPage * rowsPerPage,
    transactions?.length
  );

  // console.log("i: ", indexOfFirstItem, ", z: ", indexOfLastItem);

  function formatDate(inputDate: string) {
    const dateObject = new Date(inputDate);

    // const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${MonthString(parseInt(month))} ${day}`;
  }

  function formatTime(inputDate: string) {
    const date = new Date(inputDate);

    const hours = date.getUTCHours(); // Get hours (0-23)
    const minutes = date.getUTCMinutes(); // Get minutes (0-59)
    // const seconds = date.getUTCSeconds(); // Get seconds (0-59)

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${hours < 12 ? "AM" : "PM"}`;
    return formattedTime;
  }

  function MonthString(month: number) {
    switch (month) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "Invalid Month";
    }
  }

  return (
    <div className=" overflow-x-auto overflow-y-auto w-screen h-fit min-h-[360px] relative mt-[25px] pb-[11vh]">
      {transactions?.length > 0 ? (
        <table className="min-w-[100vw] w-fit border-collapse">
          <thead className="head">
            {/* <tr>
            <th>Doctor name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
          </tr> */}
          </thead>
          <tbody>
            {transactions && (
              <>
                {transactions
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((trx: any, index: number) => (
                    <tr key={index}>
                      <td className=" text-tabCol1 text-sm not-italic font-[600] leading-[22px] w-[10%] py-[5px] px-[15px]">
                        <div
                          className="rounded-[55px] w-[55px] h-[55px] flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: `url(${trxUserBg}), lightgray 50% / cover no-repeat`,
                          }}
                        >
                          <img
                            src={
                              trx?.Type === "Airtime"
                                ? airtime
                                : trx?.Type === "Bundle"
                                ? bundle
                                : trx?.Type === "Cable"
                                ? cable
                                : trx?.Type === "BiyaTransfer"
                                ? trxUser
                                : spotifyIcon
                            }
                            alt="trxUser"
                          />
                        </div>
                      </td>

                      <td className=" text-tabCol1 text-[15px] not-italic font-[400] leading-normal w-[40%]">
                        <div>From: {trx?.FromUser.slice(0, 10)}</div>
                        <div className=" text-lightBlack text-xs not-italic font-[600] leading-normal">{`${formatDate(
                          trx?.UpdatedAt
                        )} . ${formatTime(trx?.UpdatedAt)}`}</div>
                      </td>
                      <td
                        className="text-right pr-[20px] text-sm not-italic font-[500] leading-normal w-[40%]"
                        style={{
                          color: trx?.Type === "BiyaTransfer" ? "green" : "red",
                        }}
                      >{`₦${trx?.Amount}`}</td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      ) : (
        <div className="h-[200px] flex items-center justify-center">
          No transactions to show
        </div>
      )}

      <div className="absolute bottom-4 right-0 flex text-biyaLightBlue py-[10px] px-[20px] text-right w-fit">
        <img
          className=""
          src={lArrow}
          alt="tabLArrow"
          onClick={() => handlePageChange(currentPage - 1)}
        />
        <span className="mx-3">{`${
          indexOfFirstItem + 1
        } - ${indexOfLastItem} of ${transactions?.length}`}</span>
        <img
          className=""
          src={rArrow}
          alt="tabRArrow"
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
};

export default SmallTable;
