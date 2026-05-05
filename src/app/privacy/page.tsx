export default function PrivacyPage() {
  return (
    <div className="bg-[#0A103D] min-h-screen text-white pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-center">개인정보처리방침</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed text-sm">
          <p>
            사단법인 직장인밴드연합회(이하 "연합회")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>
          <p>
            <strong>1. 수집하는 개인정보의 항목 및 수집방법</strong><br />
            - 수집항목: 이메일, 닉네임, 비밀번호 (회원가입 시)<br />
            - 수집방법: 홈페이지 회원가입 및 서비스 이용 과정에서 수집
          </p>
          <p>
            <strong>2. 개인정보의 수집 및 이용목적</strong><br />
            연합회는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
            - 회원 관리: 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 분쟁 조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달
          </p>
          <p>
            <strong>3. 개인정보의 보유 및 이용기간</strong><br />
            원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 연합회는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
          </p>
          <p>
            <strong>4. 개인정보의 파기절차 및 방법</strong><br />
            - 파기절차: 회원이 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.<br />
            - 파기방법: 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
          </p>
          <p>
            <strong>5. 개인정보 제공</strong><br />
            연합회는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
          </p>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <a href="/" className="inline-block px-6 py-3 bg-accent text-[#0A103D] font-bold rounded-lg shadow-sm hover:bg-[#82C8FF] transition-colors">
              홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
