export default function TermsPage() {
  return (
    <div className="bg-[#0A103D] min-h-screen text-white pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-center">이용약관</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed text-sm">
          <p>
            <strong>제1조 (목적)</strong><br />
            본 약관은 사단법인 직장인밴드연합회(이하 "연합회"라 합니다)가 제공하는 웹사이트 및 관련 서비스의 이용조건 및 절차, 연합회와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
          </p>
          <p>
            <strong>제2조 (용어의 정의)</strong><br />
            1. "회원"이란 본 약관에 동의하고 연합회 웹사이트에 가입하여 서비스를 이용하는 자를 말합니다.<br />
            2. "게시물"이란 회원이 서비스를 이용함에 있어 웹사이트에 게시한 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.
          </p>
          <p>
            <strong>제3조 (회원가입 및 계정)</strong><br />
            1. 회원가입은 가입 희망자가 본 약관 및 개인정보처리방침에 동의한 후, 연합회가 정한 양식에 따라 회원정보를 기입하여 신청하고 연합회가 이를 승낙함으로써 이루어집니다.<br />
            2. 회원은 본인의 계정(아이디 및 비밀번호 등)을 안전하게 관리할 책임이 있으며, 이를 제3자에게 양도하거나 대여할 수 없습니다.
          </p>
          <p>
            <strong>제4조 (서비스의 제공 및 변경)</strong><br />
            1. 연합회는 회원에게 밴드 커뮤니티, 게시판, 공지사항 등 다양한 서비스를 제공합니다.<br />
            2. 연합회는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.
          </p>
          <p>
            <strong>제5조 (게시물의 관리)</strong><br />
            1. 회원이 작성한 게시물의 저작권은 해당 회원에게 귀속됩니다. 단, 연합회는 서비스의 운영, 홍보 등을 위해 해당 게시물을 무상으로 사용할 수 있습니다.<br />
            2. 회원은 타인의 권리를 침해하거나 법령에 위반되는 게시물을 작성할 수 없으며, 연합회는 이에 해당하는 게시물을 사전 통보 없이 삭제할 수 있습니다.
          </p>
          <p>
            <strong>제6조 (면책 조항)</strong><br />
            연합회는 천재지변, 불가항력적 사유, 회원의 귀책사유로 인한 서비스 이용 장애나 데이터 손실 등에 대해 책임을 지지 않습니다.
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
