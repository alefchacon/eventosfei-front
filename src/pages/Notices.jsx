import { useState, useEffect, useRef } from "react";

import Card from "../components/CardEvent.jsx";
import CardNotice from "../components/CardNotice.jsx";
import CardReservation from "../components/CardReservation.jsx";
import { Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useIsLoading } from "../providers/LoadingProvider.jsx";

import { useNotices } from "../providers/NoticeProvider.jsx";

export default function Notices(
  {
    notifications,
    handleGet,
    showFilters = true,
    showButtons = true,
    isStaff = false,
  },
  { setSelectedFEIEvent }
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [notices, setNotices] = useState([]);
  const [idUsuario, setIdUsuario] = useState(1);
  const { isLoading } = useIsLoading();
  useEffect(() => {
    fetchData();
  }, []);

  const { getNotices } = useNotices();

  useEffect(() => {
    if (!isStaff) {
      //removeNotices(notices);
    }
  }, [notices]);

  const handlePageChange = async (event, newPage) => {
    setCurrentPage((prev) => (prev = newPage));
    fetchData(newPage);
  };

  useEffect(() => {}, [currentPage]);

  const fetchData = async (page = 1) => {
    //debugger;;
    const pagedNotices = await getNotices(page);

    setCurrentPage(pagedNotices?.meta.current_page);
    setTotalPages(pagedNotices.meta.total_pages ?? pagedNotices.meta.last_page);
    setNotices(pagedNotices.data);
  };

  const removeNotice = async (notice) => {
    await removeNotices([notice]);
  };

  return (
    <>
      <Stack spacing={1} direction={"column"}>
        {notices.map((item, index) =>
          item.idEvento ? (
            <CardNotice
              key={index}
              item={item}
              adminView={idUsuario === 0}
              isStaff={isStaff}
            >
              <Card props={item.event} padding={0} elevated={false}></Card>
            </CardNotice>
          ) : (
            <CardNotice
              type="reservation"
              key={index}
              event={false}
              item={item}
              isStaff={isStaff}
            >
              <CardReservation
                elevated={false}
                item={item.reservation}
                adminView={isStaff}
              ></CardReservation>
            </CardNotice>
          )
        )}
      </Stack>
      <br />
      {!isLoading && (
        <Stack
          spacing={0}
          paddingTop={0}
          paddingBottom={15}
          display={"flex"}
          alignItems={"center"}
        >
          <Pagination
            count={totalPages}
            onChange={handlePageChange}
            color="primary"
            size="large"
            page={currentPage}
          />
        </Stack>
      )}
    </>
  );
}
