import type { Metadata } from "next"

import { About } from "@/components/sections/About"
import { Contact } from "@/components/sections/Contact"
import { Faq } from "@/components/sections/Faq"
import { Featured } from "@/components/sections/Featured"
import { Hero } from "@/components/sections/Hero"
import { NowFeed } from "@/components/sections/NowFeed"
import { Philosophy } from "@/components/sections/Philosophy"
import { ProblemSection } from "@/components/sections/ProblemSection"
import { ScanIntro } from "@/components/sections/ScanIntro"
import { ServicesPreview } from "@/components/sections/ServicesPreview"
import { ShowroomPreview } from "@/components/sections/ShowroomPreview"

// 홈은 자체 canonical을 선언한다. 루트 layout의 canonical에 기대면
// 하위 라우트가 그 값을 상속해 홈을 자기 정규 URL로 내보내기 때문.
// RSS alternate는 루트 layout의 alternates가 통째로 덮어써지므로 여기서 다시 명시한다.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
}

// Featured가 studio_products를 조회하므로 스토어와 동일한 주기로 재생성
export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <ProblemSection />
      <ShowroomPreview />
      <Featured />
      <NowFeed />
      <ScanIntro />
      <ServicesPreview />
      <About />
      <Faq />
      <Contact />
    </>
  )
}
