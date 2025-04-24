"use client";

import Banner from "@/components/Banner";
import BaseCard from "@/components/base/BaseCard";
import CustomPagination from "@/components/CustomPagination";
import BaseLayout from "@/components/layouts/BaseLayout";
import BaseList from "@/components/ShowLists";
import { getTemplateList } from "@/http/template";
import { CreateWorkResponse } from "@/http/types/work";
import { useWorkStore } from "@/stores/work";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Main() {
  const t = useTranslations();
  const { setWork } = useWorkStore();
  const [workList, setWorkList] = useState<CreateWorkResponse[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [totalPage, setTotalPage] = useState(0);
  const [title, setTitle] = useState("");

  const router = useRouter();

  const getList = async (pageIndex: number, pageSize: number, title?: string) => {
    try {
      const res = await getTemplateList({ pageIndex, pageSize, title });
      setWorkList(res.data.data?.list || []);
      setPageIndex(pageIndex);
      setPageSize(pageSize);
      setTotalPage(Math.ceil(res.data.data?.count / pageSize));
    } catch (error) {
      console.log("getTemplateList Error:", error);
    }
  };

  useEffect(() => {
    getList(1, pageSize, title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const renderPoster = (item: any) => {
    router.push("/editor");
    setWork(item.workId);
  };

  return (
    <BaseLayout>
      <Banner
        src="/images/banner-01.jpg"
        className="h-[45vh] bg-sky-500/20 rounded-lg text-center text-white font-bold text-4xl overflow-hidden"
        title={t("templates")}
      />
      <BaseList
        title="Template Market 🛒"
        onSearch={(e: any) => setTitle(e)}
      >
        {workList.map((item) => (
          <BaseCard
            workId={item.workId}
            key={item.workId}
            title={item.title}
            description={item.desc}
            imgUrl="https://cimg.co/news/100430/248406/polina-kondrashova-fhrwah2hmnm-unsplash.jpg"
            onClick={() => renderPoster(item)}
          />
        ))}
      </BaseList>
      <CustomPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        title={title}
        totalPage={totalPage}
        getList={getList}
      />
    </BaseLayout>
  );
}

export default Main;
