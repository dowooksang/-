export default function AdminLayout({ children }: { children: React.ReactNode }) {
// 멍청한 권한 검사 로직(두 번째 경호원) 싹 다 해고!!!
// 묻지도 따지지도 않고 대시보드(children)를 그대로 보여줍니다.
return (
  <div className="admin-layout-wrapper">
    {children}
  </div>
);
}