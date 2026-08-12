import type { Metadata } from "next"
import type { ReactNode } from "react"
import { CopyButton } from "@/components/vhk/CopyButton"
import { getSiteUrl } from "@/lib/siteUrl"
import styles from "./lunaMaxGuide.module.css"

const BASE_URL = getSiteUrl()
const GUIDE_URL = `${BASE_URL}/guides/luna-max`
const BUN_CHECK = "bun --version"
const BUN_INSTALL = 'powershell -c "irm bun.sh/install.ps1|iex"'
const PLUGIN_INSTALL = [
  "codex plugin marketplace add DannyMac180/sol-advisor --ref main",
  "codex plugin add sol-advisor@sol-advisor",
].join("\n")
const PLUGIN_CHECK = "codex plugin list"
const SETUP_PROMPT = [
  "Use $sol-advisor:setup to configure this Codex project. Ask one question at a time.",
  "I plan to use only the Luna task lane, so save preferences without installing native adapter files.",
].join("\n")
const LUNA_PROMPT = [
  "작업: <여기에 원하는 작업을 적어 주세요>",
  "Use $sol-advisor:orchestration to build and verify this feature. Keep final diff review and acceptance in this primary task.",
  "Use the Luna task lane for this feature.",
].join("\n")

export const metadata: Metadata = {
  title: "Luna · Max 설치 가이드",
  description:
    "Codex에서 Sol Advisor를 설치하고 Luna 작업 경로에 Max 추론을 적용하는 초보자용 단계별 가이드.",
  alternates: { canonical: "/guides/luna-max" },
  openGraph: {
    title: "Luna · Max 설치 가이드",
    description: "Bun 준비부터 Sol Advisor 설치, Luna 작업 요청문까지 한 번에 확인하세요.",
    url: "/guides/luna-max",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna · Max 설치 가이드",
    description: "Sol Advisor 설치 명령어와 Luna 작업 요청문을 그대로 복사하세요.",
  },
}

const HOW_TO_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Codex에서 Sol Advisor로 Luna · Max 작업을 사용하는 방법",
  description: "Bun을 준비하고 Sol Advisor를 설치한 뒤 Luna 작업 경로를 명시적으로 요청합니다.",
  url: GUIDE_URL,
  inLanguage: "ko-KR",
  step: [
    { "@type": "HowToStep", position: 1, name: "Bun 확인", text: "bun --version으로 런타임 설치 여부를 확인합니다." },
    { "@type": "HowToStep", position: 2, name: "Sol Advisor 설치", text: "Codex 플러그인 마켓플레이스를 추가하고 Sol Advisor를 설치합니다." },
    { "@type": "HowToStep", position: 3, name: "첫 설정 완료", text: "새 Codex 작업에서 orchestration 스킬을 실행하고 설정 인터뷰를 완료합니다." },
    { "@type": "HowToStep", position: 4, name: "Luna 작업 요청", text: "현재 요청에 Luna task lane 승인 문장을 포함합니다." },
  ],
}

type CommandBlockProps = {
  command: string
  label: string
}

function CommandBlock({ command, label }: CommandBlockProps) {
  return (
    <div className={styles.commandBlock}>
      <div className={styles.commandTopline}>
        <span>복사해서 붙여넣기</span>
        <CopyButton
          text={command}
          label="명령 복사"
          ariaLabel={`${label} 복사`}
          style={{ minHeight: "44px", fontSize: "13px", padding: "10px 14px" }}
        />
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>{command}</code>
      </pre>
    </div>
  )
}

type StepProps = {
  number: string
  eyebrow: string
  title: string
  children: ReactNode
}

function GuideStep({ number, eyebrow, title, children }: StepProps) {
  return (
    <section className={styles.step} aria-labelledby={`step-${number}`}>
      <div className={styles.stepMarker} aria-hidden="true">
        {number}
      </div>
      <div className={styles.stepBody}>
        <p className={styles.stepEyebrow}>{eyebrow}</p>
        <h2 id={`step-${number}`}>{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function LunaMaxGuidePage() {
  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_LD) }}
      />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>YOHAN STUDIO GUIDE · 2026.08.12 기준</p>
          <h1>
            Luna에 <span>Max 추론</span>을
            <br />연결하는 설치 가이드
          </h1>
          <p className={styles.heroLead}>
            설치 명령어부터 실제 요청문까지 순서대로 정리했습니다. 처음 사용하셔도 아래 네 단계만 따라가시면 됩니다.
          </p>
          <div className={styles.termRow} aria-label="핵심 용어">
            <span><b>Luna</b> 모델</span>
            <span><b>Max</b> 추론 강도</span>
            <span><b>Sol</b> 설계·검토</span>
          </div>
        </div>

        <div className={styles.orbit} aria-hidden="true">
          <div className={`${styles.ring} ${styles.ringOuter}`}>
            <i className={styles.nodeOuter} />
          </div>
          <div className={`${styles.ring} ${styles.ringInner}`}>
            <i className={styles.nodeInner} />
          </div>
          <div className={styles.moon}>LUNA</div>
          <div className={styles.maxBadge}>MAX</div>
        </div>
      </header>

      <div className={styles.notice} role="note">
        <strong>먼저 알아두세요.</strong>
        <p>
          Sol Advisor는 OpenAI 공식 기능이 아닌 커뮤니티 플러그인입니다. 이 가이드는 Codex 데스크톱 앱의 Luna 작업 경로를 기준으로 합니다.
        </p>
      </div>

      <div className={styles.contentShell}>
        <nav className={styles.guideNav} aria-label="설치 순서">
          <p>INSTALL MAP</p>
          <ol>
            <li><a href="#step-01">Bun 확인</a></li>
            <li><a href="#step-02">플러그인 설치</a></li>
            <li><a href="#step-03">첫 설정</a></li>
            <li><a href="#step-04">Luna 요청</a></li>
          </ol>
        </nav>

        <div className={styles.steps}>
          <GuideStep number="01" eyebrow="RUNTIME" title="Bun이 설치되어 있는지 확인해 주세요">
            <p className={styles.bodyText}>
              Sol Advisor의 MCP 서버를 실행하려면 Bun이 필요합니다. PowerShell에서 먼저 버전을 확인해 주세요.
            </p>
            <CommandBlock command={BUN_CHECK} label="Bun 버전 확인 명령" />
            <div className={styles.subCard}>
              <div>
                <strong>명령어를 찾을 수 없다고 나오나요?</strong>
                <p>아래 공식 Windows 설치 명령을 실행한 뒤, 터미널과 Codex 앱을 완전히 닫았다가 다시 열어 주세요.</p>
              </div>
              <CommandBlock command={BUN_INSTALL} label="Windows용 Bun 설치 명령" />
              <a
                className={styles.textLink}
                href="https://bun.sh/docs/installation"
                target="_blank"
                rel="noreferrer noopener"
              >
                Bun 공식 설치 문서 ↗
              </a>
            </div>
          </GuideStep>

          <GuideStep number="02" eyebrow="PLUGIN" title="Sol Advisor를 Codex에 설치해 주세요">
            <p className={styles.bodyText}>
              아래 두 줄을 PowerShell에 붙여넣으면 마켓플레이스 등록과 플러그인 설치가 차례로 진행됩니다.
            </p>
            <CommandBlock command={PLUGIN_INSTALL} label="Sol Advisor 설치 명령" />
            <p className={styles.checkLine}>
              설치 뒤 <code>{PLUGIN_CHECK}</code>를 실행해 목록에 <code>sol-advisor</code>가 보이는지 확인해 주세요.
            </p>
            <div className={styles.skipCard}>
              <span>이번 가이드에서는 실행하지 않습니다</span>
              <strong>install-agents.sh</strong>
              <p>Luna 작업 경로는 Codex 앱 작업을 사용하므로, Luna만 사용하신다면 별도 에이전트 설치 스크립트가 필요하지 않습니다.</p>
            </div>
          </GuideStep>

          <GuideStep number="03" eyebrow="FIRST USE" title="새 작업에서 첫 설정을 완료해 주세요">
            <p className={styles.bodyText}>
              플러그인을 설치한 뒤 새 Codex 작업을 열어 orchestration을 요청해 주세요. 처음에는 설정 인터뷰가 먼저 시작될 수 있습니다.
            </p>
            <CommandBlock command={SETUP_PROMPT} label="Sol Advisor 첫 설정 요청문" />
            <ol className={styles.checklist}>
              <li>클라이언트는 <b>Codex</b>를 선택합니다.</li>
              <li>프로젝트 범위와 실제 작업 폴더를 지정합니다.</li>
              <li>모델 선택기 또는 <code>/model</code>에 표시되는 정확한 모델 ID를 확인합니다.</li>
              <li>읽기 전용 요청과 자동 대체 금지 설정을 확인합니다.</li>
              <li>전체 설정값을 검토한 뒤 저장을 승인합니다.</li>
            </ol>
            <div className={styles.nativeCard}>
              <span>Native 경로도 사용하실 때만</span>
              <p>어댑터 미리보기와 정확한 설치 토큰을 검토해 역할 파일을 설치하고, 그 뒤 새 작업을 열거나 Codex를 다시 불러옵니다. Luna 전용 사용자는 이 단계를 건너뜁니다.</p>
            </div>
            <p className={styles.detailText}>
              Native 기본 권장값은 Terra / High 구현과 Sol / High 검토입니다. Luna / Max는 이 설정을 자동으로 대체하는 값이 아니라, 다음 단계에서 별도로 승인하는 앱 작업 경로입니다.
            </p>
          </GuideStep>

          <GuideStep number="04" eyebrow="LUNA · MAX" title="현재 요청에 Luna 작업 승인을 붙여 주세요">
            <p className={styles.bodyText}>
              실제로 맡길 작업과 아래 두 문장을 같은 요청에 넣어 주세요. 마지막 문장이 있어야 Luna / Max 작업 경로가 활성화됩니다.
            </p>
            <CommandBlock command={LUNA_PROMPT} label="Luna Max 작업 요청문" />
            <div className={styles.repeatNote}>
              <span aria-hidden="true">●</span>
              <p><strong>요청할 때마다 다시 입력해야 합니다.</strong> 이전 요청의 승인은 다음 요청으로 이어지지 않습니다.</p>
            </div>
          </GuideStep>
        </div>
      </div>

      <section className={styles.troubleshooting} aria-labelledby="troubleshooting-title">
        <div className={styles.sectionHeading}>
          <p>TROUBLESHOOTING</p>
          <h2 id="troubleshooting-title">여기서 막히면 확인해 주세요</h2>
        </div>
        <div className={styles.issueGrid}>
          <div>
            <span>01</span>
            <h3><code>bun</code>을 찾지 못합니다</h3>
            <p>설치 뒤 기존 터미널을 계속 사용하면 PATH가 반영되지 않을 수 있습니다. 터미널과 Codex를 완전히 다시 열고 확인해 주세요.</p>
          </div>
          <div>
            <span>02</span>
            <h3>플러그인이 보이지 않습니다</h3>
            <p><code>{PLUGIN_CHECK}</code>로 목록을 확인한 뒤, 설치 명령 두 줄이 모두 성공했는지 다시 확인해 주세요.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Luna 작업이 만들어지지 않습니다</h3>
            <p>현재 요청에 승인 문장이 있는지, Codex 앱에서 Luna·Max와 필요한 작업 도구를 사용할 수 있는지 확인해 주세요.</p>
          </div>
          <div>
            <span>04</span>
            <h3>VS Code에서 Max가 보이지 않습니다</h3>
            <p>VS Code 어댑터는 모델만 저장하며 추론 강도는 세션 제약입니다. 이 페이지의 Luna 경로는 Codex 데스크톱 앱 작업 도구를 기준으로 합니다.</p>
          </div>
        </div>
      </section>

      <footer className={styles.guideFooter}>
        <div>
          <p>검증 기준</p>
          <strong>Sol Advisor v0.5.0 · Codex CLI 0.147.0</strong>
          <span>2026년 8월 12일 확인 · 버전 변경 시 원본 저장소를 우선해 주세요.</span>
        </div>
        <a
          href="https://github.com/DannyMac180/sol-advisor"
          target="_blank"
          rel="noreferrer noopener"
        >
          원본 저장소에서 최신 내용 확인 ↗
        </a>
      </footer>
    </article>
  )
}
