import { useState, useEffect, useRef } from "react";

import Card from "../components/Card.jsx";
import CardNotice from "../components/CardNotice.jsx";
import ReservationCard from "../components/ReservationCard.jsx";
import { Stack } from "@mui/material";
import CircularProgress from "../components/CircularProgress.jsx";
import Pagination from "@mui/material/Pagination";
import { useIsLoading } from "../providers/LoadingProvider.jsx";

import { useNotices } from "../providers/NoticeProvider.jsx";

export default function NoticeList(
  { notifications, handleGet, showFilters = true, showButtons = true },
  { setSelectedFEIEvent }
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [notices, setNotices] = useState([]);
  const [idUsuario, setIdUsuario] = useState(1);
  const { isLoading, setIsLoading } = useIsLoading();
  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  const { getNotices, removeNotices, isStaff } = useNotices();

  useEffect(() => {
    removeNotices(notices);
  }, [notices]);

  const handlePageChange = async (event, newPage) => {
    setCurrentPage((prev) => (prev = newPage));
    fetchData(newPage);
  };

  useEffect(() => {}, [currentPage]);

  const fetchData = async (page = currentPage) => {
    //debugger;

    const response = await getNotices(page);

    setCurrentPage(response.current_page);
    setTotalPages(response.total_pages ?? response.last_page);
    setNotices(response.data);
  };

  return (
    <>
      <Stack spacing={{ md: 1 }} margin={{ md: 1 }} direction={"column"}>
        {notices.map((item, index) =>
          item.event !== null ? (
            <CardNotice
              key={index}
              item={item}
              adminView={idUsuario === 0}
              isStaff={isStaff}
            >
              <Card props={item.event} elevated={false}></Card>
            </CardNotice>
          ) : (
            <CardNotice key={index} event={false} item={item} isStaff={isStaff}>
              <ReservationCard
                elevated={false}
                item={item.reservation}
              ></ReservationCard>
            </CardNotice>
          )
        )}
      </Stack>
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
