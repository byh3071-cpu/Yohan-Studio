import type { Metadata } from "next"
import Image from "next/image"
import type { ReactNode } from "react"
import { CopyButton } from "@/components/vhk/CopyButton"
import { getSiteUrl } from "@/lib/siteUrl"
import styles from "./lunaMaxGuide.module.css"

const BASE_URL = getSiteUrl()
const GUIDE_URL = `${BASE_URL}/guides/luna-max`
const CODEX_CHECK = "codex --version"
const CODEX_CHECK_WINDOWS_FALLBACK = "codex.cmd --version"
const BUN_CHECK = "bun --version"
const BUN_INSTALL_WINDOWS = 'powershell -c "irm bun.sh/install.ps1|iex"'
const BUN_INSTALL_UNIX = "curl -fsSL https://bun.com/install | bash"
const PLUGIN_INSTALL = [
  "codex plugin marketplace add DannyMac180/sol-advisor --ref main",
  "codex plugin add sol-advisor@sol-advisor",
].join("\n")
const PLUGIN_INSTALL_WINDOWS_FALLBACK = [
  "codex.cmd plugin marketplace add DannyMac180/sol-advisor --ref main",
  "codex.cmd plugin add sol-advisor@sol-advisor",
].join("\n")
const PLUGIN_CHECK = "codex plugin list"
const PLUGIN_CHECK_WINDOWS_FALLBACK = "codex.cmd plugin list"
const SETUP_PROMPT = [
  "Use $sol-advisor:setup in this parent chat for Codex project scope.",
  "Enable the separate Luna / Max app-task lane.",
  "Save logical preferences only; do not render or install native adapters and do not run scripts/install-agents.sh.",
  "Ask me for the exact model IDs shown in /model.",
].join("\n")
const SMOKE_PROMPT = [
  "Use $sol-advisor:orchestration.",
  "Use the Luna task lane for this feature.",
  "Run a read-only smoke task that returns exactly SMOKE_LUNA_MAX_OK.",
  "If Luna / Max, setup, or any required app-task tool is unavailable, do not fall back; report BLOCKED.",
].join("\n")
const LUNA_PROMPT = [
  "작업: <여기에 원하는 작업을 적어 주세요>",
  "Use $sol-advisor:orchestration to build and verify this feature. Keep final diff review and acceptance in this primary task.",
  "Use the Luna task lane for this feature.",
].join("\n")

export const metadata: Metadata = {
  title: "Codex 앱에 Luna · Max를 연결하는 설치 가이드",
  description:
    "Sol Advisor 설치 전 운영체제별 호환성을 확인하고 Codex 데스크톱 앱의 Luna 작업 경로에 Max 추론을 적용하는 단계별 가이드.",
  alternates: { canonical: "/guides/luna-max" },
  openGraph: {
    title: "Codex 앱에 Luna · Max를 연결하는 설치 가이드",
    description: "Windows 공식 v0.5.0의 제한과 운영체제별 Bun 준비, Sol Advisor 설치와 Luna 요청문을 확인하세요.",
    url: "/guides/luna-max",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codex 앱에 Luna · Max를 연결하는 설치 가이드",
    description: "지원 환경을 먼저 확인한 뒤 설치 명령과 Luna 작업 요청문을 복사하세요.",
  },
}

const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Codex 앱에 Luna · Max를 연결하는 설치 가이드",
  description: "Sol Advisor v0.5.0의 Windows 공식판 제한과 운영체제별 설치·검증 절차를 정리합니다.",
  url: GUIDE_URL,
  inLanguage: "ko-KR",
  dateModified: "2026-08-14",
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
          style={{ minHeight: "44px", fontSize: "14px", padding: "10px 14px" }}
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
    <article className={`${styles.page} luna-max-guide-page`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_LD) }}
      />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>YOHAN STUDIO GUIDE · 2026.08.14 기준</p>
          <h1>
            Codex 앱에 <span>Luna · Max를</span>
            <br />연결하는 설치 가이드
          </h1>
          <p className={styles.heroLead}>
            설치 명령과 실제 작동 여부는 다릅니다. 운영체제별 지원 상태를 먼저 확인한 뒤 검증된 환경에서만 진행해 주세요.
          </p>
          <div className={styles.termRow} aria-label="핵심 용어">
            <span><b>Luna</b> 모델</span>
            <span><b>Max</b> 추론 강도</span>
            <span><b>Sol</b> 설계·검토</span>
          </div>
        </div>

        <div className={styles.orbit} aria-hidden="true">
          <Image
            className={styles.orbitArt}
            src="/images/guides/luna-max/max-rings.png"
            alt=""
            fill
            priority
            sizes="(max-width: 840px) 330px, 400px"
          />
          <div className={styles.lunaBadge}>LUNA</div>
          <div className={styles.maxBadge}>MAX</div>
        </div>
      </header>

      <div className={styles.notice} role="note">
        <strong>Windows 공식판은 현재 중단해 주세요.</strong>
        <p>
          공식 v0.5.0은 Windows에서 <code>PLUGIN_DATA</code> 권한을 POSIX 방식으로 검사해 설정 MCP가 차단됩니다. PR #22 기반 로컬 수정본은 설정 저장과 검증을 통과했지만 공식 배포본이 아니며, 현재 Codex 호스트에는 필수 <code>wait_threads</code> 도구도 없습니다. maintainer가 수정본을 확정하고 Luna · Max 전체 경로가 통과하기 전에는 정상 지원으로 안내하지 않습니다.
        </p>
      </div>

      <section className={styles.environment} aria-labelledby="environment-title">
        <div className={styles.sectionHeading}>
          <p>CHOOSE YOUR PATH</p>
          <h2 id="environment-title">먼저 사용 환경을 확인해 주세요</h2>
          <p className={styles.sectionLead}>
            플러그인을 설치하는 장소와 Luna를 실행하는 장소가 다릅니다. 같은 명령을 모든 앱에 적용하면 동작하지 않습니다.
          </p>
        </div>

        <div className={styles.pathFlow} aria-label="설치와 실행 흐름">
          <div>
            <span>설치</span>
            <strong>터미널의 Codex CLI</strong>
            <p>Windows PowerShell 또는 macOS 터미널에서 플러그인 명령을 실행합니다.</p>
          </div>
          <i aria-hidden="true">→</i>
          <div>
            <span>실행</span>
            <strong>Codex 데스크톱 앱</strong>
            <p>새 작업을 열고 현재 요청에 Luna 작업 경로 승인 문장을 넣습니다.</p>
          </div>
        </div>

        <div className={styles.environmentTableWrap} tabIndex={0} aria-label="환경별 지원 범위 표">
          <table className={styles.environmentTable}>
            <thead>
              <tr>
                <th scope="col">사용 환경</th>
                <th scope="col">플러그인 설치</th>
                <th scope="col">Native 경로</th>
                <th scope="col">Luna · Max 경로</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Codex 앱 · Windows</th>
                <td data-label="플러그인 설치">터미널에서 설치</td>
                <td data-label="Native 경로"><span className={styles.unavailable}>공식 v0.5.0 설정 차단</span></td>
                <td data-label="Luna · Max 경로"><span className={styles.unavailable}>필수 도구 5/6</span></td>
              </tr>
              <tr>
                <th scope="row">Codex 앱 · macOS</th>
                <td data-label="플러그인 설치">터미널에서 설치</td>
                <td data-label="Native 경로">원본 절차 제공</td>
                <td data-label="Luna · Max 경로"><span className={styles.unavailable}>Yohan 실기기 미검증</span></td>
              </tr>
              <tr>
                <th scope="row">Codex CLI · Windows</th>
                <td data-label="플러그인 설치">CLI에서 설치</td>
                <td data-label="Native 경로"><span className={styles.unavailable}>v0.5.0 설정 차단</span></td>
                <td data-label="Luna · Max 경로"><span className={styles.unavailable}>앱 작업 경로 아님</span></td>
              </tr>
              <tr>
                <th scope="row">Codex CLI · macOS/Linux</th>
                <td data-label="플러그인 설치">CLI에서 설치</td>
                <td data-label="Native 경로">원본 절차 제공</td>
                <td data-label="Luna · Max 경로"><span className={styles.unavailable}>앱 작업 경로 아님</span></td>
              </tr>
              <tr>
                <th scope="row">Cursor·VS Code·Copilot·Kiro</th>
                <td data-label="플러그인 설치">클라이언트별 별도 절차</td>
                <td data-label="Native 경로">원본의 클라이언트별 제한 확인</td>
                <td data-label="Luna · Max 경로"><span className={styles.unavailable}>지원하지 않음</span></td>
              </tr>
              <tr>
                <th scope="row">웹·모바일</th>
                <td data-label="플러그인 설치">범용 설치 없음</td>
                <td data-label="Native 경로">프롬프트 안내만 가능</td>
                <td data-label="Luna · Max 경로"><span className={styles.unavailable}>지원하지 않음</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.scopeNote}>
          Luna · Max 경로에는 <code>list_projects</code>, <code>list_threads</code>, <code>create_thread</code>, <code>wait_threads</code>, <code>read_thread</code>, <code>send_message_to_thread</code>가 모두 필요합니다. 하나라도 없으면 Sol Advisor는 다른 모델로 대체하지 않고 중단합니다.
        </p>
        <p className={styles.scopeNote}>
          Yohan Studio가 실제로 재현한 환경은 Windows입니다. macOS·Linux 표기는 원본 설치 계약을 반영한 것이며, 이 페이지에서 실기기 전체 경로를 통과했다고 주장하지 않습니다.
        </p>
        <a className={styles.textLink} href="https://github.com/DannyMac180/sol-advisor/issues/20" target="_blank" rel="noreferrer noopener">
          Windows 권한 검사 이슈 #20 확인 ↗
        </a>
        <a className={styles.textLink} href="https://github.com/DannyMac180/sol-advisor/pull/22" target="_blank" rel="noreferrer noopener">
          Windows ACL 수정 PR #22 확인 ↗
        </a>
      </section>

      <div className={styles.contentShell}>
        <nav className={styles.guideNav} aria-label="설치 순서">
          <p>INSTALL MAP</p>
          <ol>
            <li><a href="#step-01">필수 도구 확인</a></li>
            <li><a href="#step-02">플러그인 설치</a></li>
            <li><a href="#step-03">첫 설정</a></li>
            <li><a href="#step-04">호환성 점검</a></li>
            <li><a href="#step-05">Luna 요청</a></li>
          </ol>
        </nav>

        <div className={styles.steps}>
          <GuideStep number="01" eyebrow="PREREQUISITES" title="Codex CLI와 Bun을 확인해 주세요">
            <p className={styles.bodyText}>
              플러그인 명령에는 Codex CLI가, Sol Advisor의 MCP 서버에는 Bun이 필요합니다. 사용하는 터미널에서 두 명령을 차례로 확인해 주세요.
            </p>
            <CommandBlock command={CODEX_CHECK} label="Codex CLI 버전 확인 명령" />
            <div className={styles.runtimeNote}>
              <div>
                <span>WINDOWS POWERSHELL</span>
                <strong>스크립트 실행이 차단되었다고 나오나요?</strong>
                <p>
                  npm이 만든 <code>codex.ps1</code>이 먼저 선택된 환경에서는 아래처럼 <code>codex.cmd</code>를 사용해 주세요.
                  실행 정책을 변경하지 않아도 됩니다.
                </p>
              </div>
              <CommandBlock command={CODEX_CHECK_WINDOWS_FALLBACK} label="Windows PowerShell용 Codex CLI 확인 명령" />
            </div>
            <CommandBlock command={BUN_CHECK} label="Bun 버전 확인 명령" />

            <div className={styles.osGrid}>
              <div className={styles.subCard}>
                <div>
                  <span className={styles.osLabel}>WINDOWS</span>
                  <strong>PowerShell에서 Bun 설치</strong>
                  <p>Bun 설치 자체는 가능하지만 공식 Sol Advisor v0.5.0 설정 MCP는 이슈 #20으로 차단됩니다. 현재는 설치 확인까지만 진행해 주세요.</p>
                </div>
                <CommandBlock command={BUN_INSTALL_WINDOWS} label="Windows용 Bun 설치 명령" />
              </div>

              <div className={styles.subCard}>
                <div>
                  <span className={styles.osLabel}>macOS · LINUX</span>
                  <strong>터미널에서 Bun 설치</strong>
                  <p>Linux에서는 설치 전에 <code>unzip</code> 패키지가 필요할 수 있습니다.</p>
                </div>
                <CommandBlock command={BUN_INSTALL_UNIX} label="macOS와 Linux용 Bun 설치 명령" />
              </div>
            </div>

            <div className={styles.officialLinks}>
              <a className={styles.textLink} href="https://learn.chatgpt.com/docs/codex/cli" target="_blank" rel="noreferrer noopener">
                Codex CLI 공식 설치 문서 ↗
              </a>
              <a className={styles.textLink} href="https://bun.sh/docs/installation" target="_blank" rel="noreferrer noopener">
                Bun 공식 설치 문서 ↗
              </a>
            </div>
          </GuideStep>

          <GuideStep number="02" eyebrow="PLUGIN" title="Sol Advisor를 Codex에 설치해 주세요">
            <p className={styles.bodyText}>
              아래 두 줄은 Codex 앱의 채팅창이 아니라 터미널에 붙여넣어 주세요. Windows PowerShell과 macOS·Linux 터미널에서 같은 Codex 명령을 사용합니다.
            </p>
            <CommandBlock command={PLUGIN_INSTALL} label="Sol Advisor 설치 명령" />
            <div className={styles.runtimeNote}>
              <div>
                <span>WINDOWS POWERSHELL</span>
                <strong><code>codex</code>가 실행 정책에 막힐 때</strong>
                <p>오류가 없는 경우에는 위 공식 명령을 사용합니다. 스크립트 실행 차단 오류가 있을 때만 아래 대체 명령을 사용해 주세요.</p>
              </div>
              <CommandBlock command={PLUGIN_INSTALL_WINDOWS_FALLBACK} label="Windows PowerShell용 Sol Advisor 설치 대체 명령" />
            </div>
            <p className={styles.checkLine}>
              설치 뒤 <code>{PLUGIN_CHECK}</code>를 실행해 목록에 <code>sol-advisor</code>가 보이는지 확인해 주세요.
              Windows 실행 정책 오류가 있었던 환경에서는 <code>{PLUGIN_CHECK_WINDOWS_FALLBACK}</code>를 사용합니다.
            </p>
            <div className={styles.repeatNote}>
              <span aria-hidden="true">●</span>
              <p><strong>설치 뒤 Codex 앱을 완전히 종료했다가 다시 실행해 주세요.</strong> 새 작업만 여는 것으로는 Bun PATH와 새 플러그인 도구가 반영되지 않을 수 있습니다.</p>
            </div>
            <div className={styles.skipCard}>
              <span>이번 가이드에서는 실행하지 않습니다</span>
              <strong>install-agents.sh</strong>
              <p>Luna만 사용하신다면 필요하지 않습니다. 이 스크립트는 Native 호환 경로용이며 <code>sh</code>와 <code>jq</code>가 필요하므로 Windows PowerShell 명령으로 그대로 실행할 수 없습니다.</p>
            </div>
          </GuideStep>

          <GuideStep number="03" eyebrow="FIRST USE" title="새 작업에서 첫 설정을 완료해 주세요">
            <p className={styles.bodyText}>
              지원되는 호스트에서 플러그인을 설치한 뒤 Codex 데스크톱 앱의 새 작업을 열어 주세요. Windows 공식 v0.5.0에서는 이 단계가 차단됩니다. 검증되지 않은 로컬 패치를 일반 설치 가이드로 사용하지 마세요.
            </p>
            <CommandBlock command={SETUP_PROMPT} label="Sol Advisor 첫 설정 요청문" />
            <ol className={styles.checklist}>
              <li>클라이언트는 <b>Codex</b>를 선택합니다.</li>
              <li>프로젝트 범위와 실제 작업 폴더를 지정합니다.</li>
              <li>모델 선택기 또는 <code>/model</code>에 표시되는 routine·high·advisor의 정확한 모델 ID를 확인합니다.</li>
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

          <GuideStep number="04" eyebrow="SMOKE TEST" title="읽기 전용 호환성 점검을 먼저 실행해 주세요">
            <p className={styles.bodyText}>
              설치 목록만으로는 충분하지 않습니다. 아래 점검이 정확한 표식을 반환해야 플러그인 설정, Luna · Max, 필수 앱 작업 도구가 실제로 연결된 것입니다.
            </p>
            <CommandBlock command={SMOKE_PROMPT} label="Sol Advisor Luna Max 읽기 전용 스모크 테스트 요청문" />
            <div className={styles.nativeCard}>
              <span>BLOCKED가 나오면</span>
              <p>다른 모델이나 Native 경로로 대신 진행하지 마세요. 앱 완전 재시작, 설정 완료 여부, 필수 앱 작업 도구 여섯 개를 확인한 뒤 다시 점검합니다.</p>
            </div>
          </GuideStep>

          <GuideStep number="05" eyebrow="LUNA · MAX" title="현재 요청에 Luna 작업 승인을 붙여 주세요">
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
            <p>현재 요청에 승인 문장이 있는지, 첫 설정이 끝났는지, Codex 앱에서 Luna·Max와 필수 앱 작업 도구 여섯 개를 모두 사용할 수 있는지 확인해 주세요.</p>
          </div>
          <div>
            <span>04</span>
            <h3>Windows에서 설정 또는 Luna 도구가 막힙니다</h3>
            <p>설정 실패는 공식 v0.5.0의 이슈 #20과 일치할 수 있습니다. 설정이 통과해도 <code>wait_threads</code> 등 필수 앱 작업 도구 여섯 개가 모두 있어야 Luna 경로를 사용할 수 있습니다. Windows ACL을 임의로 변경하지 말고 maintainer가 확정한 수정본과 호스트 지원을 기다려 주세요.</p>
          </div>
        </div>
      </section>

      <footer className={styles.guideFooter}>
        <div>
          <p>검증 기준</p>
          <strong>Sol Advisor v0.5.0 · Codex CLI 0.147.0</strong>
          <span>2026년 8월 14일 확인 · PR #22 기반 로컬 수정본은 설정 저장·검증을 통과했습니다. 공식 v0.5.0은 아직 Windows에서 차단되며, 현재 호스트에는 wait_threads가 없어 Luna / Max 전체 경로는 통과하지 못했습니다.</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://github.com/DannyMac180/sol-advisor" target="_blank" rel="noreferrer noopener">Sol Advisor 원본 ↗</a>
          <a href="https://learn.chatgpt.com/docs/app" target="_blank" rel="noreferrer noopener">Codex 앱 공식 안내 ↗</a>
        </div>
      </footer>
    </article>
  )
}
